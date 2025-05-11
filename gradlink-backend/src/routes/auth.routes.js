import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const authRoutes = (dataSource) => {
  const router = express.Router();
  const userRepo = dataSource.getRepository("User");

  router.post("/register", async (req, res) => {
    const { name, email, password, institutionalEmail, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    try {
      // 1) Validar dominio (si envían institutionalEmail)
      if (institutionalEmail) {
        const allowed = process.env.ALLOWED_INSTITUTIONAL_DOMAINS.split(",");
        const domain = institutionalEmail.split("@")[1];
        if (!allowed.includes(domain)) {
          return res
            .status(400)
            .json({ error: "Dominio institucional no permitido." });
        }
      }

      // 2) Crear usuario con role=client
      const newUser = userRepo.create({
        name,
        email,
        password: hashed,
        institutionalEmail: institutionalEmail || null,
        institutionalEmailVerified: false,
        role: role || "client",
      });
      const savedUser = await userRepo.save(newUser);

      // 3) Si hay institutionalEmail, enviar mail de verificación
      if (institutionalEmail) {
        // cuenta de prueba Ethereal
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        // Generar token y URL
        const token = jwt.sign(
          { userId: savedUser.id },
          process.env.JWT_VERIF_SECRET,
          { expiresIn: "1d" }
        );
        const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-institutional?token=${token}`;

        // Enviar correo
        const info = await transporter.sendMail({
          from: `"GradLink" <no-reply@gradlink.com>`,
          to: institutionalEmail,
          subject: "Verifica tu correo institucional",
          html: `
            <p>Hola ${name},</p>
            <p>Haz clic <a href="${verifyUrl}">aquí</a> para verificar tu correo institucional.</p>
            <p>Este enlace caduca en 24 horas.</p>
          `,
        });

        // Mostrar en consola la URL de previsualización de Ethereal
        console.log("⚡ Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }

      return res.status(201).json({
        message:
          "Usuario registrado." +
          (institutionalEmail
            ? " Revisa la consola para el enlace de verificación."
            : ""),
        user: {
          id: savedUser.id,
          email: savedUser.email,
          name: savedUser.name,
          institutionalEmail: savedUser.institutionalEmail,
          institutionalEmailVerified: savedUser.institutionalEmailVerified,
          role: savedUser.role,
        },
      });
    } catch (err) {
      console.error("Error en /register:", err);
      return res
        .status(400)
        .json({ error: err.message || "Email ya en uso o datos inválidos." });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await userRepo.findOneBy({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        institutionalEmail: user.institutionalEmail,
        institutionalEmailVerified: user.institutionalEmailVerified,
        role: user.role,
      },
    });
  });

  router.get("/verify-institutional", async (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(400).send("Token requerido.");

    try {
      // Validar token JWT
      const { userId } = jwt.verify(token, process.env.JWT_VERIF_SECRET);
      const user = await userRepo.findOneBy({ id: userId });
      if (!user || !user.institutionalEmail) {
        return res.status(400).send("Usuario no válido.");
      }
      if (user.institutionalEmailVerified) {
        return res.send("Ya has verificado tu correo institucional, Puedes cerrar esta ventana.");
      }

      // Marcar verificado y asignar rol
      user.institutionalEmailVerified = true;
      user.role = "student";
      const newToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      await userRepo.save(user);

      // Redirigir a tu frontend o mostrar mensaje
      return res.redirect(`${process.env.FRONTEND_URL}/?token=${encodeURIComponent(newToken)}`);
      //return res.send("Correo institucional verificado exitosamente. Ahora tienes el rol de estudiante.");
    } catch (err) {
      console.error(err);
      return res.status(400).send("Token inválido o expirado.");
    }
  });


  // Ruta protegida: /me
  router.get("/me", authenticateToken, async (req, res) => {
    const user = await userRepo.findOneBy({ id: req.user.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      institutionalEmail: user.institutionalEmail,
      institutionalEmailVerified: user.institutionalEmailVerified,
      role: user.role,
    });
  });

  router.put("/me", authenticateToken, async (req, res) => {
    // 1) Si viene ?token=… en la URL, lo usamos para verificar el correo
    const verifyToken = req.query.token;
    if (verifyToken) {
      try {
        // Validar token de verificación
        const { userId } = jwt.verify(verifyToken, process.env.JWT_VERIF_SECRET);
        const userToVerify = await userRepo.findOneBy({ id: userId });
        if (!userToVerify || !userToVerify.institutionalEmail) {
          return res.status(400).json({ error: "Usuario no válido o sin correo institucional." });
        }
        if (userToVerify.institutionalEmailVerified) {
          return res.status(200).json({ message: "Ya verificado previamente." });
        }

        // Marcar verificado y asignar rol
        userToVerify.institutionalEmailVerified = true;
        userToVerify.role = "student";
        await userRepo.save(userToVerify);

        // Generar nuevo JWT con el rol actualizado
        const newAuthToken = jwt.sign(
          { id: userToVerify.id, role: userToVerify.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.json({
          message: "Correo institucional verificado. Ahora eres estudiante.",
          token: newAuthToken,
          user: {
            id: userToVerify.id,
            name: userToVerify.name,
            email: userToVerify.email,
            institutionalEmail: userToVerify.institutionalEmail,
            institutionalEmailVerified: userToVerify.institutionalEmailVerified,
            role: userToVerify.role,
          },
        });
      } catch (err) {
        console.error("Error verif. inst.:", err);
        return res.status(400).json({ error: "Token inválido o expirado." });
      }
    }

    // 2) Si no hay token, es un simple update de perfil
    const { name, password, institutionalEmail } = req.body;
    try {
      const user = await userRepo.findOneBy({ id: req.user.id });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

      // Actualizar nombre o password
      if (name) user.name = name;
      if (password) user.password = await bcrypt.hash(password, 10);

      // Si cambia el correo institucional, resetear flags y enviar nuevo mail
      if (institutionalEmail && institutionalEmail !== user.institutionalEmail) {
        const allowed = process.env.ALLOWED_INSTITUTIONAL_DOMAINS.split(",");
        const domain = institutionalEmail.split("@")[1];
        if (!allowed.includes(domain)) {
          return res.status(400).json({ error: "Dominio institucional no permitido." });
        }

        user.institutionalEmail = institutionalEmail;
        user.institutionalEmailVerified = false;
        user.role = "client";

        // Generar token de verificación y URL
        const mailToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_VERIF_SECRET,
          { expiresIn: "1d" }
        );
        const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-institutional?token=${mailToken}`;

        // Enviar correo (Ethereal o real)
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        const info = await transporter.sendMail({
          from: `"GradLink" <no-reply@gradlink.com>`,
          to: institutionalEmail,
          subject: "Verifica tu correo institucional",
          html: `
            <p>Hola ${user.name},</p>
            <p>Haz clic <a href="${verifyUrl}">aquí</a> para verificar tu correo institucional.</p>
            <p>Este enlace caduca en 24h.</p>
          `,
        });
        console.log("⚡ Preview URL:", nodemailer.getTestMessageUrl(info));
      }

      await userRepo.save(user);
      res.json({ message: "Perfil actualizado. Si cambiaste correo, revisa tu email para verificar." });
    } catch (err) {
      console.error("Error en PUT /me:", err);
      res.status(500).json({ error: "Error al actualizar el perfil." });
    }
  });



  return router;
};

export default authRoutes;

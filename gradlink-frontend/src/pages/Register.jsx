import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
} from "@mui/material";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al registrar");

      const data = await res.json();
      login({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Crear cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Correo"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Registrarse
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          ¿Ya tienes cuenta?{" "}
          <Link component={RouterLink} to="/login">
            Inicia sesión aquí
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;

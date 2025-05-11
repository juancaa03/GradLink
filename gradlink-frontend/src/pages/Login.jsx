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
import Footer from "../components/Footer";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();
      login({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Container  sx={{ height: "100vh" }} maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Inicia sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              Entrar
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿No tienes cuenta?{" "}
            <Link component={RouterLink} to="/register">
              Regístrate aquí
            </Link>
          </Typography>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default Login;

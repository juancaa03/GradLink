import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
} from "@mui/material";

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [role] = useState(user?.role || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    try {
      const payload = { name: trimmedName };
      if (password.trim()) {
        payload.password = password.trim();
      }

      const res = await fetch(`http://localhost:4000/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al actualizar el perfil");

      const updatedUser = { ...user, name: trimmedName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage("Perfil actualizado correctamente.");
      setError(null);
      setPassword(""); // Limpiar el campo de contraseña tras actualizar
    } catch (err) {
      setMessage(null);
      setError("Error al actualizar el perfil.");
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Mi perfil
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Correo electrónico"
            value={email}
            fullWidth
            disabled
          />

          <TextField label="Rol" value={role} fullWidth disabled />

          <TextField
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            placeholder="Déjalo vacío si no deseas cambiarla"
          />

          <Button variant="contained" onClick={handleUpdate}>
            Guardar cambios
          </Button>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;

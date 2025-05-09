import { useState, useEffect } from "react";
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

  // Local state para el formulario
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [institutionalEmail, setInstitutionalEmail] = useState(
    user?.institutionalEmail || ""
  );
  const [role, setRole] = useState(user?.role || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Función para volver a cargar el perfil desde /me
  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No pude recargar perfil");
      const fresh = await res.json();
      setUser(fresh);
      setName(fresh.name);
      setInstitutionalEmail(fresh.institutionalEmail || "");
      setRole(fresh.role);
    } catch (e) {
      console.error(e);
    }
  };

  // Opcional: recarga al montar el componente por si cambió rol en otro lado
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    try {
      // Construye payload
      const payload = { name: trimmedName };
      if (password.trim()) payload.password = password.trim();
      if (institutionalEmail.trim()) {
        payload.institutionalEmail = institutionalEmail.trim();
      }

      const res = await fetch(`http://localhost:4000/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar el perfil");

      // Si todo ok, recarga perfil para actualizar rol y email verificado
      await fetchProfile();

      setMessage("Perfil actualizado correctamente.");
      setError(null);
      setPassword("");
    } catch (err) {
      console.error(err);
      setMessage(null);
      setError(err.message);
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

          <TextField
            label="Correo institucional"
            value={institutionalEmail}
            onChange={(e) => setInstitutionalEmail(e.target.value)}
            fullWidth
            placeholder="usuario@institucion.edu"
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

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const EditService = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/services/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar el servicio");

        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location || "",
          tags: data.tags || [],
        });
      } catch (err) {
        alert("Error al cargar datos del servicio");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    const tagName = newTag.trim().toLowerCase();
    if (tagName && !form.tags.some((t) => t.name === tagName)) {
      setForm({ ...form, tags: [...form.tags, { name: tagName }] });
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove) => {
    setForm({
      ...form,
      tags: form.tags.filter((tag) => tag.name !== tagToRemove.name),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar el servicio");

      const updated = await res.json();
      alert("Servicio actualizado correctamente");
      navigate(`/service/${updated.id}`, { replace: true });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/my-services")} sx={{ mb: 2 }}>
          ← Volver a mis servicios
        </Button>

        <Typography variant="h5" gutterBottom>
          Editar servicio
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Título"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            label="Precio (€)"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            inputProps={{ step: "0.01", min: 0 }}
            required
          />
          <TextField
            label="Población (opcional)"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ciudad o localidad"
            fullWidth
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Etiquetas
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
              {form.tags.map((tag) => (
                <Chip key={tag.name} label={tag.name} onDelete={() => removeTag(tag)} />
              ))}
            </Stack>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Nueva etiqueta"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <IconButton onClick={addTag} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <Button variant="contained" color="primary" type="submit">
            Guardar cambios
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditService;

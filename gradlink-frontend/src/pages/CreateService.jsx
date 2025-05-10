import { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const CreateService = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    tags: [],
  });

  const [newTag, setNewTag] = useState("");

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
      const res = await fetch("http://localhost:4000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
        }),
      });

      if (!res.ok) throw new Error("Error al crear el servicio");

      const data = await res.json();
      alert("Servicio publicado con éxito");
      navigate(`/service/${data.id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Publicar un nuevo servicio
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
            label="Población o Online"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ciudad/Localidad o Online"
            fullWidth
            required
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Etiquetas
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
              {form.tags.map((tag) => (
                <Chip
                  key={tag.name}
                  label={tag.name}
                  onDelete={() => removeTag(tag)}
                />
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

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Publicar servicio
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (confirm("¿Seguro que quieres cancelar la creación?")) {
                  navigate("/");
                }
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateService;

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Divider,
  Button,
  Badge,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Conversations = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/messages/conversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error cargando conversaciones");

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  const handleDelete = async (userId) => {
    const confirmDelete = confirm("¿Seguro que quieres borrar esta conversación?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:4000/api/messages/with/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al borrar conversación");

      setConversations((prev) => prev.filter((c) => c.user.id !== userId));
    } catch (err) {
      alert("No se pudo borrar la conversación");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Tus conversaciones</Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>
          ← Volver al inicio
        </Button>
      </Box>

      {conversations.length === 0 ? (
        <Typography variant="body2">No has iniciado ninguna conversación aún.</Typography>
      ) : (
        <Paper>
          <List>
            {conversations.map((conv, index) => (
              <div key={conv.user.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <ListItemButton
                    sx={{ flex: 1 }}
                    onClick={() => navigate(`/chat/${conv.user.id}`)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <ListItemText
                        primary={conv.user.name}
                        secondary={conv.lastMessage}
                      />
                      {conv.hasUnread && (
                        <Badge
                          color="error"
                          variant="dot"
                          sx={{
                            "& .MuiBadge-badge": {
                              right: 0,
                              top: "50%",
                              transform: "translateY(-50%)",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </ListItemButton>

                  <Tooltip title="Borrar conversación">
                    <IconButton
                      onClick={() => handleDelete(conv.user.id)}
                      size="small"
                      edge="end"
                      sx={{ ml: 1 }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {index < conversations.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Conversations;

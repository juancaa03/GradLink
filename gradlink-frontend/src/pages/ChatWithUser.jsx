import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ChatWithUser = () => {
  const { user, token, setHasUnread } = useAuth();
  const { userId } = useParams();
  const location = useLocation();
  const serviceId = location.state?.serviceId || null;

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef();
  const navigate = useNavigate();

  // 1. Marcar mensajes como leídos al entrar
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch(`http://localhost:4000/api/messages/mark-read/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHasUnread(false);
      } catch (err) {
        console.error("Error marcando como leídos", err.message);
      }
    };

    markAsRead();
  }, [userId, token, setHasUnread]);

  // 2. Obtener mensajes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/messages/with/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener mensajes");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMessages();
  }, [userId, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: parseInt(userId),
          content,
          serviceId,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar el mensaje");

      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setContent("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ height: "100vh", mt: 15 }}>
        <Paper sx={{ p: 3, height: "70vh", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/conversations")}>
                  ← Volver a conversaciones
              </Button>
              <Button variant="outlined" onClick={() => navigate("/")}>
                  Inicio
              </Button>
          </Box>

          <Typography variant="h6" gutterBottom>
            Chat con{" "}
            {
              messages.length > 0
                ? (messages.find(m => m.sender.id !== user.id)?.sender.name ||
                  messages.find(m => m.receiver.id !== user.id)?.receiver.name ||
                  `usuario #${userId}`)
                : `usuario #${userId}`
            }
          </Typography>

          <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2, pr: 1 }}>
            <Stack spacing={1}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: msg.sender.id === user.id ? "flex-end" : "flex-start",
                    backgroundColor:
                      msg.sender.id === user.id ? "#e0f7fa" : "#f1f1f1",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Escribe tu mensaje..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button variant="contained" onClick={handleSend}>
              Enviar
            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default ChatWithUser;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyServices = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/services/my-services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error cargando tus servicios");

        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ height: "100vh", mt: 15 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Mis servicios publicados</Typography>
        <Button sx={{ borderRadius: '99px', color: '#f0c987', borderColor: '#f0c987', "&:hover": {
              backgroundColor: "#f0c987",
              borderColor: "#2c3544",
              color: "#2c3544",
              transition: "all 0.3s ease-in-out",
            },}} variant="outlined" onClick={() => navigate("/")}>
            Volver al inicio
        </Button>
        </Box>

        {services.length === 0 ? (
          <Typography variant="body2">No has publicado ningún servicio aún.</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              mt: 2,
            }}
          >
            {services.map((service) => (
              <Card
                key={service.id}
                sx={{ p: 2, cursor: "pointer" }}
                onClick={() => navigate(`/service/${service.id}`)}
              >
                <CardContent>
                  <Typography variant="h6">{service.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-service/${service.id}`);
                        }}
                  >
                      Editar
                  </Button>
                  <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm("¿Seguro que quieres eliminar este servicio?")) {
                            try {
                              const res = await fetch(`http://localhost:4000/api/services/${service.id}`, {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              });
                        
                              if (!res.ok) throw new Error("Error al eliminar el servicio");
                        
                              setServices((prev) => prev.filter((s) => s.id !== service.id));
                            } catch (err) {
                              alert("No se pudo eliminar el servicio");
                              console.error(err);
                            }
                          }
                        }}
                        
                  >
                      Eliminar
                  </Button>
                  </Box>
              </Card>
            ))}
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MyServices;

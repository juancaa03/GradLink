import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext.jsx";
import "../../src/App.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  const { login, user, token, setHasUnread } = useAuth();
  const { searchTerm } = useContext(SearchContext);
  const [services, setServices] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filterUser, setFilterUser] = useState("");

  // 1) Refrescar perfil si hay token en URL
  useEffect(() => {
    const newToken = searchParams.get("token");
    if (!newToken) return;

    fetch(`http://localhost:4000/api/auth/me`, {
      headers: { Authorization: `Bearer ${newToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No puedo refrescar perfil");
        return res.json();
      })
      .then((freshUser) => {
        login({ token: newToken, user: freshUser });
        setSearchParams({});
      })
      .catch(() => navigate("/login"));
  }, [login, navigate, searchParams, setSearchParams]);

  // 2) Mensajes no leídos
  useEffect(() => {
    const checkUnread = async () => {
      const res = await fetch("http://localhost:4000/api/messages/has-unread", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHasUnread(data.hasUnread);
    };
    checkUnread();
    window.addEventListener("focus", checkUnread);
    return () => window.removeEventListener("focus", checkUnread);
  }, [token, setHasUnread]);

  // 3) Conteo carrito
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:4000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartCount(data.length);
    })();
  }, [token]);

  // 4) Carga de servicios cada vez que cambien token, searchTerm o filtros
  useEffect(() => {
    const fetchServices = async () => {
      const params = new URLSearchParams();
      if (searchTerm)      params.append("q", searchTerm);
      if (minPrice)        params.append("minPrice", minPrice);
      if (maxPrice)        params.append("maxPrice", maxPrice);
      if (locationFilter)  params.append("location", locationFilter);
      if (filterUser)      params.append("user", filterUser);

      const baseUrl = "http://localhost:4000/api/services";
      const qs      = params.toString();
      const url     = qs ? `${baseUrl}?${qs}` : baseUrl;

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    };

    fetchServices();
  }, [token, searchTerm, minPrice, maxPrice, locationFilter, filterUser]);

  return (
    <>
      <Navbar />

      <Container sx={{ mt: 4, paddingTop: "96px" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#f0f4f8",
            textAlign: "center",
            mb: 2,
            mt: 2,
          }}
        >
          Bienvenido/a,{" "}
          <Box component="span" sx={{ color: "#f0f4f8" }}>
            {user?.name || "usuario"}!
          </Box>
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 4,
            flexWrap: "nowrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", color: "#f1ebe3" }}>
            {user?.role !== "client" && (
              <Button
                color="#f1ebe3"
                onClick={() =>
                  window.open(`${window.location.origin}/create-service`, "_blank")
                }
                sx={{
                  background: `
                    linear-gradient(
                      to top,
                      rgba(20, 28, 38, 0.9) 0%,
                      rgba(30, 40, 55, 0.88) 40%,
                      rgba(40, 52, 70, 0.85) 100%
                    )
                  `,
                  backdropFilter: "blur(14px)",
                  backgroundBlendMode: "lighten",
                  borderRadius: "99px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#f1f4f8",
                  px: 1.7,
                  py: 0.5,
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  boxShadow: "0 6px 36px rgba(255, 255, 255, 0.08)",
                  "&:hover": {
                    boxShadow: "0 8px 48px rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                +
              </Button>
            )}
            {user?.role !== "client" && (
              <Button
                color="#11294d"
                onClick={() => navigate("/my-services")}
                sx={{
                  background: `
                    linear-gradient(
                      to top,
                      rgba(20, 28, 38, 0.9) 0%,
                      rgba(30, 40, 55, 0.88) 40%,
                      rgba(40, 52, 70, 0.85) 100%
                    )
                  `,
                  backdropFilter: "blur(14px)",
                  backgroundBlendMode: "lighten",
                  borderRadius: "99px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#f1f4f8",
                  px: 1.7,
                  py: 1,
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  boxShadow: "0 6px 36px rgba(255, 255, 255, 0.08)",
                  "&:hover": {
                    boxShadow: "0 8px 48px rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Mis servicios
              </Button>
            )}
            {user?.role === "admin" && (
              <Button
                color="#11294d"
                onClick={() => navigate("/admindashboard")}
                sx={{
                  background: `
                    linear-gradient(
                      to top,
                      rgba(20, 28, 38, 0.9) 0%,
                      rgba(30, 40, 55, 0.88) 40%,
                      rgba(40, 52, 70, 0.85) 100%
                    )
                  `,
                  backdropFilter: "blur(14px)",
                  backgroundBlendMode: "lighten",
                  borderRadius: "99px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#f1f4f8",
                  px: 1.7,
                  py: 1,
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  boxShadow: "0 6px 36px rgba(255, 255, 255, 0.08)",
                  "&:hover": {
                    boxShadow: "0 8px 48px rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Dashboard
              </Button>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", px: 1.9, py: 0.5 }}>
            <TextField
              label="Usuario"
              size="small"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              sx={{
                width: 170,
                "& .MuiInputLabel-root.Mui-focused": { color: "#f0c987" },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#f0c987" },
                  "&.Mui-focused fieldset": { borderColor: "#f0c987" },
                },
              }}
            />
            <TextField
              label="Precio min"
              type="number"
              size="small"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={{
                width: 105,
                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]": { MozAppearance: "textfield" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#f0c987" },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#f0c987" },
                  "&.Mui-focused fieldset": { borderColor: "#f0c987" },
                },
              }}
            />
            <TextField
              label="Precio max"
              type="number"
              size="small"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{
                width: 107,
                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]": { MozAppearance: "textfield" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#f0c987" },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#f0c987" },
                  "&.Mui-focused fieldset": { borderColor: "#f0c987" },
                },
              }}
            />
            <TextField
              label="Población"
              size="small"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              sx={{
                width: 170,
                "& .MuiInputLabel-root.Mui-focused": { color: "#f0c987" },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#f0c987" },
                  "&.Mui-focused fieldset": { borderColor: "#f0c987" },
                },
              }}
            />
          </Box>
        </Box>

        {searchTerm && (
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Resultados para: <b>{searchTerm}</b>
          </Typography>
        )}

        {services.length === 0 && searchTerm ? (
          <Typography variant="body2">No se encontraron servicios.</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              marginBottom: 10,
            }}
          >
            {services.map((service) => (
              <Card
                key={service.id}
                sx={{
                  background: `
                    linear-gradient(
                      to top,
                      rgba(20, 28, 38, 0.9) 0%,
                      rgba(30, 40, 55, 0.88) 40%,
                      rgba(40, 52, 70, 0.85) 100%
                    )
                  `,
                  backdropFilter: "blur(14px)",
                  backgroundBlendMode: "lighten",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#f1f4f8",
                  p: 2,
                  marginBottom: 2,
                  maxWidth: 320,
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  boxShadow: "0 6px 36px rgba(255, 255, 255, 0.08)",
                  "&:hover": {
                    boxShadow: "0 8px 48px rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={() => navigate(`/service/${service.id}`)}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: "#545d6a", width: 32, height: 32, fontSize: 16 }}>
                      {service.user.name[0]}
                    </Avatar>
                    <Typography variant="subtitle2" color="#dbe6f3">
                      {service.user.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 1,
                      paddingTop: "10px",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="#dbe6f3">
                      {service.title}
                    </Typography>

                    <Box mt={1} display="flex" alignItems="baseline" gap={1}>
                      <Typography variant="caption" color="#dbe6f3">
                        desde
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="#dbe6f3">
                        €{parseFloat(service.price).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box mt={1} display="flex" flexWrap="wrap" gap={0.5} justifyContent="center">
                      {service.tags.map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag.name}
                          size="small"
                          variant="filled"
                          sx={{
                            fontSize: 10,
                            fontStyle: "italic",
                            fontWeight: 500,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: "999px",
                            backgroundColor: "#545d6a",
                            color: "#dbe6f3",
                          }}
                        />
                      ))}
                    </Box>

                    <Typography variant="caption" color="#dbe6f3" mt={1}>
                      Publicado el {new Date(service.createdAt).toLocaleDateString()}
                    </Typography>
                    {service.location && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "#f0c987" }} />
                        <Typography
                          sx={{ transform: "translateY(2px)", fontStyle: "italic" }}
                          variant="caption"
                          color="#f0c987"
                        >
                          {service.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      <Footer />
    </>
  );
}

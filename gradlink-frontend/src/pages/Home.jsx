import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Container,
  Card,
  CardContent,
  Button,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { styled, alpha } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Gradlink-logo-light-removebg.png";
import "../../src/App.css"

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "99px",
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

const Home = () => {
  const { logout, login, user, token, hasUnread, setHasUnread } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const newToken = searchParams.get("token");
    if (newToken) {
      fetch(`http://localhost:4000/api/auth/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      })
        .then((res) => res.ok ? res.json() : Promise.reject("Failed to refresh"))
        .then((freshUser) => {
          login({ token: newToken, user: freshUser });
          setSearchParams({}); // remove token from URL
        })
        .catch((err) => {
          console.error("Error refreshing profile:", err);
          navigate("/login");
        });
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/messages/has-unread", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al verificar mensajes");
        const data = await res.json();
        setHasUnread(data.hasUnread);
      } catch (err) {
        console.error(err.message);
      }
    };

    checkUnread();

    const handleFocus = () => checkUnread();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [token, setHasUnread]);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener carrito");
        const data = await res.json();
        setCartCount(data.length);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchCartCount();
  }, [token]);

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error cargando servicios");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchAllServices();
  }, [token]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length < 2) {
      try {
        const res = await fetch("http://localhost:4000/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error cargando servicios");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err.message);
      }
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/services?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error buscando servicios");

      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 960,
          backgroundImage: "linear-gradient(to right, #2c3e50, #bdc3c7)",
          color: "#fdf5e7",
          borderRadius: "99px",
          padding: "0.25rem 1rem",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
        }}>
        <Toolbar sx={{ position: "relative", minHeight: "56px" }}>
          {/* Sección izquierda */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={logo}
              alt="GradLink Logo"
              sx={{
                height: 48,
                width: "auto",
                objectFit: "contain",
                cursor: "pointer",
              }}
            />
          </Box>

          {/* Sección central: Buscador */}
          <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: "50%" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar servicios…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Search>
          </Box>

          {/* Sección derecha: iconos */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={() => navigate("/conversations")}>
              {hasUnread ? <MarkChatUnreadOutlinedIcon /> : <ChatBubbleOutlineIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>Perfil</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate("/orders"); }}>Mis compras</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, paddingTop: "96px" }}>
        <Typography variant="h4" 
          sx={{ fontWeight: 'bold', color: '#f0f4f8', textAlign: 'center', mb: 2, mt: 2 }}>
            Bienvenido,{" "}
          <Box component="span" sx={{ color: '#f0f4f8' }}>
            {user?.name || "usuario"}!
          </Box>
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", color: "#f1ebe3" }}>
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
                  {/* Usuario alineado a la izquierda */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: "#545d6a", width: 32, height: 32, fontSize: 16 }}>
                      {service.user.name[0]}
                    </Avatar>
                    <Typography variant="subtitle2" color="#dbe6f3">
                      {service.user.name}
                    </Typography>
                  </Box>

                  {/* Contenido centrado */}
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
                        ${parseFloat(service.price).toFixed(2)}
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
                  </Box>
                </CardContent>
              </Card>
            ))}

          </Box>
        )}
      </Container>
    </>
  );
};

export default Home;

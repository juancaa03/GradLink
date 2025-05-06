import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const { logout, user, token, hasUnread, setHasUnread } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

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
          <Typography variant="h5" 
          sx={{ fontWeight: 'bold', color: '#f0f4f8', }}>
            Bienvenido, {user?.name || "usuario"}!
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", color: "#f1ebe3" }}>
            <Button
              color="#f1ebe3"
              onClick={() =>
                window.open(`${window.location.origin}/create-service`, "_blank")
              }
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                borderRadius: "99px",
                padding: "0.5rem 1rem",
                '&:hover': {
                  backgroundColor: "#4c7f8a",
                  color: "#11294d",
                }
              }}
            >
              + Nuevo servicio
            </Button> 

            <Button
              color="#11294d"
              onClick={() => navigate("/my-services")}
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                borderRadius: "99px",
                padding: "0.5rem 1rem",
                '&:hover': {
                  backgroundColor: "#11294d",
                  color: "#c6d4dc",
                }
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
              gap: 2,
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {services.map((service) => (
              <Card
                key={service.id}
                sx={{
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#dbe6f3",
                  p: 2,
                  minWidth: 250,
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0 6px 40px rgba(0, 0, 0, 0.25)",
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={() => navigate(`/service/${service.id}`)}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: "#4c7f8a", width: 32, height: 32, fontSize: 16 }}>
                      {service.user.name[0]}
                    </Avatar>
                    <Typography variant="subtitle2" color="dbe6f3">
                      {service.user.name}
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight={600} color="#dbe6f3">
                    {service.title}
                  </Typography>

                  <Box mt={1} display="flex" alignItems="baseline" gap={1}>
                    <Typography variant="caption" color="dbe6f3">
                      desde
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#dbe6f3">
                      ${parseFloat(service.price).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
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
                          backgroundColor: "#e6eaf3", // fondo suave
                          color: "#11284b",           // texto más oscuro
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="caption" color="dbe6f3" mt={1}>
                    Publicado el {new Date(service.createdAt).toLocaleDateString()}
                  </Typography>
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

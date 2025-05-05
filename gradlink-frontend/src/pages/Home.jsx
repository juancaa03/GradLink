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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
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
      <AppBar position="static" sx={{ backgroundColor: "#11294d", color: "#fdf5e7" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GradLink
          </Typography>
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
            <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
              Perfil
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/orders"); }}>
              Mis compras
            </MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
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
          sx={{ fontWeight: 'bold', color: '#11294d' }}>
            Bienvenido, {user?.name || "usuario"}!
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() =>
                window.open(`${window.location.origin}/create-service`, "_blank")
              }
            >
              + Publicar nuevo servicio
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/my-services")}
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
                  backgroundColor: "#fdf5e7",
                  borderRadius: 3,
                  border: "1px solid #d0d7de",
                  p: 2,
                  minWidth: 250,
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => navigate(`/service/${service.id}`)}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: "#4c7f8a", width: 32, height: 32, fontSize: 16 }}>
                      {service.user.name[0]}
                    </Avatar>
                    <Typography variant="subtitle2" color="text.secondary">
                      {service.user.name}
                    </Typography>
                  </Box>

                  <Typography variant="h6" fontWeight={600} color="#11284b">
                    {service.title}
                  </Typography>

                  <Box mt={1} display="flex" alignItems="baseline" gap={1}>
                    <Typography variant="h5" fontWeight={700} color="#11284b">
                      ${parseFloat(service.price).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      desde
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

                  <Typography variant="caption" color="text.secondary" mt={1}>
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

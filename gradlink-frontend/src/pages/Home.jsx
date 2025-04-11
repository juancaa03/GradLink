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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
      <AppBar position="static">
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
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/conversations")}> 
            {hasUnread ? <MarkChatUnreadOutlinedIcon /> : <ChatBubbleOutlineIcon />} 
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
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
          <Typography variant="h5">
            Bienvenido, {user?.name || "usuario"} 👋
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
                sx={{ p: 2, cursor: "pointer" }}
                onClick={() => navigate(`/service/${service.id}`)}
              >
                <CardContent>
                  <Typography variant="h6">{service.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
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

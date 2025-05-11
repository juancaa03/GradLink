import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { styled, alpha } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext.jsx";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../assets/Gradlink-logo-light-removebg.png";
import {
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Badge,
  Menu,
  MenuItem,
  AppBar,
} from "@mui/material";

// Styled components for search bar
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

export default function Navbar() {
  const { login, logout, hasUnread, token, setHasUnread } = useAuth();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Refresh profile if token appears in URL
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

  // Check unread messages
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/messages/has-unread", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al verificar mensajes");
        const data = await res.json();
        setHasUnread(data.hasUnread);
      } catch (err) {
        console.error(err);
      }
    };

    checkUnread();
    window.addEventListener("focus", checkUnread);
    return () => window.removeEventListener("focus", checkUnread);
  }, [token, setHasUnread]);

  // Fetch cart count
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener carrito");
        const data = await res.json();
        setCartCount(data.length);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Update search term in context
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
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
      }}
    >
      <Toolbar sx={{ position: "relative", minHeight: "56px" }}>
        {/* Sección izquierda */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src={logo}
            alt="GradLink Logo"
            onClick={() => navigate("/home")}
            sx={{ height: 48, cursor: "pointer" }}
          />
        </Box>

        {/* Sección central: Buscador */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50%",
          }}
        >
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
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/profile");
              }}
            >
              Perfil
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/orders");
              }}
            >
              Mis compras
            </MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

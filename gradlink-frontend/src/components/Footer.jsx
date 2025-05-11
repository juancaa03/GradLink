import React from "react";
import { Box, Typography, Link, IconButton, Stack, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "../assets/Gradlink-logo-light-removebg.png";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        bgcolor: "#203040",
        color: "#f1f4f8",
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      <Box sx={{ px: { xs: 2, md: 4 }, mx: "auto", maxWidth: 1920 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src={logo}
              alt="GradLink Logo"
              sx={{ height: 40 }}
            />
            <Typography variant="body1">
              Conecta profesionales con estudiantes y empresas.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={3}
            sx={{ flexWrap: "wrap", justifyContent: "center" }}
          >
            {[
              ["Atención al cliente", "/ayuda"],
              ["Política de privacidad", "/privacidad"],
              ["Términos y condiciones", "/terminos"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                underline="hover"
                sx={{ color: "#f1f4f8", "&:hover": { color: "#ffffff" } }}
              >
                {label}
              </Link>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption">
            &copy; {new Date().getFullYear()} GradLink. Todos los derechos reservados.
          </Typography>

          <Box>
            {[
              { icon: <FacebookIcon />, href: "https://facebook.com" },
              { icon: <TwitterIcon />, href: "https://twitter.com" },
              { icon: <LinkedInIcon />, href: "https://linkedin.com" },
              { icon: <InstagramIcon />, href: "https://instagram.com" },
            ].map(({ icon, href }) => (
              <IconButton
                key={href}
                component="a"
                href={href}
                target="_blank"
                rel="noopener"
                sx={{ color: "#f1f4f8", "&:hover": { color: "#ffffff" } }}
              >
                {icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

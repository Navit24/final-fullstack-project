import { Box, Container, Link, Typography } from "@mui/material";

const Footer = () => (
  <Box
    component={"footer"}
    sx={{
      mt: "auto",
      py: 3,
      background:
        "linear-gradient(90deg, rgba(27,190,58,0.1) 0%, rgba(27,190,58,0.1) 100%)",
      borderTop: "1px solid  rgba(0,0,0,0.08)",
    }}
  >
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Feedit
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Share your thoughts, connect with friends, and discover new stories.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Link href="/about" underline="hover" color="inherit">
          About
        </Link>
        <Link href="/feed" underline="hover" color="inherit">
          Feed
        </Link>
        <Link
          href="mailto:support@feedit.com"
          underline="hover"
          color="inherit"
        >
          Contact
        </Link>
      </Box>

      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Feedit. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;

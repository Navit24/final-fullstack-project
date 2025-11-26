import { Box, Container, Grid, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AboutPage = () => (
  <Box
    sx={{
      minHeight: "100vh",
      background:
        "linear-gradient(180deg, rgba(240,250,245,1) 0%, rgba(227,242,253,1) 100%)",
      py: 8,
      mt: 8,
    }}
  >
    <Container maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 6 },
          borderRadius: 3,
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          About Feedit
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Feedit is a social space where you can share your thoughts, connect
          with friends, and discover stories from around the world. Our goal is
          to create a friendly and safe community for meaningful conversations.
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Why Feedit?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Share your voice with a supportive community.
              <br />
              • Create posts with rich media and beautiful designs.
              <br />• Follow friends, save your favorite posts, and stay
              inspired.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Built With Love
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Feedit is powered by React, TypeScript, Redux Toolkit,
              Material-UI, and Node.js. We’re committed to continuous
              improvement and welcoming feedback from our users.
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/feed"
            variant="contained"
            sx={{ bgcolor: "#1bbe3a" }}
          >
            Back to Feed
          </Button>
          <Button component={Link} to="/profile" variant="outlined">
            Visit Your Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  </Box>
);

export default AboutPage;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import FeedPage from "./pages/feed/FeedPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import { theme } from "./theme/theme";
import { useState } from "react";
import Footer from "./components/Footer";
import AboutPage from "./pages/about/AbotPage";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <BrowserRouter>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <main style={{ paddingTop: 80 }}>
                      <FeedPage searchTerm={searchTerm} />
                    </main>{" "}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />{" "}
              <Route
                path="/about"
                element={
                  <PublicRoute>
                    <AboutPage />
                  </PublicRoute>
                }
              />{" "}
            </Routes>{" "}
            <Footer />
          </Box>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

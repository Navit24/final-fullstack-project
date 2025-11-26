// ייבוא ספריות חיצוניות
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

// ייבוא קומפוננטות דפים
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import FeedPage from "./pages/feed/FeedPage";
import ProfilePage from "./pages/profile/ProfilePage";

// ייבוא קומפוננטות
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// ייבוא תצורה
import { theme } from "./theme/theme";
import { useState } from "react";
import Footer from "./components/Footer";
import AboutPage from "./pages/about/AbotPage";

/**
 * הקומפוננטה הראשית של האפליקציה
 * מגדירה את הניתוב הראשי ואת המבנה הכללי
 */

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    // ספק התמה - מגדיר את העיצוב הכללי של האפליקציה
    <ThemeProvider theme={theme}>
      {/* איפוס סגנונות ברירת מחדל */}
      <CssBaseline />

      {/* ספק הודעות - מציג הודעות הצלחה/שגיאה */}
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {/* ספק הניתוב */}
        <BrowserRouter>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* תפריט ניווט עליון */}
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {/* הגדרת הנתיבים */}
            <Routes>
              {/* דף הבית - מוביל לדף התחברות */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              {/* דף הפיד - דורש התחברות */}
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
              {/* דף התחברות - רק למשתמשים לא מחוברים */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              {/* דף הרשמה - רק למשתמשים לא מחוברים */}
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              {/* דף פרופיל - דורש התחברות */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              {/* נתיב ברירת מחדל - מוביל לדף התחברות */}
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

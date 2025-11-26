import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/userSlice";
import type { RootState } from "../store";
import {
  AppBar,
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import type { AppDispatch } from "../store";

type NavbarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const Navbar = ({ searchTerm, setSearchTerm }: NavbarProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    dispatch(logout());
    navigate("/login");
  };
  return (
    <AppBar position="fixed" sx={{ bgcolor: "#fff" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Typography
          component={Link}
          to="/feed"
          sx={{
            textDecoration: "none",
            "&:hover": { textDecoration: "none" },
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img
            src="/feedit-logo.svg"
            alt="Feedit Logo"
            style={{ height: "40px", verticalAlign: "middle", borderRadius: 8 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Feedit
          </Typography>
        </Typography>{" "}
        <Typography>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "100%",
              maxWidth: 700,
              "& .MuiInputBase-root": {
                height: 36,
              },
              "& .MuiInputLabel-root": {
                top: -6,
                fontSize: "0.85rem",
              },
            }}
          />
        </Typography>
        <Box>
          {user ? (
            <>
              <Typography
                variant="body1"
                sx={{ color: "gray", display: "inline", mr: 2 }}
              >
                hello,
                {user?.name?.first
                  ? `${user.name.first} ${user.name.last ?? ""}`
                  : user?.email ?? "Guest"}
              </Typography>
              <Button
                color="inherit"
                sx={{ color: "gray" }}
                component={Link}
                to="/profile"
              >
                profile
              </Button>
              <Button
                color="inherit"
                sx={{ color: "gray" }}
                onClick={handleLogout}
              >
                logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                sx={{ color: "gray" }}
                component={Link}
                to="/login"
              >
                login
              </Button>
              <Button
                color="inherit"
                sx={{ color: "gray" }}
                component={Link}
                to="/register"
              >
                register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;

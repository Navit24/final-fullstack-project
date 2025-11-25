import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const user = useSelector((state: RootState) => state.user.user);

  if (user) {
    // Redirect to feed if user is already logged in
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

import { useSession } from "@/lib/auth-client";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
  const { data: session } = useSession();

  if (session) return <Navigate to="/" replace />;

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AuthLayout;

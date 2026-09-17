import { useSession } from "@/lib/auth-client";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  if (session) return <Navigate to="/" replace />;

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AuthLayout;

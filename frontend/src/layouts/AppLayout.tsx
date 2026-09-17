import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

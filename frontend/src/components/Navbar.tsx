import { useSession } from "@/lib/auth-client";
import { PlusIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";
import ThemeSelector from "./ThemeSelector";
import { Img } from "@page-speed/img";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  return (
    <div className="navbar bg-base-300">
      <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
        {/* LOGO - LEFT SIDE */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2">
            <ShoppingBagIcon className="size-5 text-primary" />
            <span className="text-lg font-bold font-mono uppercase tracking-wider">
              Productify
            </span>
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          <ThemeSelector />
          {session ? (
            <>
              <Link to="/create" className="btn btn-primary btn-sm gap-1">
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New Product</span>
              </Link>
              <Link to="/profile" className="btn btn-ghost btn-sm gap-1">
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <ProfileDropdown>
                <div className="size-8.5 rounded-full overflow-hidden flex items-center justify-center bg-[#1DB954] cursor-pointer">
                  {session.user.image ? (
                    <Img
                      src={session.user.image}
                      alt="User image"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <p className="font-bold text-black">
                      {session.user.name.charAt(0).toUpperCase()}
                    </p>
                  )}
                </div>
              </ProfileDropdown>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

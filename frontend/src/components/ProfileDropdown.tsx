import { useState, type PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Loader2, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { toast } from "./ui/toast";

const ProfileDropdown = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignout = async () => {
    setLoading(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        console.error("Sign out failed:", error);
        toast.add({ type: "error", description: "Failed to sign out user." });
        return;
      }
      toast.add({
        type: "success",
        description: "User signed out successfully",
      });
    } catch (error) {
      toast.add({ type: "error", description: "Failed to Sign out user." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <LogOut className="size-4" />
            Signout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Signout confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to signout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleSignout}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span>Confirm</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileDropdown;

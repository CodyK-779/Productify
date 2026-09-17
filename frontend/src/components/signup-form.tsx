import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import OauthBtns from "./OauthBtns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type UserFormSchema } from "@/lib/schema";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "./ui/toast";

const SignUpForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormSchema>({ resolver: zodResolver(formSchema) });
  const navigate = useNavigate();

  const onSubmit = async (data: UserFormSchema) => {
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/login",
      });

      if (error) {
        return toast.add({ type: "error", description: error.message });
      } else {
        reset();
        navigate("/login");
      }
    } catch (error) {
      console.error("Sign up error", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Productify</CardTitle>
          <CardDescription>
            Login with your Github or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <OauthBtns provider="github" method="signup" />
                <OauthBtns provider="google" method="signup" />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="Jane Doe"
                  required
                  className={`${errors.name ? "border-red-500" : "border-white"} placeholder:text-neutral-400  @xs:text-sm text-xs`}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="m@example.com"
                  required
                  className={`${errors.email ? "border-red-500" : "border-white"} placeholder:text-neutral-400  @xs:text-sm text-xs`}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="123456Aa"
                  required
                  className={`${errors.password ? "border-red-500" : "border-white"} placeholder:text-neutral-400  @xs:text-sm text-xs`}
                />
                {errors.password && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>Register</>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
};

export default SignUpForm;

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

/**
 * SignupForm is a component that renders a sign up form.
 *
 * The form takes in the user's name, username, email, and password.
 * When the form is submitted, it calls the `createUserAccount` mutation
 * from the `useCreateUserAccount` hook. If the mutation is successful,
 * it displays a toast message with the message "Sign up successful".
 *
 * The form also renders a link to the sign in page.
 *
 * @returns A JSX element representing the sign up form.
 */
const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      const newUser = await createUserAccount(values);

      if (!newUser) {
        return toast({
          title: "Sign up failed. Please try again later",
        });
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        toast({
          title: "Sign in failed. Please try again later",
        });

        navigate("/sign-in");

        return;
      }

      console.log(newUser);

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });

        return;
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occurred. Please try again later",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isCreatingUser || isUserLoading || isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </div>
      <p className="text-small-regular text-light-2 text-center mt-2">
        Already have an account?
        <Link
          to="/sign-in"
          className="text-primary-500 text-small-semibold ml-1"
        >
          Log in
        </Link>
      </p>
    </Form>
  );
};

export default SignupForm;

import {
  Box,
  Card,
  Button,
  VStack,
  Field,
  Input,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/use-user";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().max(128, "Password is too long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  user: { name: string; email: string };
  token: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    axios
      .post<LoginResponse>(
        `${import.meta.env.VITE_API_BASEURL}/admin/auth/login`,
        values
      )
      .then(({ data }) => {
        setToken(data.token);
        setUser(data.user);
        toaster.create({
          title: "Logged in",
          description: `Welcome back, ${data.user.name}`,
          type: "info",
        });
      })
      .then(() => {
        navigate("/console");
      })
      .catch((error: unknown) => {
        reset();
        if (isAxiosError(error)) {
          toaster.create({
            title: "Login failed",
            description: error.response?.data.message,
            type: "error",
          });
        }
      });
  };

  return (
    <Box display={"grid"} placeItems={"center"} height={"100vh"}>
      <Card.Root minW={300}>
        <Card.Header>
          <Heading size="md" textAlign="center">
            Login your account
          </Heading>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <VStack gap={4} align="stretch">
              <Field.Root invalid={!!errors.email}>
                <Field.Label htmlFor="email">Email address</Field.Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  autoComplete="off"
                />
                {errors.email && (
                  <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                )}
              </Field.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label htmlFor="password">Password</Field.Label>
                <PasswordInput id="password" {...register("password")} />
                {errors.password && (
                  <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                )}
              </Field.Root>

              <Button
                type="submit"
                loading={isSubmitting}
                loadingText="Signing in"
              >
                Sign in
              </Button>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default Login;

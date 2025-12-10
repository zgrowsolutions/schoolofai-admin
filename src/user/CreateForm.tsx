import { Button, VStack, Field, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";
import { isAxiosError } from "axios";

import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Minimum 2 characters long")
    .max(150, "Maximum 150 characters"),
  email: z.email("Invalid email address").trim().toLowerCase(),
  mobile: z.string().length(10, "10 digits required"),
  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .max(128, "Password is too long"),
});

type LoginFormValues = z.infer<typeof formSchema>;

const CreateForm = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await apiClient
        .post("/admin/users", values)
        .then(({ data }) => data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.success({
        title: "Success",
        description: data.message,
      });
      reset();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toaster.error({
          title: "Error",
          description: error.response?.data.message,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <VStack gap={4} align="stretch">
        <Field.Root invalid={!!errors.name}>
          <Field.Label htmlFor="name">Name</Field.Label>
          <Input
            type="text"
            id="name"
            {...register("name")}
            autoComplete="off"
          />
          {errors.name && (
            <Field.ErrorText>{errors.name.message}</Field.ErrorText>
          )}
        </Field.Root>
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
        <Field.Root invalid={!!errors.mobile}>
          <Field.Label htmlFor="mobile">Mobile</Field.Label>
          <Input
            type="text"
            id="mobile"
            {...register("mobile")}
            autoComplete="off"
          />
          {errors.mobile && (
            <Field.ErrorText>{errors.mobile.message}</Field.ErrorText>
          )}
        </Field.Root>
        <Field.Root invalid={!!errors.password}>
          <Field.Label htmlFor="password">Password</Field.Label>
          <PasswordInput id="password" {...register("password")} />
          {errors.password && (
            <Field.ErrorText>{errors.password.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Button type="submit" loading={isSubmitting} loadingText="Creating ...">
          Create
        </Button>
      </VStack>
    </form>
  );
};

export default CreateForm;

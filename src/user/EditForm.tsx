import { Button, VStack, Field, Input, Tabs } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";
import { isAxiosError } from "axios";
import { FiUser, FiKey } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { type User } from "./List";

const editInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Minimum 2 characters long")
    .max(150, "Maximum 150 characters"),
  email: z.email("Invalid email address").trim().toLowerCase(),
  mobile: z.string().length(10, "10 digits required"),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .max(128, "Password is too long"),
});

type EditInfoFormValues = z.infer<typeof editInfoSchema>;
type EditPasswordFormValues = z.infer<typeof passwordSchema>;

const EditInfoForm = ({ data: user }: { data: User }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditInfoFormValues>({
    resolver: zodResolver(editInfoSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
  });

  const onSubmit = async (values: EditInfoFormValues) => {
    try {
      const data = await apiClient
        .put(`/admin/users/${user.id}`, values)
        .then(({ data }) => data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.success({
        title: "Success",
        description: data.message,
      });
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

        <Button type="submit" loading={isSubmitting} loadingText="Updating ...">
          Update
        </Button>
      </VStack>
    </form>
  );
};

const EditPasswordForm = ({ id }: { id: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditPasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: EditPasswordFormValues) => {
    try {
      const data = await apiClient
        .put(`/admin/users/${id}`, values)
        .then(({ data }) => data);
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
        <Field.Root invalid={!!errors.password}>
          <Field.Label htmlFor="password">Password</Field.Label>
          <PasswordInput id="password" {...register("password")} />
          {errors.password && (
            <Field.ErrorText>{errors.password.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Button type="submit" loading={isSubmitting} loadingText="Changing ...">
          Change
        </Button>
      </VStack>
    </form>
  );
};

const EditForm = ({ data }: { data: User }) => {
  return (
    <Tabs.Root defaultValue="editInfo">
      <Tabs.List>
        <Tabs.Trigger value="editInfo">
          <FiUser />
          Edit user
        </Tabs.Trigger>
        <Tabs.Trigger value="editPassword">
          <FiKey />
          Password change
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="editInfo">
        <EditInfoForm data={data} />
      </Tabs.Content>
      <Tabs.Content value="editPassword">
        <EditPasswordForm id={data.id} />
      </Tabs.Content>
    </Tabs.Root>
  );
};
export default EditForm;

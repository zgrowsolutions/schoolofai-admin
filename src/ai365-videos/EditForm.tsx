import {
  Button,
  VStack,
  Field,
  Input,
  Textarea,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toaster } from "@/components/ui/toaster";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { type Video } from "./List";

const statusCollection = createListCollection({
  items: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ],
});

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  video: z.string().min(1, "Video is required"),
  status: z.enum(["draft", "published", "archived"]),
  publish_at: z.string().min(10, "Please select date time"),
});

type EditInfoFormValues = z.infer<typeof editSchema>;

const EditForm = ({ data: video }: { data: Video }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditInfoFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: video.title,
      description: video.description,
      video: video.video,
      status: video.status,
      publish_at: "",
    },
  });

  const onSubmit = async (values: EditInfoFormValues) => {
    try {
      const data = await apiClient

        .put(`/admin/ai365/videos/${video.id}`, values)
        .then(({ data }) => data);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
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
        <Field.Root invalid={!!errors.title}>
          <Field.Label htmlFor="title">Title</Field.Label>
          <Input
            type="text"
            id="title"
            {...register("title")}
            autoComplete="off"
          />
          {errors.title && (
            <Field.ErrorText>{errors.title.message}</Field.ErrorText>
          )}
        </Field.Root>
        <Field.Root invalid={!!errors.description}>
          <Field.Label htmlFor="email">Description</Field.Label>
          <Textarea
            id="description"
            {...register("description")}
            autoComplete="off"
          />
          {errors.description && (
            <Field.ErrorText>{errors.description.message}</Field.ErrorText>
          )}
        </Field.Root>
        <Field.Root invalid={!!errors.video}>
          <Field.Label htmlFor="video">Video</Field.Label>
          <Input
            type="text"
            id="video"
            {...register("video")}
            autoComplete="off"
          />
          {errors.video && (
            <Field.ErrorText>{errors.video.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.status}>
          <Field.Label htmlFor="status">Status</Field.Label>
          <Select.Root
            collection={statusCollection}
            {...register("status")}
            id="status"
            defaultValue={["draft"]}
          >
            <Select.HiddenSelect />
            <Select.Label />

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Status" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
                <Select.ClearTrigger />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {statusCollection.items.map((status) => (
                  <Select.Item item={status.value} key={status.value}>
                    {status.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
          {errors.status && (
            <Field.ErrorText>{errors.status.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Field.Root invalid={!!errors.publish_at}>
          <Field.Label htmlFor="publish">Publish at</Field.Label>
          <Input
            type="datetime-local"
            id="publish"
            {...register("publish_at")}
            autoComplete="off"
          />
          {errors.publish_at && (
            <Field.ErrorText>{errors.publish_at.message}</Field.ErrorText>
          )}
        </Field.Root>

        <Button type="submit" loading={isSubmitting} loadingText="Creating ...">
          Create
        </Button>
      </VStack>
    </form>
  );
};

export default EditForm;

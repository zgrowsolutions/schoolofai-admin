import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { IconButton, Table, Dialog, CloseButton } from "@chakra-ui/react";
import { DateFormat } from "@/components/shared/DateFormat";
import { FiEdit2, FiYoutube } from "react-icons/fi";
import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import Delete from "./Delete";
import EditForm from "./EditForm";
import VideoPlayer from "./VideoPlayer";

export interface Video {
  id: string;
  title: string;
  description: string;
  video: string;
  status: "draft" | "published" | "archived";
  publish_at: Date;
  created_at: Date;
}

const fetcher = () => {
  return apiClient.get<Video[]>("/admin/ai365/videos").then(({ data }) => data);
};

const List = () => {
  const [open, setOpen] = useState<Video | boolean>(false);
  const [openVideo, setOpenVideo] = useState<Video | boolean>(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos"],
    queryFn: fetcher,
  });

  if (isLoading) return <p>Loading ...</p>;
  if (isError) return <p>Something went wrong.</p>;
  return (
    <>
      <Table.ScrollArea>
        <Table.Root size={"lg"} stickyHeader>
          <Table.Header>
            <Table.Row bg={"bg.subtle"}>
              <Table.ColumnHeader w={4} />
              <Table.ColumnHeader>Title</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Publish at</Table.ColumnHeader>
              <Table.ColumnHeader>Created at</Table.ColumnHeader>
              <Table.ColumnHeader width={"50px"} />
              <Table.ColumnHeader width={"50px"} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(data || []).map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <IconButton
                    size={"xl"}
                    variant={"plain"}
                    onClick={() => setOpenVideo(item)}
                  >
                    <FiYoutube />
                  </IconButton>
                </Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>
                  <DateFormat date={item.publish_at} />
                </Table.Cell>
                <Table.Cell>
                  <DateFormat date={item.created_at} />
                </Table.Cell>
                <Table.Cell onClick={(e) => e.stopPropagation()}>
                  <Tooltip content="Edit">
                    <IconButton
                      size={"sm"}
                      variant={"plain"}
                      onClick={() => setOpen(item)}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </Tooltip>
                </Table.Cell>
                <Table.Cell onClick={(e) => e.stopPropagation()}>
                  <Delete id={item.id} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Dialog.Root
        size={"sm"}
        open={Boolean(open)}
        onOpenChange={(e) => setOpen(Boolean(e.open))}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {typeof open !== "boolean" && <EditForm data={open} />}
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <Dialog.Root
        size={"sm"}
        open={Boolean(openVideo)}
        onOpenChange={(e) => setOpenVideo(Boolean(e.open))}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width={400}>
            <Dialog.Header p={3}>
              <Dialog.Title>
                {typeof openVideo === "boolean" ? "Video" : openVideo.title}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body padding={0} overflow={"hidden"}>
              {typeof openVideo !== "boolean" && (
                <VideoPlayer id={openVideo.video} />
              )}
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default List;

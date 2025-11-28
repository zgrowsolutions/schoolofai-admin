import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  IconButton,
  Table,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { DateFormat } from "@/components/shared/DateFormat";
import Delete from "./Delete";
import { FiEdit2 } from "react-icons/fi";
import { useState } from "react";
import EditForm from "./EditForm";
import { Tooltip } from "@/components/ui/tooltip";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  created_at: Date;
}

const fetcher = () => {
  return apiClient.get<User[]>("/admin/users").then(({ data }) => data);
};

const List = () => {
  const [open, setOpen] = useState<User | boolean>(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
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
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Mobile</Table.ColumnHeader>
              <Table.ColumnHeader>Created At</Table.ColumnHeader>
              <Table.ColumnHeader width={"50px"} />
              <Table.ColumnHeader width={"50px"} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(data || []).map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.mobile}</Table.Cell>
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
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit user</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {typeof open !== "boolean" && <EditForm data={open} />}
              </Dialog.Body>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default List;

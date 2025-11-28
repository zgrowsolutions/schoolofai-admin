import {
  Heading,
  HStack,
  Button,
  Spacer,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import List from "./List";
import { useState } from "react";
import CreateForm from "./CreateForm";

const Users = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HStack p={4}>
        <Heading>Users</Heading>
        <Spacer />
        <Button size={"sm"} onClick={() => setOpen(true)}>
          <FiPlus />
          User
        </Button>
      </HStack>
      <List />

      <Dialog.Root
        size={"sm"}
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>New user</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <CreateForm />
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

export default Users;

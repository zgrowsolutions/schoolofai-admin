import {
  Heading,
  HStack,
  Button,
  Spacer,
  Dialog,
  CloseButton,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import List from "./List";
import { useState } from "react";
import CreateForm from "./CreateForm";

const Videos = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HStack p={4}>
        <Heading>Videos</Heading>
        <Spacer />
        <Button size={"sm"} onClick={() => setOpen(true)}>
          <FiPlus />
          Video
        </Button>
      </HStack>
      <List />

      <Dialog.Root
        size={"sm"}
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>New Video</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <CreateForm />
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

export default Videos;

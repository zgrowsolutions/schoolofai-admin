import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import ConsoleRouter from "./ConsoleRouter";
// Fixed sizes
const HEADER_HEIGHT = "72px";
const SIDEBAR_WIDTH = "220px";

export default function AppLayout() {
  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      {/* Header */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        h={HEADER_HEIGHT}
        px={6}
        display="flex"
        alignItems="center"
        zIndex={10}
        // borderBottom={"1px solid"}
        // borderColor={"gray.200"}
        shadow={"xs"}
      >
        <Header />
      </Box>

      {/* Body wrapper */}
      <Flex flex={1} pt={HEADER_HEIGHT}>
        {/* Sidebar */}
        <Box
          position="fixed"
          top={HEADER_HEIGHT}
          left={0}
          w={SIDEBAR_WIDTH}
          h={`calc(100vh - ${HEADER_HEIGHT})`}
          p={0}
          overflow={"auto"}
          borderRight={"1px solid"}
          borderColor={"gray.200"}
        >
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box
          ml={SIDEBAR_WIDTH}
          flex={1}
          overflowY="auto"
          h={`calc(100vh - ${HEADER_HEIGHT})`}
        >
          <ConsoleRouter />
        </Box>
      </Flex>
    </Flex>
  );
}

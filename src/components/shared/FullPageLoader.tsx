import { Box, Center, Spinner, Text } from "@chakra-ui/react";

export const FullPageLoader = ({ height = "100vh" }: { height?: string }) => {
  return (
    <Box display="grid" placeItems="center" height={height}>
      <Center flexDirection="column">
        <Spinner />
        <Text mt={4}>Loading...</Text>
      </Center>
    </Box>
  );
};

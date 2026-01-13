import { useUser } from "@/store/use-user";
import {
  Heading,
  Text,
  Spacer,
  HStack,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useUser();
  return (
    <HStack w={"full"}>
      <HStack>
        <LuBrainCircuit size={36} strokeWidth={1.2} />
        <Heading size={"xl"} fontWeight={"semibold"}>
          School of AI
        </Heading>
      </HStack>
      <Spacer />
      <HStack gap={4}>
        <Link to="/console/users">Users</Link>
        <VStack alignItems={"start"} gap={0}>
          <Tooltip content={user?.email}>
            <Text fontWeight={"semibold"} fontSize={"sm"}>
              {user?.name}
            </Text>
          </Tooltip>
        </VStack>

        <Tooltip content="Logout">
          <IconButton onClick={logout} size={"sm"} variant={"ghost"}>
            <FiLogOut />
          </IconButton>
        </Tooltip>
      </HStack>
    </HStack>
  );
};

export default Header;

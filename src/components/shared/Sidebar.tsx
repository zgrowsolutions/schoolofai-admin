import { FiUsers, FiFolder, FiPieChart } from "react-icons/fi";
import { VStack, HStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const menu = [
  { label: "Dashboard", path: "/console/dashboard", icon: FiPieChart },
  { label: "Registration", path: "/console/registration", icon: FiFolder },
  { label: "Users", path: "/console/users", icon: FiUsers },
];
const Sidebar = () => {
  return (
    <VStack alignItems={"start"} gap={1} py={4} px={2}>
      {menu.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          style={{
            display: "block",
            width: "100%",
          }}
        >
          {({ isActive }) => (
            <HStack
              borderRadius={8}
              gap={3}
              _hover={{ bg: "gray.50" }}
              px={4}
              py={2}
              bg={isActive ? "gray.100" : "transparent"}
              fontWeight={isActive ? "medium" : "normal"}
            >
              <item.icon />
              {item.label}
            </HStack>
          )}
        </NavLink>
      ))}
    </VStack>
  );
};

export default Sidebar;

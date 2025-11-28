import { Group, Input, IconButton } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useRef } from "react";

interface Props {
  search: string;
  onSearch: (search: string) => void;
}

export const SearchBar = ({ onSearch, search }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const searchTxt = inputRef.current?.value.trim();
    onSearch(searchTxt || "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group attached w="full" maxW="sm">
        <Input
          defaultValue={search}
          flex="1"
          placeholder="Enter your email"
          type="search"
          ref={inputRef}
        />
        <IconButton variant={"outline"} bg="bg.subtle" type="submit">
          <FiSearch />
        </IconButton>
      </Group>
    </form>
  );
};

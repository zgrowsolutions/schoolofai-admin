import {
  ButtonGroup,
  IconButton,
  Pagination,
  type PaginationPageChangeDetails,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface Props {
  count: number;
  pageSize: number;
  page: number;
  onPageChange: (details: PaginationPageChangeDetails) => void;
}

export const CompactPagination = ({
  count,
  pageSize,
  page,
  onPageChange,
}: Props) => {
  return (
    <Pagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      defaultPage={1}
      maxW="240px"
      onPageChange={onPageChange}
    >
      <ButtonGroup variant="ghost" size="sm" w="full">
        <Pagination.PageText format="long" flex="1" />
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>
        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
};

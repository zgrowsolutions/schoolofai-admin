import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Table, HStack, Heading, Spacer } from "@chakra-ui/react";
import { DateFormat } from "@/components/shared/DateFormat";
import { CompactPagination } from "@/components/shared/Pagination";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { SearchBar } from "@/components/shared/SearchBar";
// import { DownloadExcelButton } from "@/components/shared/DownloadButton";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  allow_login: boolean;
  active: boolean;
  created_at: Date;
}
interface ResponsePayload {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const fetcher = ({
  queryKey,
}: {
  queryKey: [
    string,
    {
      page: number;
      limit: number;
      search: string;
    }
  ];
}) => {
  const { page, limit, search } = queryKey[1];
  return apiClient
    .get<ResponsePayload>("/admin/ai365/users", {
      params: {
        page,
        limit,
        search,
      },
    })
    .then(({ data }) => data);
};

const List = () => {
  const PAGE_SIZE = 50;
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );

  const {
    data: registrations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ai365.users", { page, limit: PAGE_SIZE, search }],
    queryFn: fetcher,
  });

  if (isError) return <p>Something went wrong.</p>;

  return (
    <Table.ScrollArea height={"calc(100vh - 72px)"}>
      <HStack px={4} py={2}>
        <Heading>AI365 Users</Heading>
        <Spacer />
        <CompactPagination
          pageSize={PAGE_SIZE}
          count={registrations?.pagination.total || 0}
          page={page}
          onPageChange={(p) => {
            setPage(p.page);
          }}
        />
      </HStack>
      <HStack px={4} py={2}>
        <SearchBar
          search={search}
          onSearch={(txt) => {
            setPage(1);
            setSearch(txt);
          }}
        />
        <Spacer />

        {/* <DownloadExcelButton downloadUrl={`/admin/registration/download`} /> */}
      </HStack>

      {isLoading ? (
        <FullPageLoader height="70vh" />
      ) : (
        <Table.Root size={"lg"} stickyHeader>
          <Table.Header>
            <Table.Row bg={"bg.subtle"}>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Mobile</Table.ColumnHeader>
              <Table.ColumnHeader>Active</Table.ColumnHeader>
              <Table.ColumnHeader>Can login</Table.ColumnHeader>
              <Table.ColumnHeader>Registered at</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(registrations?.data || []).map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.mobile}</Table.Cell>
                <Table.Cell>{item.active ? "Yes" : "No"}</Table.Cell>
                <Table.Cell>{item.allow_login ? "Yes" : "No"}</Table.Cell>
                <Table.Cell>
                  <DateFormat date={item.created_at} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Table.ScrollArea>
  );
};

export default List;

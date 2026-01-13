import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Table,
  HStack,
  Heading,
  Spacer,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { DateFormat } from "@/components/shared/DateFormat";
import { CompactPagination } from "@/components/shared/Pagination";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { SearchBar } from "@/components/shared/SearchBar";
import { DownloadExcelButton } from "@/components/shared/DownloadButton";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

interface Registration {
  id: number;
  name: string;
  email: string;
  mobile: string;
  course: string;
  campaign: string;
  created_at: Date;
}
interface ResponsePayload {
  data: Registration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const EpmptyList = createListCollection({
  items: [{ label: "", value: "" }],
});

const fetcher = ({
  queryKey,
}: {
  queryKey: [
    string,
    {
      page: number;
      limit: number;
      course: string;
      campaign: string;
      search: string;
    }
  ];
}) => {
  const { page, limit, course, campaign, search } = queryKey[1];
  return apiClient
    .get<ResponsePayload>("/admin/registration", {
      params: {
        page,
        limit,
        course,
        campaign,
        search,
      },
    })
    .then(({ data }) => data);
};

const List = () => {
  const PAGE_SIZE = 50;
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [course, setCourse] = useQueryState(
    "course",
    parseAsString.withDefault("")
  );
  const [campaign, setCampaign] = useQueryState(
    "campaign",
    parseAsString.withDefault("")
  );
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );

  const {
    data: registrations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "registration",
      { page, limit: PAGE_SIZE, course, campaign, search },
    ],
    queryFn: fetcher,
  });

  const { data: courses, isLoading: isCourseLoading } = useQuery({
    queryKey: ["coursesFilter"],
    queryFn: () =>
      apiClient
        .get<string[]>("/admin/registration/course?filter=course")
        .then(({ data }) => data),
    select: (data) => {
      const transformed_data = data.map((item) => ({
        label: item,
        value: item,
      }));
      return createListCollection({ items: transformed_data });
    },
  });
  const { data: campaigns, isLoading: isCampaignLoading } = useQuery({
    queryKey: ["campaignFilter"],
    queryFn: () =>
      apiClient
        .get<string[]>("/admin/registration/course?filter=campaign")
        .then(({ data }) => data),
    select: (data) => {
      const transformed_data = data.map((item) => ({
        label: item,
        value: item,
      }));
      return createListCollection({ items: transformed_data });
    },
  });

  if (isError) return <p>Something went wrong.</p>;

  return (
    <>
      <Table.ScrollArea height={"calc(100vh - 72px)"}>
        <HStack px={4} py={2}>
          <Heading>Registrations</Heading>
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
          <Select.Root
            collection={courses || EpmptyList}
            w={200}
            onValueChange={(e) => {
              setCourse(e.value[0] ?? "");
              setPage(1);
            }}
            defaultValue={[course]}
            disabled={isCourseLoading}
          >
            <Select.HiddenSelect />

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText
                  placeholder={
                    isCourseLoading ? "Loading ..." : "Filter by course"
                  }
                />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
                <Select.ClearTrigger />
              </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
              <Select.Content>
                {courses?.items.map((course) => (
                  <Select.Item item={course} key={course.value}>
                    {course.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          <Select.Root
            collection={campaigns || EpmptyList}
            w={200}
            onValueChange={(e) => {
              setCampaign(e.value[0] ?? "");
              setPage(1);
            }}
            defaultValue={[campaign]}
            disabled={isCampaignLoading}
          >
            <Select.HiddenSelect />

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText
                  placeholder={
                    isCampaignLoading ? "Loading ..." : "Filter by campaign"
                  }
                />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
                <Select.ClearTrigger />
              </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
              <Select.Content>
                {campaigns?.items.map((campaign) => (
                  <Select.Item item={campaign} key={campaign.value}>
                    {campaign.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          <DownloadExcelButton
            downloadUrl={`/admin/registration/download?course=${course}&campaign=${campaign}`}
          />
        </HStack>

        {isLoading ? (
          <FullPageLoader height="70vh" />
        ) : (
          <Table.Root size={"lg"} stickyHeader>
            <Table.Header>
              <Table.Row bg={"bg.subtle"}>
                <Table.ColumnHeader textAlign={"right"}>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Mobile</Table.ColumnHeader>
                <Table.ColumnHeader>Course</Table.ColumnHeader>
                <Table.ColumnHeader>Campaign</Table.ColumnHeader>
                <Table.ColumnHeader>Registered at</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(registrations?.data || []).map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell textAlign={"right"}>{item.id}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.mobile}</Table.Cell>
                  <Table.Cell>{item.course}</Table.Cell>
                  <Table.Cell>{item.campaign}</Table.Cell>
                  <Table.Cell>
                    <DateFormat date={item.created_at} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Table.ScrollArea>
    </>
  );
};

export default List;

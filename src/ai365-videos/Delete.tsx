import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IconButton } from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { isAxiosError } from "axios";
import { Tooltip } from "@/components/ui/tooltip";

interface Props {
  id: string;
}

const Delete = ({ id }: Props) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleDelete = () => {
    setLoading(true);
    apiClient
      .delete(`/admin/ai365/videos/${id}`)
      .then(() => {
        toaster.success({
          title: "Success",
          description: "Deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          toaster.error({
            title: "Delete failed",
            description: error.response?.data.message,
          });
        }
      });
  };
  return (
    <Tooltip content="Delete">
      <IconButton
        aria-label="Delete video"
        onClick={handleDelete}
        loading={loading}
        variant={"plain"}
        size={"sm"}
      >
        <FiTrash2 />
      </IconButton>
    </Tooltip>
  );
};

export default Delete;

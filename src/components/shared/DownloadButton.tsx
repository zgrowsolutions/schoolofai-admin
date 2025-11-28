import { Button } from "@chakra-ui/react";
import { apiClient } from "@/lib/api-client";
import { FiDownload } from "react-icons/fi";
import { useState } from "react";

interface Props {
  downloadUrl: string;
  label?: string;
}

export function DownloadExcelButton({
  downloadUrl,
  label = "Download",
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(downloadUrl, {
        responseType: "blob", // important!
      });

      // Create blob download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "registrations.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      console.error("Download error:", error);
      setLoading(false);
    }
  };

  return (
    <Button
      colorScheme="blue"
      onClick={handleDownload}
      size={"sm"}
      loading={loading}
      disabled={loading}
    >
      <FiDownload />
      {label}
    </Button>
  );
}

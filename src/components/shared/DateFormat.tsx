import { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  date: Date | string;
  tz?: string;
  format?: string;
}

// export const DateFormat = ({
//   date,
//   tz = "Asia/Kolkata",
//   format = "DD-MMM-YYYY hh:mm A",
// }: Props) => {
//   return dayjs(date).tz(tz).format(format);
// };

export const DateFormat = ({
  date,
  tz = "Asia/Kolkata",
  format = "DD-MMM-YYYY hh:mm A",
}: Props) => {
  const formatted = useMemo(() => {
    const d = dayjs(date);
    return d.isValid() ? d.tz(tz).format(format) : "";
  }, [date, tz, format]);

  return formatted;
};

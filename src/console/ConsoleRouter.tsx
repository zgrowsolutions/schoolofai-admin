import { Routes, Route, Navigate } from "react-router-dom";
import Users from "@/user";
import Dashboard from "@/dash1";
import Registration from "@/reg1";

const ConsoleRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="registration" element={<Registration />} />
      <Route path="users" element={<Users />} />
      <Route path="*" element={<Navigate to={"/console/dashboard"} />} />
    </Routes>
  );
};

export default ConsoleRouter;

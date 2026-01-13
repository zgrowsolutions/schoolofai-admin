import { Routes, Route, Navigate } from "react-router-dom";
import Users from "@/user";
import Dashboard from "@/dashboard";
import Registration from "@/registration";
import AI365Users from "@/ai365-users";
import AI365Payments from "@/ai365-payments";
import AI365Subsctiption from "@/ai365-suscriptions";
import AI365Videos from "@/ai365-videos";

const ConsoleRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="registration" element={<Registration />} />
      <Route path="ai365-users" element={<AI365Users />} />
      <Route path="ai365-subscription" element={<AI365Subsctiption />} />
      <Route path="ai365-payments" element={<AI365Payments />} />
      <Route path="ai365-videos" element={<AI365Videos />} />

      <Route path="users" element={<Users />} />
      <Route path="*" element={<Navigate to={"/console/dashboard"} />} />
    </Routes>
  );
};

export default ConsoleRouter;

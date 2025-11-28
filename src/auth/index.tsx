import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/auth/Login";

const AuthIndex = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default AuthIndex;

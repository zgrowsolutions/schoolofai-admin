import React, {
  useState,
  useEffect,
  useEffectEvent,
  lazy,
  Suspense,
} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "@/auth";
import { useUser } from "@/store/use-user";
import { apiClient } from "@/lib/api-client";
import { FullPageLoader } from "@/components/shared/FullPageLoader";

const Console = lazy(() => import("@/console"));

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { user, setToken, setUser, token } = useUser();
  const [loading, setLoading] = useState(true);

  const onLoad = useEffectEvent(() => {
    apiClient
      .get(`/admin/auth/me`)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        setLoading(false);
      });
  });

  useEffect(() => {
    onLoad();
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

  if ((!token || !user) && !loading) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route
          path="/console/*"
          element={
            <Protected>
              <Suspense fallback={<FullPageLoader />}>
                <Console />
              </Suspense>
            </Protected>
          }
        />
        <Route path="/*" element={<Navigate to="/console" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

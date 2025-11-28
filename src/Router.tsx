import React, { useState, useEffect, useEffectEvent } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "@/auth";
import Console from "@/console";
import { useUser } from "@/store/use-user";
import { apiClient } from "@/lib/api-client";

import { Spinner, Box, Text, Center } from "@chakra-ui/react";

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
    return (
      <Box display="grid" placeItems="center" height="100vh">
        <Center flexDirection="column">
          <Spinner />
          <Text mt={4}>Loading...</Text>
        </Center>
      </Box>
    );
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
              <Console />
            </Protected>
          }
        />
        <Route path="/*" element={<Navigate to="/console" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

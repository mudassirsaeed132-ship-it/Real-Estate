import { Suspense, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { routes, prefetchCommonRoutes } from "./routes";
import RouteFallback from "./RouteFallback";

export default function AppRouter() {
  const element = useRoutes(routes);

  useEffect(() => {
    prefetchCommonRoutes();
  }, []);

  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}
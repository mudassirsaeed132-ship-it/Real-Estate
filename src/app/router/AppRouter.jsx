import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import RouteFallback from "./RouteFallback";

export default function AppRouter() {
  const element = useRoutes(routes);
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

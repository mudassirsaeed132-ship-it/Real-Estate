import { BrowserRouter } from "react-router-dom";
import AppProviders from "./app/providers/AppProviders";
import RootLayout from "./app/layout/RootLayout";
import AppRouter from "./app/router/AppRouter";
import ScrollManager from "./app/router/ScrollManager";

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        {/* must be inside Router */}
        <ScrollManager />
        <RootLayout>
          <AppRouter />
        </RootLayout>
      </AppProviders>
    </BrowserRouter>
  );
}
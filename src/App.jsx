import { BrowserRouter } from "react-router-dom";
import AppProviders from "./app/providers/AppProviders";
import RootLayout from "./app/layout/RootLayout";
import AppRouter from "./app/router/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <RootLayout>
          <AppRouter />
        </RootLayout>
      </AppProviders>
    </BrowserRouter>
  );
}
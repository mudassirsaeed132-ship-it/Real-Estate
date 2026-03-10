import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-245">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
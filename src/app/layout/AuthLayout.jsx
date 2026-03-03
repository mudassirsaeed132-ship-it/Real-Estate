import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-[980px]">
            <Outlet />
          </div>
        </main>

        <footer className="pb-8 text-center text-[14px] text-[#6B7280]">
          Powered by Zync AI Solutions
        </footer>
      </div>
    </div>
  );
}
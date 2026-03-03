import PageShell from "../../app/layout/PageShell";

export default function NotFoundPage() {
  return (
    <PageShell className="py-20">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-sm text-[#6B7280]">Page not found.</p>
    </PageShell>
  );
}

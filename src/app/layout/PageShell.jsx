export default function PageShell({ children, className = "" }) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-7xl px-4 md:px-6 xl:max-w-330 2xl:max-w-350 2xl:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
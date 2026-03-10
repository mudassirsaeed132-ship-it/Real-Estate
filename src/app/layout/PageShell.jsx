import { cn } from "../../shared/lib/cn";

export default function PageShell({ children, className = "" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0",
        // padding scales on bigger screens
        "px-4 md:px-6 xl:px-8 2xl:px-10",
        //  better big-desktop widths (no custom tailwind keys needed)
        "max-w-7xl xl:max-w-330 2xl:max-w-360 min-[1800px]:max-w-400",
        className
      )}
    >
      {children}
    </div>
  );
}
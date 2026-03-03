import { cn } from "../lib/cn";

export default function IconButton({ className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#EDEDED] bg-white transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D66355] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

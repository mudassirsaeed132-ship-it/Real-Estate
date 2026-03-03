import { cn } from "../lib/cn";

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-[#EDEDED] bg-white px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#D66355]/40",
        className
      )}
      {...props}
    />
  );
}

import { IMG } from "../../../app/config/images";

export default function AuthCard({
  title,
  subtitle,
  children,
  top,
  align = "center",
  titleClassName = "",
  contentClassName = "",
  showLogo = true,
}) {
  const isLeft = align === "left";

  return (
    <section className="w-full">
      {showLogo ? (
        <div className="flex justify-center">
          <img
            src={IMG.authLogo.full}
            alt="Real Estate"
            className="h-16 sm:h-19.5 w-auto"
            draggable={false}
          />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-140">
        {top ? (
          <div className={["mt-10", isLeft ? "text-left" : "text-center"].join(" ")}>
            {top}
          </div>
        ) : null}

        <h1
          className={[
            showLogo ? "mt-4" : "mt-16",
            "text-[40px] sm:text-[44px] font-semibold leading-tight text-[#111827]",
            isLeft ? "text-left" : "text-center",
            titleClassName,
          ].join(" ")}
        >
          {title}
        </h1>

        {subtitle ? (
          <p
            className={[
              "mt-2 text-[14px] sm:text-[15px] text-[#6B7280]",
              isLeft ? "text-left" : "text-center",
            ].join(" ")}
          >
            {subtitle}
          </p>
        ) : null}

        <div className={["mt-10", contentClassName].join(" ")}>{children}</div>
      </div>
    </section>
  );
}
// src/pages/property-detail/PropertyDetailPage.jsx
import { useEffect, useId, useMemo, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../app/layout/PageShell";
import Skeleton from "../../shared/ui/Skeleton";
import Button from "../../shared/ui/Button";
import IconButton from "../../shared/ui/IconButton";
import { cn } from "../../shared/lib/cn";
import {
  Share2,
  Heart,
  ChevronDown,
  Home,
  Bath,
  BedDouble,
  Calendar,
  MapPin,
  Scan,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

//  LAZY: heavy widgets split
const PropertyGalleryHero = lazy(() => import("../../widgets/property/PropertyGalleryHero"));
const PropertyMiniMap = lazy(() => import("../../widgets/map/PropertyMiniMap"));

import AgentSidebar from "../../widgets/property/AgentSidebar";

import avatarSarah from "../../assets/images/avatars/agent-sarah.jpg";
import avatarLeslie from "../../assets/images/avatars/user-leslie.jpg";

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const rid = useId();
  const contentId = `sec-${rid}`;

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-4 sm:px-5"
      >
        <div className="min-w-0 text-sm font-semibold text-[#111827] truncate">
          {title}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[#6B7280] transition",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <div className="h-px bg-[#EDEDED]" />

      {open ? (
        <div id={contentId} className="px-4 py-5 sm:px-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function FactsItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#F3F4F6] bg-white px-4 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F8FAFC]">
        <Icon className="h-5 w-5 text-[#D66355]" />
      </div>

      <div className="min-w-0">
        <div className="text-xs text-[#6B7280]">{label}</div>
        <div className="text-sm font-semibold text-[#111827] break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

function ResultsNavBtn({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-full border border-[#EDEDED] bg-white",
        "text-[#6B7280] hover:bg-black/5"
      )}
    >
      {children}
    </button>
  );
}

function inferBookingPurpose(item) {
  const raw =
    item?.purpose ||
    item?.listingPurpose ||
    item?.statusLabel ||
    item?.status ||
    "";
  const s = String(raw).toLowerCase();

  if (s.includes("rent")) return "rent";
  if (s.includes("sale") || s.includes("buy")) return "sale";
  return "sale";
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiGet(`${ENDPOINTS.properties}/${id}`)
      .then((d) => setItem(d?.item || null))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  const agent = useMemo(
    () => ({
      name: "Sarah Johnson",
      role: "Property Manager",
      rating: 4.9,
      reviewsCount: 127,
      managing: 24,
      avatar: avatarSarah,
    }),
    []
  );

  const reviews = useMemo(
    () => [
      {
        id: "r1",
        name: "Leslie Alexander",
        avatar: avatarLeslie,
        stars: 5,
        time: "1 week ago",
        title: "A Beautiful, Welcoming Home",
        text:
          "This house is beautiful and welcoming. The wraparound porch is a standout feature, perfect for relaxing outdoors. Inside, the large windows make the rooms bright and airy.",
      },
      {
        id: "r2",
        name: "Leslie Alexander",
        avatar: avatarLeslie,
        stars: 5,
        time: "1 week ago",
        title: "A Beautiful, Welcoming Home",
        text: "Well-kept, with plenty of greenery. Great location and very comfortable.",
      },
    ],
    []
  );

  const imgs = item?.images?.filter(Boolean) || [];
  const score = 78;

  const statusLabel = item?.statusLabel || "For Sale";
  const bookingPurpose = inferBookingPurpose(item);

   return (
    <div className="bg-[#FAFAFA] overflow-x-hidden">
      <PageShell className="py-4 sm:py-6">
        {loading ? (
          <div className="space-y-6">
            {/* ✅ full-bleed skeleton, no border/rounded */}
            <div className="full-bleed">
              <Skeleton className="h-[220px] sm:h-[340px] lg:h-[520px] w-full" />
            </div>
          </div>
        ) : (
          <>
            {/* ✅ Gallery full-bleed (NO border, NO rounded) */}
            <div className="full-bleed">
              <Suspense
                fallback={<Skeleton className="h-[220px] sm:h-[340px] lg:h-[520px] w-full" />}
              >
                <PropertyGalleryHero images={imgs} />
              </Suspense>
            </div>

            {/* Results bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EDEDED] bg-white px-4 py-3 sm:px-5">
              <div className="inline-flex min-w-0 items-center gap-3">
                <ResultsNavBtn
                  label="Previous result"
                  onClick={() => alert("Prev result (dummy)")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </ResultsNavBtn>

                <div className="min-w-0 text-sm font-medium text-[#111827] truncate">
                  {item?.resultsLabel || "1/100 Results"}
                </div>

                <ResultsNavBtn
                  label="Next result"
                  onClick={() => alert("Next result (dummy)")}
                >
                  <ArrowRight className="h-4 w-4" />
                </ResultsNavBtn>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <IconButton aria-label="Share" onClick={() => alert("Share (dummy)")}>
                  <Share2 className="h-5 w-5 text-[#6B7280]" />
                </IconButton>

                <IconButton aria-label="Favorite" onClick={() => alert("Favorite (dummy)")}>
                  <Heart className="h-5 w-5 text-[#6B7280]" />
                </IconButton>
              </div>
            </div>

            {/* Main layout */}
            <div className="mt-5 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* Left */}
              <div className="min-w-0 space-y-4">
                {/* Summary */}
                <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-[#111827] break-words">
                        {item?.title || "Modern Luxury Apartment"}
                      </div>

                      <div className="mt-1 text-sm text-[#6B7280] break-words">
                        {item?.address || "123 Main Street, San Francisco, CA 94102"}
                      </div>

                      <div className="mt-2 text-sm font-semibold text-[#111827]">
                        $4,500/month
                      </div>
                    </div>

                    <div className="inline-flex shrink-0 items-center gap-2 text-sm text-[#6B7280]">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#D66355]" />
                      {statusLabel}
                    </div>
                  </div>

                  <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <FactsItem icon={Home} label="Property Type" value="Apartment" />
                    <FactsItem icon={Bath} label="Bathrooms" value="2" />
                    <FactsItem icon={Scan} label="Size" value="1,250 sq ft" />
                    <FactsItem icon={BedDouble} label="Bedrooms" value="3" />
                    <FactsItem icon={Calendar} label="Available" value="Jan 15, 2026" />
                    <FactsItem icon={MapPin} label="Location" value="Downtown" />
                  </div>
                </div>

                <Section title="Description" defaultOpen>
                  <div className="space-y-3 text-sm leading-6 text-[#6B7280] break-words">
                    <p>Welcome to this stunning modern apartment in the heart of downtown...</p>
                    <p>The open-concept layout features a gourmet kitchen with high-end stainless steel...</p>
                    <p>The primary suite includes a walk-in closet and spa-like ensuite...</p>
                  </div>
                </Section>

                <Section title="Location Address" defaultOpen>
                  <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#EDEDED]">
                    <div className="h-[210px] sm:h-[260px] lg:h-[280px] w-full">
                      <Suspense fallback={<Skeleton className="h-full w-full" />}>
                        <PropertyMiniMap lat={item?.lat} lng={item?.lng} />
                      </Suspense>
                    </div>
                  </div>
                </Section>

                <Section title="Photos" defaultOpen>
                  <div className="max-w-full overflow-x-auto overscroll-x-contain">
                    <div className="flex w-max gap-3 pb-2 pr-1">
                      {(imgs || []).slice(0, 7).map((src, i) => {
                        const isLast = i === 6;
                        return (
                          <button
                            key={`${src}-${i}`}
                            type="button"
                            className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-[#EDEDED] bg-white"
                            onClick={() => alert("Open gallery (dummy)")}
                          >
                            <img
                              src={src}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                            {isLast ? (
                              <div className="absolute inset-0 grid place-items-center bg-black/45 text-xs font-semibold text-white">
                                +25
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Section>

                <Section title="AI Value Insights" defaultOpen>
                  <div className="w-full min-w-0 space-y-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 text-[#6B7280] truncate">Fair Value Score</span>
                      <span className="shrink-0 text-[#6B7280]">{score}/100</span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-2 rounded-full bg-[#D66355]"
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 text-[#6B7280] truncate">Market Comparison</span>
                      <span className="shrink-0 font-semibold text-[#D66355]">+5%</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 text-[#6B7280] truncate">Value Badge</span>
                      <span className="shrink-0 rounded-full bg-[#D66355] px-3 py-1 text-xs font-semibold text-white">
                        Fair Price
                      </span>
                    </div>
                  </div>
                </Section>

                <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#EDEDED] bg-white p-4 sm:p-5">
                  <div className="text-sm font-semibold text-[#111827]">Property Factsheet</div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button className="h-12 w-full bg-[#D66355] text-white hover:bg-[#C85A4E]">
                      Start Financial Precheck
                    </Button>

                    <Button
                      variant="outline"
                      className="h-12 w-full border-[#D66355] text-[#D66355] hover:bg-[#D66355]/10"
                    >
                      Compare Property
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="min-w-0 h-fit lg:sticky lg:top-24">
                <div className="min-w-0 w-full">
                  <AgentSidebar
                    agent={agent}
                    reviews={reviews}
                    propertyId={id}
                    bookingPurpose={bookingPurpose}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </PageShell>
    </div>
  );
}
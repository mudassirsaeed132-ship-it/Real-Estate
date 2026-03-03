import PageShell from "../../app/layout/PageShell";
import { FOOTER_LINKS } from "../../app/config/navigation";

import googlePlay from "../../assets/images/stores/google-play.png";
import appGallery from "../../assets/images/stores/app-gallery.png";
import appMock from "../../assets/images/stores/app-mock.png";

import xIcon from "../../assets/icons/social/x.svg";
import fbIcon from "../../assets/icons/social/facebook.svg";
import ytIcon from "../../assets/icons/social/youtube.svg";
import igIcon from "../../assets/icons/social/instagram.svg";

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[#D66355]">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-[#D66355]">
        {items.map((t) => (
          <li key={t}>
            <a href="#" className="hover:underline">
              {t}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ src, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#000000]/40 bg-transparent transition hover:bg-black/5"
    >
      <img src={src} alt={label} className="h-5 w-5" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 w-full">
      <div className="bg-[#F7E5E2]">
        <PageShell className="py-10">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
            <div>
              <p className="text-[#D66355]">Find amazing deals on the go.</p>
              <h3 className="mt-2 text-xl font-semibold text-[#111827]">
                Download Real estate app now!
              </h3>
            </div>

            <div className="flex justify-center">
              <img
                src={appMock}
                alt="App preview"
                className="h-28 w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-center gap-3 lg:justify-end">
              <img src={googlePlay} alt="Google Play" className="h-10 w-auto" />
              <img src={appGallery} alt="AppGallery" className="h-10 w-auto" />
            </div>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <FooterCol
              title="Popular Categories"
              items={FOOTER_LINKS.popularCategories}
            />
            <FooterCol
              title="Trending Searches"
              items={FOOTER_LINKS.trendingSearches}
            />
            <FooterCol title="About Us" items={FOOTER_LINKS.aboutUs} />
            <FooterCol title="OLX" items={FOOTER_LINKS.olx} />

            <div>
              <h4 className="text-sm font-semibold text-[#D66355]">Follow Us</h4>
              <div className="mt-4 flex gap-3">
                <SocialIcon src={xIcon} label="X" />
                <SocialIcon src={fbIcon} label="Facebook" />
                <SocialIcon src={ytIcon} label="YouTube" />
                <SocialIcon src={igIcon} label="Instagram" />
              </div>
            </div>
          </div>
        </PageShell>
      </div>

      <div className="bg-[#D66355]">
        <PageShell className="py-4">
          <p className="text-right text-sm text-white/90">
            © Real state Copyrights
          </p>
        </PageShell>
      </div>
    </footer>
  );
}

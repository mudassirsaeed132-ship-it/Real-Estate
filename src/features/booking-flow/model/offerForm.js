// src/features/booking-flow/model/offerForm.js
import { useCallback, useMemo, useState } from "react";

function parseMoneyInput(v) {
  const raw = String(v || "")
    .replace(/[, ]+/g, "")
    .replace(/[^0-9.]/g, "")
    .trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function useOfferForm({
  initialOffer = "300,000",
  initialIntro = "",
  initialDocs = ["ID.docx", "Income proof.pdf"],
  minIntroChars = 50,
} = {}) {
  const [offer, setOffer] = useState(initialOffer);
  const [intro, setIntro] = useState(initialIntro);
  const [docs, setDocs] = useState(initialDocs);

  const offerValue = useMemo(() => parseMoneyInput(offer), [offer]);
  const introCount = intro.length;

  const introOk = introCount >= minIntroChars;
  const offerOk = offerValue !== null && offerValue > 0;

  const canSubmit = offerOk && introOk;

  const removeDoc = useCallback((name) => {
    setDocs((x) => x.filter((d) => d !== name));
  }, []);

  const addDoc = useCallback((name) => {
    if (!name) return;
    setDocs((x) => (x.includes(name) ? x : [...x, name]));
  }, []);

  /**
   * API-ready payload mapper for backend
   */
  const toOfferPayload = useCallback(
    ({ propertyId } = {}) => {
      return {
        propertyId: propertyId || null,
        offerAmount: offerValue,
        currency: "USD",
        introText: intro,
        documents: docs.map((d) => ({ name: d })),
      };
    },
    [offerValue, intro, docs]
  );

  return {
    // state
    offer,
    intro,
    docs,

    // actions
    setOffer,
    setIntro,
    addDoc,
    removeDoc,

    // derived
    offerValue,
    introCount,
    minIntroChars,
    canSubmit,
    toOfferPayload,
  };
}

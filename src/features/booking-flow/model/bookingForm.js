// src/features/booking-flow/model/bookingForm.js
import { useCallback, useMemo, useState } from "react";
import { buildBillingOverview } from "./billingCalc";

function addMonth({ y, m }, delta) {
  const d = new Date(y, m + delta, 1);
  return { y: d.getFullYear(), m: d.getMonth() };
}

export function useBookingForm({
  initialMonth = { y: 2021, m: 8 }, // September 2021 like your UI
  initialCheckIn = new Date(2021, 8, 2),
  initialCheckOut = new Date(2021, 8, 2),
  initialIdProofName = "Doc 123.pdf",
  initialPaymentMethod = "gpay",
  initialPaymentOpen = true,
} = {}) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  const [month1, setMonth1] = useState(initialMonth);
  const [month2, setMonth2] = useState(initialMonth);

  const [idProofName, setIdProofName] = useState(initialIdProofName);

  const [paymentOpen, setPaymentOpen] = useState(initialPaymentOpen);
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);

  const onMonth1Prev = useCallback(() => setMonth1((s) => addMonth(s, -1)), []);
  const onMonth1Next = useCallback(() => setMonth1((s) => addMonth(s, +1)), []);
  const onMonth2Prev = useCallback(() => setMonth2((s) => addMonth(s, -1)), []);
  const onMonth2Next = useCallback(() => setMonth2((s) => addMonth(s, +1)), []);

  const clearDates = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
  }, []);

  const togglePaymentOpen = useCallback(() => {
    setPaymentOpen((v) => !v);
  }, []);

  const billingOverview = useMemo(() => {
    return buildBillingOverview({
      checkIn,
      checkOut,
      nightlyRate: 150,
      cleaningFee: 50,
      serviceFee: 22.5,
      currency: "USD",
    });
  }, [checkIn, checkOut]);

  // Minimal "ready" condition for dummy flow
  const canProceedToPay = useMemo(() => {
    return Boolean(checkIn) && Boolean(checkOut) && Boolean(idProofName);
  }, [checkIn, checkOut, idProofName]);

  /**
   * API-ready payload mapper (backend dev can map easily)
   */
  const toBookingPayload = useCallback(
    ({ propertyId, purpose = "rent" } = {}) => {
      return {
        propertyId: propertyId || null,
        purpose,
        checkIn: checkIn ? new Date(checkIn).toISOString() : null,
        checkOut: checkOut ? new Date(checkOut).toISOString() : null,
        idProofName: idProofName || null,
        paymentMethod,
      };
    },
    [checkIn, checkOut, idProofName, paymentMethod]
  );

  return {
    // state
    checkIn,
    checkOut,
    month1,
    month2,
    idProofName,
    paymentOpen,
    paymentMethod,

    // actions
    setCheckIn,
    setCheckOut,
    onMonth1Prev,
    onMonth1Next,
    onMonth2Prev,
    onMonth2Next,
    clearDates,
    setIdProofName,
    togglePaymentOpen,
    setPaymentMethod,

    // derived
    billingOverview,
    canProceedToPay,
    toBookingPayload,
  };
}

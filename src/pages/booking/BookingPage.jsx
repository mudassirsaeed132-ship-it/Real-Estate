import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../../app/layout/PageShell";

import { apiGet } from "../../services/api/client";
import { ENDPOINTS } from "../../services/api/endpoints";

import BookingLayout from "../../features/booking-flow/ui/BookingLayout";
import BillingOverviewModal from "../../features/booking-flow/ui/BillingOverviewModal";

import { useBookingForm } from "../../features/booking-flow/model/bookingForm";
import { useOfferForm } from "../../features/booking-flow/model/offerForm";

export default function BookingPage() {
  const [sp] = useSearchParams();
  const propertyId = sp.get("propertyId") || "";
  const purpose = (sp.get("purpose") || "rent").toLowerCase(); // rent | sale

  const [property, setProperty] = useState(null);

  //  model-driven state
  const booking = useBookingForm();
  const offer = useOfferForm();

  const [billingOpen, setBillingOpen] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    apiGet(`${ENDPOINTS.properties}/${propertyId}`)
      .then((d) => setProperty(d?.item || null))
      .catch(() => setProperty(null));
  }, [propertyId]);

  return (
    <div className="bg-[#FAFAFA] overflow-x-hidden">
      <PageShell className="py-6 min-w-0">
        <BookingLayout
          purpose={purpose}
          property={property}
          /* ---- rent ---- */
          checkIn={booking.checkIn}
          checkOut={booking.checkOut}
          month1={booking.month1}
          month2={booking.month2}
          onMonth1Prev={booking.onMonth1Prev}
          onMonth1Next={booking.onMonth1Next}
          onMonth2Prev={booking.onMonth2Prev}
          onMonth2Next={booking.onMonth2Next}
          onSelectCheckIn={booking.setCheckIn}
          onSelectCheckOut={booking.setCheckOut}
          onClearDates={booking.clearDates}
          idProofName={booking.idProofName}
          onPickIdProof={booking.setIdProofName}
          paymentOpen={booking.paymentOpen}
          onTogglePaymentOpen={booking.togglePaymentOpen}
          paymentMethod={booking.paymentMethod}
          onPaymentMethodChange={booking.setPaymentMethod}
          onProceedToPay={() => setBillingOpen(true)}
          /* ---- sale ---- */
          offer={offer.offer}
          onOfferChange={offer.setOffer}
          intro={offer.intro}
          onIntroChange={offer.setIntro}
          docs={offer.docs}
          onRemoveDoc={offer.removeDoc}
          onSubmitApplication={() => {
            if (!offer.canSubmit) {
              alert("Please enter valid offer + at least 50 characters intro (dummy)");
              return;
            }
            console.log("Offer payload (dummy):", offer.toOfferPayload({ propertyId }));
            alert("Submit Application (dummy)");
          }}
        />

        {/* Billing modal (rent) */}
        <BillingOverviewModal
          open={billingOpen}
          onClose={() => setBillingOpen(false)}
          overview={booking.billingOverview}
        />
      </PageShell>
    </div>
  );
}
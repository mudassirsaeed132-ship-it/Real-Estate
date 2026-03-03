import RoleCard from "./RoleCard";
import { ROLES } from "../../../entities/session/model/shapes";

import buyerImg from "../../../assets/images/auth/role-buyer.png";
import sellerImg from "../../../assets/images/auth/role-seller.png";

export default function RolePicker({ value, onChange }) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8">
      <RoleCard
        selected={value === ROLES.BUYER}
        title="I am a Buyer/ Renter"
        imageSrc={buyerImg}
        onClick={() => onChange(ROLES.BUYER)}
      />
      <RoleCard
        selected={value === ROLES.SELLER}
        title="I am a Seller/ Owner"
        imageSrc={sellerImg}
        onClick={() => onChange(ROLES.SELLER)}
      />
    </div>
  );
}
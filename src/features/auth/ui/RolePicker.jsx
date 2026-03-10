import { LazyMotion, domAnimation, LayoutGroup, m, useReducedMotion } from "framer-motion";

import RoleCard from "./RoleCard";
import { ROLES } from "../../../entities/session/model/shapes";

import buyerImg from "../../../assets/images/auth/role-buyer.png";
import sellerImg from "../../../assets/images/auth/role-seller.png";

export default function RolePicker({ value, onChange }) {
  const shouldReduceMotion = useReducedMotion();

  const items = [
    {
      key: ROLES.BUYER,
      title: "I am a Buyer/ Renter",
      imageSrc: buyerImg,
    },
    {
      key: ROLES.SELLER,
      title: "I am a Seller/ Owner",
      imageSrc: sellerImg,
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <LayoutGroup>
        <m.div
          className="w-full flex flex-col sm:flex-row items-center justify-center gap-8"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? false : "visible"}
          variants={
            shouldReduceMotion
              ? {}
              : {
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }
          }
        >
          {items.map((item) => {
            const isSelected = value === item.key;

            return (
              <m.div
                key={item.key}
                className="relative w-full flex justify-center"
                variants={
                  shouldReduceMotion
                    ? {}
                    : {
                        hidden: { opacity: 0, y: 18 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }
                }
              >
                {isSelected && !shouldReduceMotion ? (
                  <m.div
                    layoutId="role-selection-ring"
                    className="pointer-events-none absolute left-1/2 top-0 h-[220px] w-full max-w-[280px] -translate-x-1/2 rounded-[18px] border-2 border-[#D66355] shadow-[0_10px_30px_rgba(214,99,85,0.12)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                ) : null}

                <div className="relative z-[1] w-full">
                  <RoleCard
                    selected={shouldReduceMotion ? isSelected : false}
                    title={item.title}
                    imageSrc={item.imageSrc}
                    onClick={() => onChange(item.key)}
                  />
                </div>
              </m.div>
            );
          })}
        </m.div>
      </LayoutGroup>
    </LazyMotion>
  );
}
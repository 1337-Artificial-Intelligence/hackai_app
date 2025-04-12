"use client";

import type * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface Brand {
  name: string;
  logo: string;
}

// Sample brand data - replace with your actual brands
const BRANDS: Brand[] = [
  {
    name: "Brand 1",
    logo: "/assets/brands/1337.png",
  },
  {
    name: "Brand 2",
    logo: "/assets/brands/adria.png",
  },
  {
    name: "Brand 3",
    logo: "/assets/brands/FACE.png",
  },
  {
    name: "Brand 4",
    logo: "/assets/brands/SOLE_logo_gray.png",
  },
  {
    name: "Brand 5",
    logo: "/assets/brands/um6pcc.png",
  },
];

interface BrandsCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  brands?: Brand[];
  speed?: number;
}

export default function BrandsCarousel({
  brands = BRANDS,
  speed = 20,
  className,
  ...props
}: BrandsCarouselProps) {
  // Double the items to create the infinite effect
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div
      className={cn("relative mt-10 max-w-7xl mx-auto flex overflow-hidden py-4", className)}
      {...props}
    >
      {/* Gradient masks for smooth fade effect */}
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

      {/* First set of brands */}
      <motion.div
        className="flex gap-8 pr-8"
        animate={{
          x: ["0%", "-100%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {duplicatedBrands.map((brand, idx) => (
          <div
            key={`${brand.name}-${idx}`}
            className="flex md:w-[150px] w-[120px] items-center justify-center"
          >
            <img
              src={brand.logo || "/placeholder.svg"}
              alt={brand.name}
              className="md:h-16 h-14 w-auto object-contain brightness-200"
            />
          </div>
        ))}
      </motion.div>

      {/* Second set of brands for seamless loop */}
      <motion.div
        className="flex gap-8 pr-8"
        animate={{
          x: ["0%", "-100%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {duplicatedBrands.map((brand, idx) => (
          <div
            key={`${brand.name}-duplicate-${idx}`}
            className="flex md:w-[150px] w-[120px] items-center justify-center"
          >
            <img
              src={brand.logo || "/placeholder.svg"}
              alt={brand.name}
              className="md:h-16 h-14 w-auto object-contain brightness-200"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

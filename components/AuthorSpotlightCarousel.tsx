"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import Image from "next/image";
import { CircleChevronRight } from "lucide-react";

interface Author {
  id: number;
  name: string;
  slug: string;
  avatar_urls?: { [key: string]: string };
  expertise?: string;
  bio?: string;
}

interface AuthorSpotlightCarouselProps {
  authors: Author[];
}

export default function AuthorSpotlightCarousel({
  authors,
}: AuthorSpotlightCarouselProps) {
  return (
    <Swiper
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        480: { slidesPerView: 2, spaceBetween: 16 },
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      }}
      className="px-4 sm:px-0"
    >
      {authors.map((author) => {
        // Truncate bio to 80 characters
        const maxBioLength = 75;
        const bio = author.bio || "";
        const isLongBio = bio.length > maxBioLength;
        const truncatedBio = isLongBio
          ? bio.slice(0, maxBioLength) + "..."
          : bio;
        return (
          <SwiperSlide key={author.id}>
            <Link
              href={`/${author.slug}`}
              className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border dark:border-zinc-800 bg-gradient-to-br from-teal-50 to-white dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center p-4 sm:p-6"
            >
              {author.avatar_urls?.[96] && (
                <Image
                  src={author.avatar_urls[96]}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="rounded-full mb-2 mx-auto w-12 h-12 sm:w-16 sm:h-16"
                />
              )}
              <span className="font-semibold text-base sm:text-lg mb-1 text-center w-full block">
                {author.name}
              </span>
              {author.expertise && (
                <span className="text-xs text-muted-foreground text-center w-full block mb-2 sm:mb-3">
                  {author.expertise}
                </span>
              )}
              {bio && (
                <span className="text-xs sm:text-sm text-muted-foreground text-center w-full block">
                  {truncatedBio}
                  {isLongBio && (
                    <span className="flex justify-center items-center mt-3 sm:mt-5">
                      <span className="text-white h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-teal-600 flex justify-center items-center">
                        <CircleChevronRight className="size-5 sm:size-6" />
                      </span>
                    </span>
                  )}
                </span>
              )}
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

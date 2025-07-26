"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import PillarPostCard from "@/components/posts/pillar-post-card";
import { Post } from "@/lib/wordpress.d";

interface PillarPostsCarouselProps {
  posts: Post[];
}

export default function PillarPostsCarousel({
  posts,
}: PillarPostsCarouselProps) {
  return (
    <Swiper
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      modules={[Autoplay]}
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id}>
          <PillarPostCard post={post} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

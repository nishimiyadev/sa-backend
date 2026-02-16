// src/components/Carousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";
import "./Carousel.css";

export default function Carousel({ products, addToCart }) {
  return (
    <div className="carousel-wrapper">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} addToCart={addToCart} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

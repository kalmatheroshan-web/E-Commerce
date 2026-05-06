import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  { id: 1, image: "https://rukminim2.flixcart.com/fk-p-flap/1600/780/image/22793132f4f08be0.png?q=80" },
  { id: 2, image: "https://rukminim2.flixcart.com/fk-p-flap/1600/780/image/4f85bad5c0e414dd.png?q=80" },
  { id: 3, image: "https://rukminim2.flixcart.com/fk-p-flap/1600/780/image/68d90d48c3c17995.png?q=80" },
  { id: 4, image: "https://rukminim2.flixcart.com/fk-p-flap/1600/780/image/35abbb9b568149d3.png?q=80" },
];



export default function Slider() {

  return (
    <div className="w-full max-w-[1600px] mx-auto pt-16 px-6">

      <div className="overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          initialSlide={1}
          slidesPerView={2.2}
          spaceBetween={3}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          speed={800}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 1.3,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 1.6,
              spaceBetween: 14,
            },
            760: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 2.5,
              spaceBetween: 24,
            },

          }}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="overflow-hidden shadow-sm p-2">
                <img
                  src={banner.image}
                  alt="banner"
                  className="md:w-[550px] rounded-2xl h-[180px] sm:h-[250px] md:h-[220px]  lg:h-[320px] object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
}
import { BadgeCheck, Star, StarHalf, ChevronRight } from "lucide-react";
import React from "react";

const Reviews = React.memo(({ review = [] }) => {
  const totalReviews = review.length;

  const avgRate =
    (review.reduce((prev, cur) => prev + cur.rating, 0) / totalReviews || 0).toFixed(1);

  const starCounts = [5, 4, 3, 2, 1].map((num) => ({
    stars: num,
    count: review.filter((r) => Math.floor(r.rating) === num).length,
  }));

  const allImages = review.flatMap((r) => r.images || []).filter(Boolean);

  const RenderStars = ({ rating, size = 16 }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        if (index <= Math.floor(rating))
          return <Star key={i} size={size} className="fill-amber-400 text-amber-400" />;
        if (index - 0.5 <= rating)
          return <StarHalf key={i} size={size} className="fill-amber-400 text-amber-400" />;
        return <Star key={i} size={size} className="text-slate-200" />;
      })}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 text-slate-900">

      {/* ===== TOP SECTION ===== */}
      <div className="grid lg:grid-cols-12 gap-10">

        {/* LEFT CARD */}
        <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl px-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Overall Rating
          </p>

          <div className="flex items-end gap-3">
            <h1 className="text-6xl font-extrabold tracking-tight">{avgRate}</h1>
            <span className="text-slate-400 mb-2">/ 5</span>
          </div>

          <div className="mt-3">
            <RenderStars rating={avgRate} size={20} />
          </div>

          <p className="text-sm text-slate-500 mt-3">
            Based on {totalReviews} reviews
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-semibold">
            <BadgeCheck size={16} />
            Verified Reviews
          </div>
        </div>

        {/* RIGHT DISTRIBUTION */}
        <div className="lg:col-span-8 flex flex-col justify-center gap-4">
          {starCounts.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="w-10 text-xs font-semibold text-slate-500">
                {item.stars}★
              </span>

              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                  style={{
                    width: `${(item.count / totalReviews) * 100 || 0}%`,
                  }}
                />
              </div>

              <span className="text-xs text-slate-500 w-10 text-right">
                {Math.round((item.count / totalReviews) * 100) || 0}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== IMAGE GALLERY ===== */}
      {allImages.length > 0 && (
        <div className="mt-14">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xl font-bold">Customer Gallery</h3>
              <p className="text-sm text-slate-500">Real product shots</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold hover:underline">
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="w-36 h-36 object-cover rounded-2xl border border-slate-200 shadow-md hover:scale-105 transition"
                alt="review"
              />
            ))}
          </div>
        </div>
      )}

      {/* ===== REVIEWS LIST ===== */}
      <div className="mt-14">
        <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>

        <div className="grid gap-5">
          {review.slice(0, 4).map((rev, i) => (
            <div
              key={i}
              className="bg-white"
            >
              <div className="flex justify-between items-start mb-3">

                {/* USER */}
                <div className="flex items-center gap-3">
                  <img
                    src={rev.user?.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {rev.user?.firstName} {rev.user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400">Verified Buyer</p>
                  </div>
                </div>

                <RenderStars rating={rev.rating} size={14} />
              </div>

              {/* TITLE */}
              {rev.title && (
                <p className="font-semibold text-sm mb-1">{rev.title}</p>
              )}

              {/* REVIEW TEXT */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {rev.review}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Reviews;
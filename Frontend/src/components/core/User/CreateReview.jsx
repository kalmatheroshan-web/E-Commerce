import { Star, X, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createReviews } from "../../../Services/Operation/productApi";

export default function CreateReview({ productImage, productId, setReview }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);

  const { register, handleSubmit, control, setValue, reset } = useForm({
    defaultValues: { title: "", review: "", images: [] }
  });

  const reviewText = useWatch({ control, name: "review" }) || "";
  const images = useWatch({ control, name: "images" }) || [];

  useEffect(() => {
    return () => previewImages.forEach(img => URL.revokeObjectURL(img.url));
  }, [previewImages]);

  const onSubmit = async (data) => {
    const formdata = new FormData();

    data.images.forEach((file) => formdata.append("images", file));

    formdata.append("review", data.review);
    formdata.append("rating", rating);
    formdata.append("productId", productId);

    // append title only if exists
    if (data.title) {
      formdata.append("title", data.title);
    }

    try {
      await createReviews(formdata);

      setReview(false);
      reset();
      setPreviewImages([]);
      setRating(0);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setValue("images", [...images, ...files]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewImages[index].url);

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setValue("images", images.filter((_, i) => i !== index));
  };

 

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg sm:text-xl">
            Share Your Thoughts
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Your feedback helps others make better choices.
          </p>
        </div>
        <button
          onClick={() => setReview(false)}
          className="p-2 bg-slate-50 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-500 transition"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">

        {/* Product Section */}
        <div className="w-full md:w-5/12 bg-slate-50 p-5 sm:p-6 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
          <div className="w-full max-w-[220px] sm:max-w-[260px]">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={productImage}
                className="w-full h-full object-cover"
                alt="Product"
              />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-7/12 p-4 sm:p-6 md:p-8 flex flex-col"
        >
          <div className="flex-1 space-y-5 sm:space-y-6">

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overall Rating
              </label>
              <div className="flex items-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="active:scale-90"
                  >
                    <Star
                      size={26}
                      className={`transition ${(hover || rating) >= star
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                        }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-xs sm:text-sm text-amber-600">
                    {["Poor", "Fair", "Good", "Great", "Excellent!"][rating - 1]}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Review Title
              </label>
              <input
                type="text"
                placeholder="Short headline for your review"
                className="w-full p-3 sm:p-4 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                {...register("title", { maxLength: 100 })}
              />
            </div>

            {/* Review */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Review Content
                </label>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded ${reviewText.length > 250
                    ? "bg-rose-100 text-rose-600"
                    : "bg-slate-100 text-slate-500"
                    }`}
                >
                  {reviewText.length} / 400
                </span>
              </div>
              <textarea
                className="w-full p-3 sm:p-4 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none min-h-[120px] sm:min-h-[140px] resize-none"
                placeholder="What did you love? How was the fit?"
                {...register("review", { required: true, maxLength: 400 })}
              />
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Add Visuals
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <label className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 text-slate-400 cursor-pointer">
                  <Camera size={18} />
                  <input
                    className="hidden"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                {previewImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200"
                  >
                    <img
                      src={img.url}
                      className="h-full w-full object-cover"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-5 sm:pt-6">
            <button
              type="submit"
              disabled={rating === 0 || reviewText.length < 5}
              className={`w-full py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wide transition ${rating === 0 || reviewText.length < 5
                ? "bg-slate-100 text-slate-300"
                : "bg-slate-900 text-white hover:bg-indigo-600 active:scale-95"
                }`}
            >
              Post My Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
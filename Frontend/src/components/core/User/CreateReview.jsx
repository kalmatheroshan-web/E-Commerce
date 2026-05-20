import { Star, X, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createReviews } from "../../../Services/Operation/productApi";

export default function CreateReview({ productImage, productId, setReview }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, setValue, reset } = useForm({
    defaultValues: { title: "", review: "", images: [] }
  });

  const reviewText = useWatch({ control, name: "review" }) || "";
  const images = useWatch({ control, name: "images" }) || [];

  useEffect(() => {
    return () => previewImages.forEach(img => URL.revokeObjectURL(img.url));
  }, [previewImages]);

  const onSubmit = async (data) => {
    if (rating === 0 || reviewText.length < 5) return;
    
    setIsSubmitting(true);
    const formdata = new FormData();

    data.images.forEach((file) => formdata.append("images", file));
    formdata.append("review", data.review);
    formdata.append("rating", rating);
    formdata.append("productId", productId);

    if (data.title?.trim()) {
      formdata.append("title", data.title.trim());
    }

    try {
      await createReviews(formdata);
      setReview(false);
      reset();
      setPreviewImages([]);
      setRating(0);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setValue("images", [...images, ...files]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (e, index) => {
    e.preventDefault();
    URL.revokeObjectURL(previewImages[index].url);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setValue("images", images.filter((_, i) => i !== index));
  };

  return (
    // Max width increased to 5xl for premium desktop presentation
    <div className="w-full max-w-4xl mx-auto bg-white text-slate-900 antialiased font-sans">
      
      {/* Header Row */}
      <div className="flex items-center justify-between px-5 py-5 sm:px-8 border-b border-slate-100 shrink-0">
        <div>
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
            Share Your Thoughts
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Your feedback helps others make better choices.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReview(false)}
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* 12-Column Layout Grid (Asymmetric Widescreen Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 items-stretch">
        
        {/* Left Side: Product Display Sideboard (Allocated 3 Columns) */}
        <div className="lg:col-span-3 bg-slate-50/60 p-6 sm:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="w-full max-w-[350px] sm:max-w-[180px] lg:max-w-full aspect-square flex items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200/40">
            <img
              src={productImage}
              className="w-full h-full rounded-xl"
              alt="Reviewed item canvas thumbnail"
            />
          </div>
        </div>

        {/* Right Side: High-Capacity Inputs Engine Form (Allocated 9 Columns) */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-9 p-5 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-5">
            
            {/* Input Row 1: Interactive Rating Stars */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Rating
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform active:scale-90 duration-150 cursor-pointer"
                    >
                      <Star
                        size={26}
                        className={`transition-all duration-150 ${
                          (hover || rating) >= star
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_1px_3px_rgba(251,191,36,0.15)]"
                            : "text-slate-200 hover:text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 animate-in fade-in zoom-in-95 duration-150">
                    {["Poor", "Fair", "Good", "Great", "Excellent!"][rating - 1]}
                  </span>
                )}
              </div>
            </div>

            {/* Input Row 2: Headline Form Input Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Review Title
              </label>
              <input
                type="text"
                placeholder="Example: Extremely comfortable / Premium quality"
                className="w-full p-3 text-slate-800 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                {...register("title", { maxLength: 100 })}
              />
            </div>

            {/* Input Row 3: Narrative Text Block Area */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Review Content
                </label>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                    reviewText.length > 380
                      ? "bg-rose-50 text-rose-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {reviewText.length}/400
                </span>
              </div>
              <textarea
                placeholder="What did you love? How was the fit? Share your detailed experience with the product..."
                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none min-h-[110px] sm:min-h-[130px] resize-none transition-all leading-relaxed"
                {...register("review", { required: true, maxLength: 400 })}
              />
            </div>

            {/* Input Row 4: Visual Attachments Upload Grid Module */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Add Visuals
              </label>
              <div className="flex flex-wrap gap-2.5">
                
                {/* Visual File Dialog Picker Label Interface Component */}
                <label className="w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-400 hover:text-indigo-500 transition-all cursor-pointer shrink-0">
                  <Camera size={18} />
                  <input
                    className="hidden"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Loops & Render Attached Media Objects Asset State Array */}
                {previewImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 shrink-0"
                  >
                    <img
                      src={img.url}
                      className="h-full w-full object-cover"
                      alt="Thumbnail attachment overview attachment item rendering"
                    />
                    <button
                      type="button"
                      onClick={(e) => removeImage(e, index)}
                      className="absolute inset-0 bg-slate-900/40 lg:opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150 cursor-pointer"
                    >
                      <X size={16} className="text-white shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Action Command Controls Row */}
          <div className="pt-2 shrink-0">
            <button
              type="submit"
              disabled={rating === 0 || reviewText.length < 5 || isSubmitting}
              className={`w-full py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                rating === 0 || reviewText.length < 5 || isSubmitting
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-indigo-600 shadow-sm hover:shadow-md hover:shadow-indigo-100 active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? "Posting review..." : "Post My Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
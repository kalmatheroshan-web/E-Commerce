import { useEffect, useState } from "react";
import { Package, Upload, Plus, Trash2, DollarSign, Tag } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { viewCategory } from "../../../Services/Operation/categoryApi";
import { createProduct } from "../../../Services/Operation/productApi";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function AddProduct() {
    const { loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            productName: "",
            description: "",
            price: "",
            discount: 0,
            category: "",
            sizes: [{ size: "", stock: "" }],
            images: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sizes",
    });
    const category = watch("category");

    let Checks = {
        '69c5136f561119d21c2c6220': 'Men',
        '69c513db9fe5ef31774ac905': 'Woman'
    }


    const images = watch("images");
    const [categories, setCategory] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        async function fetchCats() {
            const val = await viewCategory();
            if (val) setCategory(val);
        }
        fetchCats();
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setValue("images", [...images, ...files]);
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        const updatedFiles = images.filter((_, i) => i !== index);
        setValue("images", updatedFiles);

        const updatedPreviews = previewImages.filter((_, i) => i !== index);
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages(updatedPreviews);
    };

    const onSubmit = async (data) => {
        if (data.images.length < 4) {
            return toast.error("Minimum 4 images required");
        }

        try {
            const formData = new FormData();
            formData.append("productName", data.productName);
            formData.append("description", data.description);
            formData.append("price", Number(data.price));
            formData.append("discount", Number(data.discount));
            formData.append("category", data.category);

            if (data.category in Checks) {
                const formattedSizes = data.sizes.map((s) => ({
                    size: s.size,
                    stock: Number(s.stock),
                }));
                formData.append("sizes", JSON.stringify(formattedSizes));
            }
            else {
                formData.append("sizes", JSON.stringify([{ size: "oneSize", stock: Number(data.stock) }]));
            }

            data.images.forEach((file) => {
                formData.append("images", file);
            });

            await dispatch(createProduct(formData));
            toast.success("Product created successfully!");

            previewImages.forEach((url) => URL.revokeObjectURL(url));
            setPreviewImages([]);
            reset();
        } catch (error) {
            toast.error(error.message || "Server error.");
        }
    };

    const handleDiscard = () => {
        previewImages.forEach((url) => URL.revokeObjectURL(url));
        setPreviewImages([]);
        reset();
        toast.info("Form cleared");
    };

    return (
        <div className="relative min-h-screen bg-slate-50 p-6 flex justify-center items-start">

            {/* STYLISH GLASSY LOADER - Only shows when loading is true */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md">
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                            variant="determinate"
                            sx={{ color: 'indigo', opacity: 0.1 }}
                            size={70}
                            thickness={4}
                            value={100}
                        />
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            sx={{
                                color: '#4f46e5',
                                position: 'absolute',
                                left: 0,
                                animationDuration: '800ms',
                                [`& .MuiCircularProgress-circle`]: {
                                    strokeLinecap: 'round',
                                    filter: 'drop-shadow(0px 0px 8px rgba(79, 70, 229, 0.4))',
                                },
                            }}
                            size={70}
                            thickness={4}
                        />
                    </Box>
                </div>
            )}

            <div className={`w-full max-w-5xl bg-white shadow-sm border border-slate-200 overflow-hidden rounded-2xl transition-all ${loading ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="w-6 h-6 text-indigo-600" />
                        Add Product
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Create a new product listing for your storefront.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name*</label>
                            <input
                                type="text"
                                {...register("productName", { required: "Product name is required" })}
                                placeholder="e.g. Premium Indigo Hoodie"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                            {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea
                                rows="5"
                                {...register("description")}
                                placeholder="Tell your customers about this item..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" /> Price*
                                </label>
                                <input
                                    type="number"
                                    {...register("price", { required: "Price is required" })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                    <Tag className="w-4 h-4" /> Discount (%)
                                </label>
                                <input
                                    type="number"
                                    {...register("discount")}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                            <select
                                {...register("category", { required: "Category is required" })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="">Select category</option>
                                {categories?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Images (Min. 4)*</label>
                            <label className="border-2 border-dashed border-indigo-100 rounded-xl p-8 text-center bg-indigo-50/30 hover:bg-indigo-50 transition-colors cursor-pointer block group">
                                <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-sm text-indigo-600 font-semibold">Click to upload images</p>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>

                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 mt-4">
                                    {previewImages.map((img, index) => (
                                        <div key={index} className="relative group border border-slate-200 rounded-lg overflow-hidden h-20">
                                            <img src={img} alt="preview" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>



                        < div >
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-semibold text-slate-700">Sizes & Stock</label>
                                {(category in Checks) && <button type="button" onClick={() => append({ size: "", stock: "" })} className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Add Size
                                </button>}
                            </div>
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3 items-center">
                                        {(category in Checks) &&
                                            <input
                                                {...register(`sizes.${index}.size`, { required: true })}
                                                placeholder="Size"
                                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400"
                                            />}
                                        <input
                                            type="number"
                                            {...register(`sizes.${index}.stock`, { required: true })}
                                            placeholder="Qty"
                                            className="w-24 px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400"
                                        />
                                        <button type="button" onClick={() => remove(index)} disabled={fields.length === 1} className="text-red-400 hover:text-red-600">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="md:col-span-2 border-t border-slate-100 pt-6 flex justify-end gap-4">
                        <button type="button" onClick={handleDiscard} className="px-6 py-3 text-slate-500 font-semibold hover:text-slate-700 transition">
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            Publish Product
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}

export default AddProduct;
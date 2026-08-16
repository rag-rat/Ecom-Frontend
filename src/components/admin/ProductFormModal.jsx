import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import toast from "react-hot-toast";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Create/Edit product form — matches backend Part 9's
 * CreateProductRequest/UpdateProductRequest fields exactly.
 *
 * Image upload is a SEPARATE step from the main form submission — we
 * first create/update the product's TEXT data, THEN (if editing an
 * existing product) allow immediate image upload via
 * productApi.uploadProductImage() (backend Part 11's multipart
 * endpoint). For NEW products, we save first to get a productId, then
 * show the image uploader inline.
 */

export default function ProductFormModal({
  isOpen,
  onClose,
  existingProduct,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [savedProductId, setSavedProductId] = useState(
    existingProduct?.id || null,
  );
  const [uploading, setUploading] = useState(false);

  const isEditing = Boolean(existingProduct);

  useEffect(() => {
    categoryApi
      .getAllCategoriesAdmin()
      .then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSavedProductId(existingProduct?.id || null);
      reset(
        existingProduct
          ? {
              name: existingProduct.name,
              description: existingProduct.description,
              price: existingProduct.price,
              discountedPrice: existingProduct.discountedPrice,
              categoryId: existingProduct.categoryId,
              fabric: existingProduct.fabric,
              color: existingProduct.color,
              occasion: existingProduct.occasion,
              length: existingProduct.length,
              isFeatured: existingProduct.featured,
            }
          : {
              name: "",
              description: "",
              price: "",
              discountedPrice: "",
              categoryId: "",
              fabric: "",
              color: "",
              occasion: "",
              length: "",
              isFeatured: false,
              initialStock: 10,
            },
      );
    }
  }, [isOpen, existingProduct, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      discountedPrice: data.discountedPrice
        ? parseFloat(data.discountedPrice)
        : undefined,
      tags: [],
    };

    try {
      if (isEditing) {
        await productApi.updateProduct(existingProduct.id, payload);
        toast.success("Product updated");
        onSuccess();
        onClose();
      } else {
        payload.initialStock = parseInt(data.initialStock, 10) || 0;
        const response = await productApi.createProduct(payload);
        toast.success("Product created — now add images");
        setSavedProductId(response.data.id);
        onSuccess();
      }
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !savedProductId) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await productApi.uploadProductImage(savedProductId, formData, true);
      toast.success("Image uploaded");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      size="xl"
      theme="dark"
      scrollable
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Product Name"
          required
          error={errors.name?.message}
          {...register("name", {
            required: "Required",
            minLength: { value: 3, message: "Too short" },
          })}
          theme="dark"
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
            {...register("description", { required: "Required" })}
          />
          {errors.description && (
            <p className="text-xs text-red-400 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (₹)"
            type="number"
            step="0.01"
            min="0"
            required
            error={errors.price?.message}
            {...register("price", {
              required: "Required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            theme="dark"
          />
          <Input
            label="Discounted Price (₹)"
            type="number"
            step="0.01"
            min="0"
            {...register("discountedPrice", {
              min: { value: 0, message: "Price cannot be negative" },
            })}
            theme="dark"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Category
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
            {...register("categoryId", { required: "Required" })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-400 mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* <div className="grid grid-cols-2 gap-3">
          <Input label="Fabric" {...register('fabric')} />
          <Input label="Color" {...register('color')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Occasion" {...register('occasion')} />
          <Input label="Length" {...register('length')} />
        </div> */}

        <div className="grid grid-cols-2 gap-3">
          <Input label="Brand" theme="dark" {...register("fabric")} />
          <Input label="Color" theme="dark" {...register("color")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Product Type" theme="dark" {...register("occasion")} />
          <Input label="Condition" theme="dark" {...register("length")} />
        </div>

        {!isEditing && (
          <Input
            label="Initial Stock"
            type="number"
            min="0"
            required
            theme="dark"
            {...register("initialStock", { required: "Required" })}
          />
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="w-4 h-4 text-[#0078D4] bg-gray-800 border-gray-700 rounded focus:ring-[#0078D4]"
          />
          <span className="text-sm text-gray-300">Feature on homepage</span>
        </label>

        {/* Image upload — only available once product exists */}
        {savedProductId && (
          <div className="border-t border-gray-800 pt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Images
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-lg py-4 cursor-pointer hover:border-[#0078D4] transition-colors">
              <Upload size={16} className="text-gray-500" />
              <span className="text-sm text-gray-400">
                {uploading ? "Uploading..." : "Click to upload image"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-800">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="min-w-[140px] !bg-[#0078D4] hover:!bg-[#006CBD] !text-white hover:-translate-y-0.5"
          >
            {isEditing
              ? "Update Product"
              : savedProductId
                ? "Save Changes"
                : "Create Product"}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose} className="min-w-[100px] !text-gray-400 hover:!text-white hover:!bg-gray-800">
            {savedProductId && !isEditing ? "Done" : "Cancel"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

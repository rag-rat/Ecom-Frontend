import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { productApi } from "../../api/productApi";
import { formatCurrency } from "../../utils/formatCurrency";
import DataTable from "../../components/admin/DataTable";
import ProductFormModal from "../../components/admin/ProductFormModal";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    productApi
      .getProducts({ page, size: 15 })
      .then((res) => {
        setProducts(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, [page]);

  const handleEdit = async (row) => {
    // Fetch full detail (list gives summary shape only)
    const res = await productApi.getProductById(row.id);
    setEditingProduct(res.data);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await productApi.deleteProduct(deletingId);
      toast.success("Product deleted");
      setDeletingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const columns = [
    {
      key: "image",
      label: "",
      render: (row) => (
        <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-800">
          {row.primaryImageUrl ? (
            <img
              src={row.primaryImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <Package size={16} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <span className="font-medium text-white line-clamp-1 max-w-[200px] block">
          {row.name}
        </span>
      ),
    },
    { key: "categoryName", label: "Category" },
    {
      key: "price",
      label: "Price",
      render: (row) => formatCurrency(row.discountedPrice || row.price),
    },
    {
      key: "featured",
      label: "Featured",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          {row.featured ? <Badge variant="brand">Featured</Badge> : "—"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-gray-500 hover:text-[#4CC2FF]"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            className="p-1.5 text-gray-500 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Products</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="min-w-[140px] !bg-[#0078D4] hover:!bg-[#006CBD] !text-white"
        >
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg shadow-black/20">
        {loading ? (
          <div className="h-[500px] flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={products}
            emptyMessage="No products yet"
            onRowClick={(row) => navigate(`/products/${row.id}`)}
          />
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existingProduct={editingProduct}
        onSuccess={fetchProducts}
      />

      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Delete this product?"
        size="sm"
        theme="dark"
      >
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          This will soft-delete the product — it can be reactivated later if
          needed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setDeletingId(null)}
            className="flex-1 border border-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

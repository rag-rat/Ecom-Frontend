import { useState, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import { addressApi } from "../../../api/addressApi";
import AddressCard from "../../../components/address/AddressCard";
import AddressCardSkeleton from "../../../components/address/AddressCardSkeleton";
import AddressFormModal from "../../../components/address/AddressFormModal";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import toast from "react-hot-toast";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Full address CRUD — reuses AddressCard (Part 12) in its NON-selectable
 * "management" mode (onEdit/onDelete/onSetDefault provided instead of
 * onSelect), and reuses AddressFormModal (Part 12) unchanged.
 *
 * This is a good example of Part 12's components paying off — building
 * them generically there means zero new component code is needed here,
 * just different props.
 */

export default function MyAddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  const fetchAddresses = () => {
    setLoading(true);
    addressApi
      .getAddresses()
      .then((res) => setAddresses(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetDefault = async (addressId) => {
    try {
      await addressApi.setDefaultAddress(addressId);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await addressApi.deleteAddress(deletingAddressId);
      toast.success("Address deleted");
      setDeletingAddressId(null);
      fetchAddresses();
    } catch (err) {
      toast.error(err.message || "Failed to delete address");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-semibold text-lg text-gray-900">
          My Addresses
        </h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1 text-sm font-medium text-[#0078D4] hover:text-[#106EBE]"
        >
          <Plus size={14} /> Add New
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Manage your saved shipping addresses
      </p>

      {loading ? (
        <AddressCardSkeleton count={2} />
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin size={24} />}
          title="No saved addresses"
          description="Add an address for faster checkout"
          action={
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Add Address
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => {
                setEditingAddress(address);
                setModalOpen(true);
              }}
              onDelete={() => setDeletingAddressId(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        existingAddress={editingAddress}
        onSuccess={fetchAddresses}
      />

      <Modal
        isOpen={Boolean(deletingAddressId)}
        onClose={() => setDeletingAddressId(null)}
        title="Delete this address?"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setDeletingAddressId(null)}
            className="flex-1 border border-gray-300 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

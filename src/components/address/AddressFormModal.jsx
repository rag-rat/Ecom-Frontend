
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { addressApi } from '../../api/addressApi'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Add/Edit address form inside a Modal. Used by both Checkout (add
 * new address inline without leaving the flow) and Profile page's
 * address management (Part 15).
 *
 * useEffect + reset() repopulates the form when `existingAddress`
 * changes — needed because the SAME modal component instance is
 * reused for editing different addresses; without reset(), React
 * Hook Form would keep showing the FIRST address's data even after
 * the modal reopens for a different one.
 */

export default function AddressFormModal({ isOpen, onClose, existingAddress, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const isEditing = Boolean(existingAddress)

  useEffect(() => {
    if (isOpen) {
      reset(existingAddress || {
        fullName: '', phoneNumber: '', addressLine1: '', addressLine2: '',
        city: '', state: '', pincode: '', country: 'India', setAsDefault: false,
      })
    }
  }, [isOpen, existingAddress, reset])

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await addressApi.updateAddress(existingAddress.id, data)
        toast.success('Address updated')
      } else {
        await addressApi.createAddress(data)
        toast.success('Address added')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to save address')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Address' : 'Add New Address'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Full Name" required
            error={errors.fullName?.message}
            {...register('fullName', { required: 'Required' })}
          />
          <Input
            label="Phone Number" required
            error={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              required: 'Required',
              pattern: { value: /^\+?[0-9]{10,15}$/, message: 'Invalid phone number' },
            })}
          />
        </div>

        <Input
          label="Address Line 1" required
          placeholder="House no., Street, Area"
          error={errors.addressLine1?.message}
          {...register('addressLine1', { required: 'Required' })}
        />

        <Input
          label="Address Line 2"
          placeholder="Landmark, apartment (optional)"
          {...register('addressLine2')}
        />

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="City" required
            error={errors.city?.message}
            {...register('city', { required: 'Required' })}
          />
          <Input
            label="State" required
            error={errors.state?.message}
            {...register('state', { required: 'Required' })}
          />
          <Input
            label="Pincode" required
            error={errors.pincode?.message}
            {...register('pincode', {
              required: 'Required',
              pattern: { value: /^[0-9]{6}$/, message: '6 digits' },
            })}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('setAsDefault')} className="w-4 h-4 text-[#0078D4] rounded focus:ring-[#0078D4]" />
          <span className="text-sm text-gray-600">Set as default address</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
            {isEditing ? 'Update Address' : 'Save Address'}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

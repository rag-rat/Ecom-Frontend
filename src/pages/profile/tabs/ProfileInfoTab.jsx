
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { selectUser, updateUser } from '../../../store/slices/authSlice'
import { userApi } from '../../../api/userApi'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Edit basic profile fields — matches backend Part 7's
 * UpdateProfileRequest exactly: firstName, lastName, phoneNumber
 * (partial update — only changed fields need to be sent, though we
 * send all three since the form always has values for them).
 *
 * After a successful save, we dispatch updateUser (Part 3's authSlice
 * reducer) to sync the Navbar's displayed name immediately, without
 * requiring a full page refresh or re-login.
 */

export default function ProfileInfoTab() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
    },
  })

  useEffect(() => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
    })
  }, [user, reset])

  const onSubmit = async (data) => {
    try {
      const response = await userApi.updateProfile(data)
      dispatch(updateUser(response.data))
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    }
  }

  return (
    <div>
      <h2 className="font-display font-semibold text-lg text-gray-900 mb-1">
        Profile Information
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Update your personal details
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            error={errors.firstName?.message}
            {...register('firstName', { required: 'Required', minLength: { value: 2, message: 'Too short' } })}
          />
          <Input
            label="Last Name"
            error={errors.lastName?.message}
            {...register('lastName', { required: 'Required', minLength: { value: 2, message: 'Too short' } })}
          />
        </div>


        <div>
            <Input label="Email" value={user?.email || ''} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed</p>
        </div>


        <Input
          label="Phone Number"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber', {
            pattern: { value: /^\+?[0-9]{10,15}$/, message: 'Invalid phone number' },
          })}
        />

        <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
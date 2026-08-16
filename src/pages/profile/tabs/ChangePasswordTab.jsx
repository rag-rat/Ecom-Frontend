
import { useForm } from 'react-hook-form'
import { userApi } from '../../../api/userApi'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Matches backend Part 7's ChangePasswordRequest — requires
 * currentPassword (verified server-side before allowing the change,
 * a security measure explained in that backend module's comments).
 *
 * We DON'T pre-check anything client-side about the current password
 * (impossible — we never have access to it in plaintext); the backend
 * is the sole authority on whether it's correct.
 */

export default function ChangePasswordTab() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const newPassword = watch('newPassword')

  const onSubmit = async (data) => {
    try {
      await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password changed successfully')
      reset()
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    }
  }

  return (
    <div>
      <h2 className="font-display font-semibold text-lg text-gray-900 mb-1">
        Change Password
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose a strong password you haven't used before
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Input
          label="Current Password"
          type="password"
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'Required' })}
        />
        <Input
          label="New Password"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'Required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
          })}
        />
        <Input
          label="Confirm New Password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Required',
            validate: (v) => v === newPassword || 'Passwords do not match',
          })}
        />

        <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
          Update Password
        </Button>
      </form>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import OAuthButtons from '../../components/auth/OAuthButtons'
import { register as registerUser, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * Customer registration page. `watch('password')` lets us validate
 * the confirmPassword field against the LIVE value of the password
 * field — React Hook Form's watch() subscribes to a field's value
 * without needing separate useState.
 *
 * Field names match EXACTLY what the backend's RegisterRequest DTO
 * expects (Part 6 backend): firstName, lastName, email, password,
 * phoneNumber — so we can spread the form data directly into the
 * dispatch(registerUser(data)) call without remapping fields.
 */

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const password = watch('password')

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])


  const onSubmit = async (data) => {
    // confirmPassword is only for client-side validation —
    // strip it before sending to the backend
    const { confirmPassword, ...payload } = data

    const result = await dispatch(registerUser(payload))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Welcome to Ecom Store!')
      navigate('/', { replace: true })
    }
  }
  

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start shopping premium tech today"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            placeholder="Priya"
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'Required',
              minLength: { value: 2, message: 'Too short' },
            })}
          />
          <Input
            label="Last name"
            placeholder="Sharma"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Required',
              minLength: { value: 2, message: 'Too short' },
            })}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />

        <Input
          label="Phone number"
          type="tel"
          placeholder="9876543210"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber', {
            required: 'Phone number is required',
            pattern: {
              value: /^\+?[0-9]{10,15}$/,
              message: 'Enter a valid phone number',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
          })}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="full" loading={loading}>
          Create Account
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400">OR CONTINUE WITH</span>
          </div>
        </div>

        <OAuthButtons />

        <p className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0078D4] font-medium hover:text-[#106EBE]">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import OAuthButtons from '../../components/auth/OAuthButtons'
import { login, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice'
import { useEffect } from 'react'
import toast from 'react-hot-toast'


/*
 * WHY THIS FILE EXISTS
 * --------------------
 * The customer login page. Uses React Hook Form for validation —
 * it registers form fields via ref (no controlled re-renders on every
 * keystroke, unlike raw useState), and gives us `errors` and
 * `handleSubmit` with zero boilerplate.
 *
 * REDIRECT-AFTER-LOGIN:
 * If ProtectedRoute (Part 4) redirected the user here because they
 * tried to access a protected page while logged out, location.state.from
 * holds where they were headed. After successful login, we send them
 * back there instead of always to the homepage.
 */

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    // Clear any stale error from a previous attempt when this page mounts
    dispatch(clearError())
  }, [dispatch])


  const onSubmit = async (data) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.firstName}!`)
      const role = result.payload.user?.role
      navigate(role === 'ADMIN' ? '/admin/dashboard' : from, { replace: true })
    }
  }


  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue shopping"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs text-[#0078D4] hover:text-[#106EBE] font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="full" loading={loading}>
          Login
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
          Don't have an account?{' '}
          <Link to="/register" className="text-[#0078D4] font-medium hover:text-[#106EBE]">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

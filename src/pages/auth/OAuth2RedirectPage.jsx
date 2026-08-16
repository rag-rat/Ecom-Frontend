import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";
import { userApi } from "../../api/userApi";

/*
 * WHY THIS FILE EXISTS
 * --------------------
 * This is the exact URL the backend's OAuth2AuthenticationSuccessHandler
 * redirects to (Part 5 backend addition — OAuth2SuccessHandler):
 *
 *   http://localhost:5173/oauth2/redirect?token=eyJ...&refreshToken=eyJ...
 *
 * We read those query params, decode the JWT locally to extract user
 * info (role, name — no API call needed for this, since a JWT payload
 * is just Base64-encoded JSON we can read directly), and dispatch
 * setCredentials to populate Redux + localStorage exactly like a
 * normal login would.
 *
 * WHY DECODE THE JWT INSTEAD OF CALLING /api/auth/verify?
 * We already have a valid, signed token — no need for a network
 * round-trip just to get the same claims that are already embedded
 * in the token payload. Decoding is instant and works offline.
 */

export default function OAuth2RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("OAuth2RedirectPage mounted");

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      const errorParam = searchParams.get("error");
      if (errorParam) {
        toast.error(
          "Social login failed. Please try again or use email/password.",
        );
        navigate("/login", { replace: true });
        return;
      }
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        // JWT structure: header.payload.signature — we only need the payload
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        /*
         * Our backend's JwtService (Part 5 backend) puts these claims
         * in every access token: sub (userId), role.
         * We don't have firstName/lastName/email in the token itself
         * (they were never added as claims) — so we do a quick profile
         * fetch to get full user details for the Navbar/greeting.
         */
        const user = {
          userId: decodedPayload.sub,
          role: decodedPayload.role,
        };
        // dispatch(setCredentials({ accessToken: token, refreshToken, user }))

        // Fetch full profile to populate name/email for the Navbar
        try {

          localStorage.setItem("accessToken", token)
          localStorage.setItem("refreshToken", refreshToken)

          const profileResponse = await userApi.getProfile();
          // console.log("testing")


          dispatch(
            setCredentials({
              accessToken: token,
              refreshToken,
              user: {
                userId: profileResponse.data.id,
                firstName: profileResponse.data.firstName,
                lastName: profileResponse.data.lastName,
                email: profileResponse.data.email,
                role: profileResponse.data.role,
              },
            }),
          );
        } catch (err) {
          // Non-fatal — user is still logged in, just without full name shown yet

          console.log(err);
        }

        toast.success("Logged in successfully!");
        navigate(decodedPayload.role === "ADMIN" ? "/admin/dashboard" : "/", {
          replace: true,
        });
      } catch (err) {
        toast.error("Something went wrong processing your login.");
        navigate("/login", { replace: true });
      }
    };

    handleOAuthRedirect();
  }, [searchParams, dispatch, navigate]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <Spinner size="lg" />
      <p className="text-gray-500 text-sm">Completing your login...</p>
    </div>
  );
}

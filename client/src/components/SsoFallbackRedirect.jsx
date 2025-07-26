import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SsoFallbackRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    // Optionally, parse after_sign_in_url from query string
    const params = new URLSearchParams(window.location.search);
    const afterSignInUrl = params.get("after_sign_in_url") || "/dashboard";
    navigate(afterSignInUrl, { replace: true });
  }, [navigate]);
  return null;
}

export default SsoFallbackRedirect;

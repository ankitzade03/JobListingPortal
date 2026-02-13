import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SoftContext } from "../../context/SoftContext";

export const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setRole } = useContext(SoftContext);

  useEffect(() => {
    const token = params.get("token");
    const role = params.get("role");

    if (token) {
      setToken(token);
      setRole(role);
      navigate("/dashboard");
    }
  }, []);

  return <p className="text-center mt-20">Logging you in...</p>;
};

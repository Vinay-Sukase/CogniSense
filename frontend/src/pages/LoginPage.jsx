import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(form);
      navigate(response.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in.");
    }
  };

  return (
    <div className="mx-auto max-w-md panel p-8 md:p-10">
      <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <input
          className="input-control"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          className="input-control"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        {error && <p className="text-sm text-roseheat">{error}</p>}
        <button type="submit" disabled={loading} className="button-primary w-full">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

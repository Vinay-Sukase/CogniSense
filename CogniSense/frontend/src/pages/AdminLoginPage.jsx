import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(form);
      if (response.user.role !== "admin") {
        setError("This login is restricted to administrators.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in.");
    }
  };

  return (
    <div className="mx-auto max-w-md panel p-8">
      <h1 className="text-3xl font-semibold text-slate-900">Admin Login</h1>
      <p className="mt-2 text-sm muted-copy">
        Use environment-managed administrator credentials.
      </p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <input
          className="input-control"
          placeholder="Admin email"
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
          Sign in as admin
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;

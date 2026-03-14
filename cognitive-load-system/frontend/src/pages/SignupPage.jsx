import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      setSuccess("Account created successfully.");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Unable to create account."
      );
    }
  };

  return (
    <div className="hero-grid items-start">
      <section className="panel p-8 md:p-10">
        <div className="glass-chip">
          Start tracking cognitive workload
        </div>
        <h1 className="section-title mt-5">Create your account</h1>
        <p className="mt-4 max-w-xl muted-copy">
          New users get guided cognitive tests, performance history, and responsible well-being
          suggestions. Your results are educational and reflective, not diagnostic.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "Clear instructions before every test",
            "Visual dashboards for score and trends",
            "Private session history with delete controls",
            "Actionable focus and fatigue suggestions"
          ].map((item) => (
            <div key={item} className="panel-soft p-4 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>
      <div className="mx-auto w-full max-w-md panel p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Signup</h1>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <input
            className="input-control"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
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
          <input
            className="input-control"
            placeholder="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
          />
          {error && <p className="text-sm text-roseheat">{error}</p>}
          {success && <p className="text-sm text-teal-300">{success}</p>}
          <button type="submit" disabled={loading} className="button-primary w-full">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthShell, Field } from "./Login";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Keep your prescriptions in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-[#0F766E] font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <Field label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button className="w-full bg-[#0F766E] text-white text-sm font-semibold rounded-lg py-2.5 hover:opacity-90">
          Create account
        </button>
      </form>
    </AuthShell>
  );
}

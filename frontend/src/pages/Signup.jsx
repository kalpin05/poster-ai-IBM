import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name })
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onSignup(data.user);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Name" onChange={e => setName(e.target.value)} />
        <br />
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <br />
        <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
        <br />
        <button>Signup</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
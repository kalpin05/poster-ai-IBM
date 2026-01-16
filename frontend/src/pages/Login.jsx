import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <br />
        <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
        <br />
        <button>Login</button>
      </form>
      <p>New user? <Link to="/signup">Signup</Link></p>
    </div>
  );
}
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/dashboard">Home</Link>
      <Link to="/about">About</Link>
      <button onClick={logout}>Logout</button>
      <span style={{ marginLeft: "auto" }}>{user.email}</span>
    </nav>
  );
}
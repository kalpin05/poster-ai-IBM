import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatbotButton from "./components/ChatbotButtom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Protected from "./components/Protected";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <BrowserRouter>
      {user && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/signup" element={<Signup onSignup={setUser} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/about" element={<Protected><About /></Protected>} />
        
      </Routes>
      <ChatbotButton />
    </BrowserRouter>
  );
}
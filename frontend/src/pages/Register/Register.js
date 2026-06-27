import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { speak } from "../../utils/speech";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("Alex");
  const [email, setEmail] = useState("alex@echolearn.local");
  const [password, setPassword] = useState("password");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setError("Name, email and password are required.");
      speak("Name, email and password are required.");
      return;
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const result = await registerUser({ name, email, password });
      localStorage.setItem("echolearn-token", result.token);
      localStorage.setItem("echolearn-user", JSON.stringify(result.user));
      const text = `Account created for ${result.user.name}. Opening home dashboard.`;
      setMessage(text);
      speak(text);
      setTimeout(() => navigate("/"), 700);
    } catch (authError) {
      const text = authError.message || "Registration failed. Please try again.";
      setError(text);
      speak(text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page module-page auth-page">
      <span className="page-kicker">Register</span>
      <h1>Create account</h1>
      <form className="module-card wide auth-card" onSubmit={handleSubmit}>
        <p>Create a student profile for accessible voice learning.</p>
        <label><span>Name</span><input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label><span>Email</span><input autoComplete="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label><span>Password</span><input autoComplete="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button disabled={isLoading} type="submit">{isLoading ? "Creating..." : "Create Account"}</button>
        <span className="auth-switch">Already registered? <Link to="/login">Login</Link></span>
        {error && <p className="result-text error-text">{error}</p>}
        {message && <p className="result-text">{message}</p>}
      </form>
    </section>
  );
}

export default Register;

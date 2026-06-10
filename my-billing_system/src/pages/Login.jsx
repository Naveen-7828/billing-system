import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Login.css";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {

    const user = localStorage.getItem("user");

    if (user) {
      navigate("/");
      
    }

  }, [navigate]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        form
      );

      localStorage.setItem(
  "user",
  JSON.stringify(res.data)
);

window.location.href = "/";
    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid Username or Password"
      );

    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Forge India Connect </h1>

        <p>Billing Management System</p>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <div className="password-box">
  <input
    className="password-input"
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    required
  />

 <span
  className="eye-icon"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? "👁" : "⌣"}
</span>
</div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
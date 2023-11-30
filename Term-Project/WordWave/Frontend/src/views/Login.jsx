import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import axiosInstance from "../axios";
import { Link } from "react-router-dom";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const histroy = useHistory();
  const { state } = useLocation();
  const registration = state?.success;

  const handleLogin = (e) => {
    setError("");
    e.preventDefault();
    axiosInstance
      .post("/user/login", { email: username, password })
      .then(({ data }) => {
        window.localStorage.setItem("token", data.token);
        window.location.reload();
      })
      .catch((error) => {
        setError("Invalid Creds");
      });
  };

  return (
    <div className="container">
      <div
        className="row justify-content-center d-flex align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              {registration && (
                <Alert variant="success">Registration Success</Alert>
              )}
              {error && <Alert variant="danger">{error}</Alert>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>

                <p>
                  New User? <Link to="/register">Register</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

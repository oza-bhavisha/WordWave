import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axios";
import { useHistory } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const histroy = useHistory();

  const handleRegister = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/user/register", { email: email, password })
      .then(({ data }) => {
        histroy.push("/login", { state: { success: true } });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container ">
      <div
        className="row justify-content-center d-flex align-content-center"
        style={{ height: "100vh" }}
      >
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  Register
                </button>
                <p>
                  Already User? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

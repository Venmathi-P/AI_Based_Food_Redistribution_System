import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/register.css";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "business"
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const register = async () => {

        try {

            await api.post("/auth/register", form);

            alert("Registration Successful!");

            navigate("/");

        }
        catch (err) {

            if (err.response) {

                alert(
                    err.response.data.detail ||
                    JSON.stringify(err.response.data)
                );

            }
            else {

                alert("Server not responding");

            }

        }

    };

    return (

        <div className="register-page">

            <div className="register-container">

                {/* Left Side */}

                <div className="left-panel">

                    <div className="logo">

                        🌿 FoodBridge AI

                    </div>

                    <h1>

                        Join the FoodBridge Network

                    </h1>

                    <p>

                        Register as a Business or NGO and help
                        reduce food waste using Artificial Intelligence.

                    </p>

                    <div className="feature">

                        <h3>📦 Smart Inventory</h3>

                        <p>
                            Manage food inventory with AI.
                        </p>

                    </div>

                    <div className="feature">

                        <h3>⏰ Expiry Alerts</h3>

                        <p>
                            Receive automatic expiry notifications.
                        </p>

                    </div>

                    <div className="feature">

                        <h3>❤️ NGO Marketplace</h3>

                        <p>
                            Donate surplus food instantly.
                        </p>

                    </div>

                </div>

                {/* Right Side */}

                <div className="right-panel">

                    <div className="register-card">

                        <h2>

                            Create Account

                        </h2>

                        <p className="subtitle">

                            Register to continue

                        </p>

                        <div className="role-buttons">

                            <button
                                type="button"
                                className={
                                    form.role === "business"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        role: "business"
                                    })
                                }
                            >

                                🏢 Business

                            </button>

                            <button
                                type="button"
                                className={
                                    form.role === "ngo"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        role: "ngo"
                                    })
                                }
                            >

                                🤝 NGO

                            </button>

                        </div>

                        <input
                            type="text"
                            name="fullname"
                            placeholder="Full Name"
                            value={form.fullname}
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        <button
                            className="register-btn"
                            onClick={register}
                        >

                            Create Account

                        </button>

                        <div className="login-link">

                            Already have an account?

                            <Link to="/">

                                Login

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;
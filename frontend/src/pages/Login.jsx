import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [role, setRole] = useState("business");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const login = async () => {

        // ==============================
        // VALIDATION
        // ==============================

        if (!role) {
            alert("Please select a role.");
            return;
        }

        if (!form.email || !form.password) {
            alert("Please enter email and password.");
            return;
        }

        try {

            setLoading(true);

            // ==============================
            // LOGIN API
            // ==============================

            const res = await api.post("/auth/login", {
                email: form.email,
                password: form.password,
                role: role
            });

            console.log("LOGIN RESPONSE:", res.data);

            // ==============================
            // GET LOGIN DATA
            // ==============================

            const token = res.data.access_token;

            // Support either "id" or "user_id"
            const userId =
                res.data.user_id !== undefined
                    ? res.data.user_id
                    : res.data.id;

            const loggedInRole = res.data.role;

            // ==============================
            // CHECK TOKEN
            // ==============================

            if (!token) {
                alert("Login successful but JWT token was not received.");
                console.error("Missing access_token:", res.data);
                return;
            }

            // ==============================
            // CHECK ROLE
            // ==============================

            if (!loggedInRole) {
                alert("Login response does not contain a role.");
                console.error("Missing role:", res.data);
                return;
            }

            if (role !== loggedInRole) {

                alert(
                    `This account belongs to ${loggedInRole.toUpperCase()}.\n` +
                    `Please select the correct role.`
                );

                return;
            }

            // ==============================
            // CHECK USER ID
            // ==============================

            if (
                userId === undefined ||
                userId === null ||
                userId === ""
            ) {

                alert("User ID was not received from the server.");

                console.error(
                    "Login response does not contain user ID:",
                    res.data
                );

                return;
            }

            // ==============================
            // CLEAR OLD LOGIN DATA
            // ==============================

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
            localStorage.removeItem("business_name");
            localStorage.removeItem("email");

            // ==============================
            // SAVE NEW LOGIN DATA
            // ==============================

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "role",
                loggedInRole
            );

            localStorage.setItem(
                "user_id",
                String(userId)
            );

            localStorage.setItem(
                "email",
                form.email
            );

            // business_name may not exist for NGO
            if (res.data.business_name) {

                localStorage.setItem(
                    "business_name",
                    res.data.business_name
                );

            }

            // ==============================
            // DEBUG
            // ==============================

            console.log(
                "Login successful"
            );

            console.log(
                "Stored token:",
                localStorage.getItem("token")
            );

            console.log(
                "Stored role:",
                localStorage.getItem("role")
            );

            console.log(
                "Stored user_id:",
                localStorage.getItem("user_id")
            );

  // ==============================
// GO TO ROLE DASHBOARD
// ==============================

if (loggedInRole === "business") {
    navigate("/business/dashboard");
} else if (loggedInRole === "ngo") {
    navigate("/ngo/dashboard");
}

        } catch (err) {

            console.error(
                "LOGIN ERROR:",
                err
            );

            if (err.response) {

                console.error(
                    "Backend response:",
                    err.response.data
                );

                alert(
                    JSON.stringify(
                        err.response.data,
                        null,
                        2
                    )
                );

            } else {

                alert(
                    "Server not responding. Please make sure FastAPI is running."
                );

            }

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="login-page">

            <div className="login-container fb-animate-in">

                {/* ================================= */}
                {/* LEFT PANEL */}
                {/* ================================= */}

                <div className="left-panel">

                    <div className="logo">
                        🌿 Food Redistribution AI
                    </div>

                    <h1>
                        Zero Food Waste.<br />
                        Powered by Intelligent AI
                    </h1>

                    <p>
                        AI-powered surplus food redistribution platform
                        connecting Businesses and NGOs.
                    </p>

                    <div className="feature">

                        <h3>
                            📦 Smart Inventory
                        </h3>

                        <p>
                            Track inventory with expiry alerts.
                        </p>

                    </div>

                    <div className="feature">

                        <h3>
                            🤖 AI Prediction
                        </h3>

                        <p>
                            Predict food waste before it happens.
                        </p>

                    </div>

                    <div className="feature">

                        <h3>
                            ❤️ NGO Marketplace
                        </h3>

                        <p>
                            Donate surplus food instantly.
                        </p>

                    </div>

                </div>

                {/* ================================= */}
                {/* RIGHT PANEL */}
                {/* ================================= */}

                <div className="right-panel">

                    <div className="login-card">

                        <h2>
                            Welcome Back
                        </h2>

                        <p className="subtitle">
                            Login to continue
                        </p>

                        {/* ROLE */}

                        <label className="form-label">
                            Login As
                        </label>

                        <select
                            className="form-select"
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >

                            <option value="">
                                Select Role
                            </option>

                            <option value="business">
                                Business
                            </option>

                            <option value="ngo">
                                NGO
                            </option>

                        </select>

                        {/* EMAIL */}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                        />

                        {/* PASSWORD */}

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        {/* LOGIN BUTTON */}

                        <button
                            className="login-btn"
                            onClick={login}
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                        {/* REGISTER */}

                        <div className="register-link">

                            Don't have an account?

                            {" "}

                            <Link to="/register">
                                Register
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;
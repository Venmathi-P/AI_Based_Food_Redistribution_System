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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const login = async () => {
        if (!role) {
    alert("Please select a role.");
    return;
}

        try {

            const res = await api.post("/auth/login", {
    email: form.email,
    password: form.password,
    role: role
});

            // Role Validation
            if (role !== res.data.role) {
                alert(
                    `This account belongs to ${res.data.role.toUpperCase()}.\nPlease select the correct role.`
                );
                return;
            }

            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("user_id", String(res.data.id));
            localStorage.setItem("business_name", res.data.business_name);
            localStorage.setItem("email", form.email);

console.log("Stored user_id:", res.data.id);

navigate("/dashboard");

        } catch (err) {

            if (err.response) {

                console.log(err.response.data);
alert(JSON.stringify(err.response.data, null, 2));

            } else {

                alert("Server not responding");

            }

        }

    };

    return (

        <div className="login-page">

            <div className="login-container">

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

                        <h3>📦 Smart Inventory</h3>

                        <p>Track inventory with expiry alerts.</p>

                    </div>

                    <div className="feature">

                        <h3>🤖 AI Prediction</h3>

                        <p>Predict food waste before it happens.</p>

                    </div>

                    <div className="feature">

                        <h3>❤️ NGO Marketplace</h3>

                        <p>Donate surplus food instantly.</p>

                    </div>

                </div>

                <div className="right-panel">

                    <div className="login-card">

                        <h2>

                            Welcome Back

                        </h2>

                        <p className="subtitle">

                            Login to continue

                        </p>

                        <label className="form-label">Login As</label>

<select
    className="form-select"
    value={role}
    onChange={(e) => setRole(e.target.value)}
>

    <option value="">Select Role</option>

    <option value="business">Business</option>

    <option value="ngo">NGO</option>
    

</select>

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
                            className="login-btn"
                            onClick={login}
                        >

                            Login

                        </button>

                        <div className="register-link">

                            Don't have an account?

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
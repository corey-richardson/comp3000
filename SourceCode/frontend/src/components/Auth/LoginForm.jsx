import { useState } from "react";

import useLogin from "../../hooks/useLogin";
import formStyles from "../../styles/Forms.module.css";

const LoginForm = () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className={formStyles.formContainer}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in"}
                </button>

                { error && <p className="error-message">{ error }</p>}
            </form>
        </div>
    );
};

export default LoginForm;

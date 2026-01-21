import { useState } from "react";
import useSignup from "../../hooks/useSignup";

import formStyles from "../../styles/Forms.module.css";

const SignUpForm = () => {
    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");

    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async(e) => {
        e.preventDefault();
        await signup( username, email, password, confirmPassword, firstName, lastName )
    };

    return ( 
        <div className={formStyles.formContainer}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>

                <div className={formStyles.row}>
                    <input 
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                    />

                    <input 
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                    />
                </div>

                <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />

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

                <input 
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Sign up"}
                </button>

                {/* <button disabled>comouter say no</button> */}

                {/* { message && <p className="small">{ message }</p>} */}
                { error && <p className="error-message">{ error }</p>}
            </form>
        </div>
    );
}
 
export default SignUpForm;
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase-client";

const SignUpForm = () => {
    const router = useRouter();

    const [ email, setEmail ] = useState("");
    const [ name, setName ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState("");
    const [ message, setMessage ] = useState("");

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError("");

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError || !data.user) {
            setError(signUpError?.message || "Signup failed.");
            setLoading(false);
            return;
        }

        const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                id: data.user.id,
                name,
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error || "Failed to create User record.");
            setLoading(false);
            return;
        }

        setMessage("Sign up successful! Please check your email to confirm your account before signing in.")

        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
    };

    return ( 
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign up"}
                </button>

                { message && <p className="small">{ message }</p>}
                { error && <p className="error-message">{ error }</p>}
            </form>
        </div>
     );
}
 
export default SignUpForm;
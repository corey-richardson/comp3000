"use client";

import { useState } from "react";

import formStyles from "@/app/styles/Forms.module.css";
import { supabase } from "@/app/utils/supabase/client";


const SignUpForm = () => {
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

        /** Using an API route to create a User record after sign up is the safer option here as
         * after signup and until the user confirms their email address and then signs in, the 
         * client is unauthenticated. Any inserts to the table from the browser would be under the
         * `anon` role. Allowing `anon` to insert to the user table would requiring loosening RLS
         * policies and granting write privileges to all unauthenticated visitors. 
         * Instead, the request is done through a server-side API endpoint using the Service Role
         * Key, RLS can be bypassed without exposing elevated permissions to the client. Yay!
         */

        const response = await fetch("/api/profiles", {
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

        // const { data: response, error: insertError } = await supabase
        //     .from("User")
        //     .insert([{ id: data.user.id, name }]);
            
        // if (insertError) {
        //     setError(insertError.message || "Failed to create User record.");
        //     setLoading(false);
        //     return;
        // }

        setMessage("Sign up successful! Please check your email to confirm your account before signing in.")

        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
    };

    return ( 
        <div className={formStyles.formContainer}>
            <h2>Sign Up</h2>
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

                <button disabled>comouter say no</button>

                { message && <p className="small">{ message }</p>}
                { error && <p className="error-message">{ error }</p>}
            </form>
        </div>
    );
}
 
export default SignUpForm;
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import formStyles from "@/app/styles/Forms.module.css";
import { supabase } from "@/app/utils/supabase/client";

const LoginForm = () => {
    const router = useRouter();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState("");

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        const { data: _data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (signInError) {
            setError(signInError.message);
            return;
        }

        router.push("/dashboard");
    }

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

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>

                { error && <p className="error-message">{ error }</p>}
            </form>

            <p className="small centred">or continue with</p>

            {/* <button
                type="button"
                disabled={loading}
                onClick={() => {
                    supabase.auth.signInWithOAuth({provider: "google"})
                }}
            >
                Google
            </button> */}
            
            <button
                type="button"
                disabled={loading}
                onClick={() => {
                    supabase.auth.signInWithOAuth({
                        provider: "github",
                        options: {
                            redirectTo: `${window.location.origin}/auth/callback`
                        }
                    })
                }}
            >
                GitHub
            </button>
        </div>
    );
}
 
export default LoginForm;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        <div>
            <h1>Login</h1>
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

            <hr />

            {/* <button
                type="button"
                disabled={loading}
                onClick={() => {
                    supabase.auth.signInWithOAuth({provider: "google"})
                }}
            >
                Continue with Google
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
                Continue with GitHub
            </button>
        </div>
    );
}
 
export default LoginForm;

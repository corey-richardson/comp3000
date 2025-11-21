"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { supabase } from "@/app/utils/supabase/client";

const AuthCallback = () => {
    const router = useRouter();
    const isProcessed = useRef(false);

    useEffect(() => {
        const handleAuth = async () => {
            if (isProcessed.current) return;
            isProcessed.current = true;

            const { data, error: _error } = await supabase.auth.getSession();

            if (data.session) {
                const user = data.session.user;

                try {
                    await fetch("/api/profiles", {
                        method: "POST",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify({
                            id: user.id,
                            name: user.user_metadata.name,
                        }),
                    });
                }
                catch (error) {
                    console.error("Failed to create profile.");
                }

                router.push("/dashboard");
            } else {
                router.push("/");
            }
        };

        handleAuth();
    }, [ router ]);

    return ( 
        <p>Handling sign-in and creating or finding Profile and RecordsSummary entry...</p>
    );
}
 
export default AuthCallback;

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";

const AuthCallback = () => {
    const router = useRouter();

    useEffect(() => {
        const handleAuth = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (data.session) {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        };

        handleAuth();
    }, [ router ]);

    return ( 
        <p>Handling signin...</p>
     );
}
 
export default AuthCallback;

import type { Metadata } from "next";
import { APP_NAME } from "../lib/constants";
import Navbar from "../components/Navbar/Navbar";
import "../globals.css";

import { createServerSupabase } from '@/app/utils/supabase/server';
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: {
        template: `%s | ${ APP_NAME }`,
        default:  `${ APP_NAME }`,
    },
    description: "Archery Scorekeeping Tool",
};

export default async function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/");

    return (
        <>
            <Navbar />
      
            <div className="content">
                {children}
            </div>
        </>
    );
}

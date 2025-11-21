import type { Metadata } from "next";

import { APP_NAME } from "./lib/constants";
import "./globals.css";

export const metadata: Metadata = {
    title: `${ APP_NAME }`,
    description: "Archery Scorekeeping Tool",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>

        </html>
    );
}

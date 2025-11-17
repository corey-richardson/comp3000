import type { Metadata } from "next";
import { APP_NAME } from "../lib/constants";
import Navbar from "../components/Navbar/Navbar";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    template: `%s | ${ APP_NAME }`,
    default:  `${ APP_NAME }`,
  },
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
        <Navbar />
        
        <div className="content">
          {children}
        </div>
      </body>

    </html>
  );
}

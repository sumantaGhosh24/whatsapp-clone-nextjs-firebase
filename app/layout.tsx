import type {Metadata} from "next";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Whatsapp Clone",
  description: "Nextjs firebase whatsapp clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}

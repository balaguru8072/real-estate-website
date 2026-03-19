import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Provider from "./provider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
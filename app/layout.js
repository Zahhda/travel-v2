import { Poppins } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({ subsets: ['latin'], weight: ["300", "400", "500", "600", "700"] })

export const metadata = {
  title: "Go Luxus - Art of Traveling",
  description: "Luxury Hotel Booking Platform - Discover the finest hotels worldwide",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className} antialiased text-gray-800`} >
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
      </ClerkProvider>
  );
}

import { Poppins, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Renterty | Property Rental & Booking Platform",
  description: "List properties and book rental places securely.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            {/* Global Background Glow Effects */}
            <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
              <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 dark:bg-cyan-500/2 rounded-full blur-[120px]" />
            </div>

            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </AuthProvider>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}

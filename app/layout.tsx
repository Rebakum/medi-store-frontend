import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>        
        {children}
            <Toaster
                position="top-right"
                toastOptions={{
                  className:
                    "dark:bg-slate-900 dark:text-white bg-white text-slate-900 border dark:border-white/10",
                }}
              />

        </ThemeProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "The Gabo",
  description:
    "Elevating the humble rice bowl to an art form. Authentic Vietnamese cuisine with modern culinary techniques.",
  keywords: [
    "Vietnamese food",
    "rice bowl",
    "comfort food",
    "restaurant",
    "Asian cuisine",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="mdl-js" lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <RestaurantProvider>
              <ClientLayout>{children}</ClientLayout>
            </RestaurantProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

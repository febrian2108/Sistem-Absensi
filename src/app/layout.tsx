import type { Metadata } from "next";
import "./globals.css";
import Wrapper from "./components/organisms/wrapper/wrapper";

export const metadata: Metadata = {
  title: "AbsensiKu",
  description: "Online School Management System",
  icons: {
    icon: "/school.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Wrapper>{children}</Wrapper>
    </html>
  );
}

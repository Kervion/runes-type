import "./globals.css";

export const metadata = {
  title: "Runes Next",
  description: "Typescript version",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

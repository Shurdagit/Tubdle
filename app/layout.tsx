import "./globals.css";

export const metadata = {
  title: "TUBDLE",
  description: "Stockholms tunnelbanespel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        {children}
      </body>
    </html>
  );
}
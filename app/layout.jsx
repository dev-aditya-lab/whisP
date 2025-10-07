import "./globals.css";


export const metadata = {
  title: "Whisp - Private & Encrypted Messaging",
  description:
    "Whisp is a privacy-focused encrypted messaging platform with self-destructing messages and zero data retention, ensuring total user anonymity and security.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

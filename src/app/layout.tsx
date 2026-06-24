import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "بتنجان وبس | أصل البتنجان وألذ مسقعة بيتي",
  description: "أول لقمة هتفكرك بأكل البيت الحلو. استمتع بألذ مسقعة وخلطات البتنجان السرية وأكثر من مطعم بتنجان وبس.",
  keywords: ["بتنجان", "مسقعة", "أكل بيتي", "مطعم", "بتنجان وبس", "توصيل أكل", "طعام مصري", "مطعم مصري"],
  authors: [{ name: "بتنجان وبس" }],
  openGraph: {
      title: "بتنجان وبس | أصل البتنجان وألذ مسقعة بيتي",

    description: "أول لقمة هتفكرك بأكل البيت الحلو. استمتع بألذ مسقعة وخلطات البتنجان السرية.",
    url: "https://bitinjanwbas.vercel.app",
    siteName: "بتنجان وبس",
    images: [
      {
        url: "https://bitinjanwbas.vercel.app/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "بتنجان وبس - أكل بيتي",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
      title: "بتنجان وبس | أصل البتنجان وألذ مسقعة بيتي",

    description: "أول لقمة هتفكرك بأكل البيت الحلو. اطلب الآن من منيو بتنجان وبس.",
    images: ["https://bitinjanwbas.vercel.app/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body>{children}</body>
    </html>
  );
}

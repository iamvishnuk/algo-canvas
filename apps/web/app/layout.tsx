import { Inter, Poppins, Fira_Code } from 'next/font/google';

import '@workspace/ui/globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  weight: ['300', '400', '500', '600', '700']
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${poppins.variable} ${firaCode.variable} font-inter antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

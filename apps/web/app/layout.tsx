import { Inter, Poppins, Fira_Code } from 'next/font/google';

import '@workspace/ui/globals.css';
import ReduxProvider from '@/store/ReduxProvider';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import { Toaster } from '@/components/sonner';
import { AuthProvider } from '@/providers/AuthProvider';

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
        <ThemeProvider>
          <ReduxProvider>
            <QueryProvider>
              <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
            <Toaster
              richColors
              position='bottom-right'
            />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

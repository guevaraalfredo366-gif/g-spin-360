import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; 
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title:       'G-SPIN 360 | Plataforma de Cabinas 360°',
  description: 'La plataforma más avanzada para cabinas 360° en eventos. Graba, transforma y comparte momentos únicos con tus invitados.',
  keywords:    'cabina 360, photobooth, eventos, boda, fiesta, video 360',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

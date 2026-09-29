import './globals.css';
import 'katex/dist/katex.min.css';
import { Metadata } from 'next';
import { LanguageProvider } from '../lib/i18n/context';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Axiom | The Gymnasium for Mathematical & Algorithmic Reason',
  description: 'Original, academic-grade teaching and deliberate practice platform for university-level Mathematics and Computer Science.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-amber-500/20 selection:text-amber-500">
        <LanguageProvider>
          <Navbar />
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

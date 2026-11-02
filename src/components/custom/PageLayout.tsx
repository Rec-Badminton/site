import type { ReactNode } from 'react';
import Header from '@/components/custom/Header';
import Footer from '@/components/custom/Footer';
import { usePageMeta, type PageMeta } from '@/hooks/use-page-meta';

interface PageLayoutProps {
  meta: PageMeta;
  children: ReactNode;
}

const PageLayout = ({ meta, children }: PageLayoutProps) => {
  usePageMeta(meta);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;

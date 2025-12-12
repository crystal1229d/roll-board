import { ReactNode } from 'react';
import Footer from '@/shared/layout/footer/Footer';

type Props = {
  children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body className="site-body">
        <div className="site-layout">
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

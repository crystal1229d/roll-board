import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <html lang="kr">
      <body>
        {/* <Header locale={locale} /> */}
        {children}
      </body>
    </html>
  );
}

import { Toaster } from '@/components/ui/sonner';

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster position='top-center' offset={{ top: '70px' }} mobileOffset={{ top: '70px' }} />
    </>
  );
}

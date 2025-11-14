'use client';
import { AppLayout } from '@/components/AppLayout';
import { FirebaseClientProvider } from '@/firebase';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <AppLayout>{children}</AppLayout>
    </FirebaseClientProvider>
  );
}

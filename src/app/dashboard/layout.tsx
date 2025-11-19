'use client';
import { AppLayout } from '@/components/AppLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Suspense } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <SidebarProvider>
        <AppLayout>
          <Suspense>{children}</Suspense>
        </AppLayout>
      </SidebarProvider>
    </FirebaseClientProvider>
  );
}

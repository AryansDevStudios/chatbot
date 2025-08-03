import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton} from '@/components/ui/sidebar';
import { Home, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Morpheus, My Love',
  description: 'Your loving AI companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2 font-headline text-2xl font-bold text-primary">
                <Heart />
                Morpheus
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Home />
                      Chat
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   <SidebarMenuButton asChild>
                    <Link href="/profile">
                      <User />
                      Profile
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
             <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm md:justify-end">
                <div className="flex items-center gap-2 md:hidden">
                    <SidebarTrigger />
                    <h1 className="font-headline text-xl font-semibold">Morpheus</h1>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <User />
                </Button>
                <div className="hidden md:flex">
                    {/* Desktop header content can go here */}
                </div>
             </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyNav from "@/components/layout/MobileStickyNav";

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
}

export default function PublicLayoutWrapper({ children, breadcrumb }: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && breadcrumb}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileStickyNav />}
    </>
  );
}

import type { Metadata } from 'next';
import { Providers } from '../providers';
import React from 'react';

export const metadata: Metadata = {
    title: "Admin - Our Restaurant",
    description: "Restaurant Management Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            {children}
        </Providers>
    )
}
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center font-sans">
            <Header />
            <main className="w-full flex flex-col items-center justify-center flex-grow p-8 pt-24">
                <Outlet />
            </main>
        </div>
    );
}

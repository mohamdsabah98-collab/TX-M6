'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowUpTrayIcon, EllipsisVerticalIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface StorageInfo {
  storageUsed: number;
  storageLimit: number;
  storagePercentage: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const [userRes, storageRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/users/storage`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data.user);
        setStorage(storageRes.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">TX</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">TX-M6</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              ☰
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <span>📁</span>
            {sidebarOpen && <span>Files</span>}
          </Link>
          <Link
            href="/dashboard/shared"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>🔗</span>
            {sidebarOpen && <span>Shared</span>}
          </Link>
          <Link
            href="/dashboard/storage"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>💾</span>
            {sidebarOpen && <span>Storage</span>}
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          {sidebarOpen && storage && (
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Storage Used</p>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full transition-all"
                  style={{ width: `${Math.min(storage.storagePercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                {Math.round(storage.storageUsed / 1024 / 1024)} MB / {Math.round(storage.storageLimit / 1024 / 1024 / 1024)} GB
              </p>
            </div>
          )}
          <button
            onClick={() => handleLogout()}
            className="w-full btn btn-secondary text-sm"
          >
            {sidebarOpen ? 'Sign Out' : '↪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm">Welcome, {user?.firstName}!</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

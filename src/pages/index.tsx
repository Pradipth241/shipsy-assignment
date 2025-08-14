// pages/index.tsx
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">Shipsy Assignment</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome to the Shipment Management Portal</p>
        <div>
            {isAuthenticated ? (
                <Link href="/dashboard" className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600">
                    Go to Dashboard
                </Link>
            ) : (
                <Link href="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600">
                    Login / Register
                </Link>
            )}
        </div>
    </div>
  );
}
// src/pages/register.tsx
import { useForm, FieldValues } from 'react-hook-form'; // Import FieldValues
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // FIX 1: Changed 'data: any' to 'data: FieldValues'
  const onSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to register');
      }
      
      router.push('/login');
    } catch (err: unknown) { // FIX 2: Changed 'err: any' to 'err: unknown'
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
              <input {...register('username')} id="username" className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
              <input {...register('password')} id="password" type="password" className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
              {isSubmitting ? 'Creating Account...' : 'Register'}
            </button>
        </form>
        <p className="text-center mt-4">
            Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
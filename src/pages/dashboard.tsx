// src/pages/dashboard.tsx
import { useEffect, useState, useCallback } from 'react'; // Add useCallback
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

// ... (Shipment interface remains the same)
interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  carrier: string;
  product: string;
  createdAt: string;
}

export default function Dashboard() {
  const { token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);

  // --- THIS IS THE FIX ---
  // 1. Moved fetchShipments out of useEffect and wrapped in useCallback
  const fetchShipments = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    try {
      const res = await fetch(`/api/shipments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        setShipments(data);
      } else {
        toast.error("Failed to fetch shipments.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching shipments.");
    }
  }, [token, isAuthenticated]); // Dependencies for the function

  // 2. useEffect now calls the function from the outer scope
  useEffect(() => {
    if (isAuthenticated && router.isReady) {
      fetchShipments();
    }
  }, [isAuthenticated, router.isReady, fetchShipments]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
        const promise = fetch(`/api/shipments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.promise(promise, {
            loading: 'Deleting...',
            success: (res) => {
                if(!res.ok) throw new Error("Failed to delete.");
                fetchShipments(); // This will now work correctly
                return "Shipment deleted!";
            },
            error: "Failed to delete shipment."
        });
    }
  };
  // ... (the rest of the component is the same)
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Shipment ID copied!");
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-600">Loading application...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shipments</h1>
          <p className="mt-1 text-sm text-slate-600">A summary of all your recent shipments.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/add-shipment" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition-colors">
              Add Shipment
            </Link>
            <Link href="/search" className="bg-white text-slate-700 px-4 py-2 rounded-lg font-semibold border border-slate-300 hover:bg-slate-50 transition-colors">
              Search
            </Link>
        </div>
      </div>

      <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['Shipment ID', 'Route', 'Product', 'Status', 'Created', ''].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <h3 className="text-sm font-semibold text-slate-800">No shipments yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by adding a new shipment.</p>
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{shipment.id}</span>
                        <button onClick={() => handleCopyId(shipment.id)} className="text-slate-400 hover:text-indigo-600">
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">{shipment.origin} → {shipment.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{shipment.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(shipment.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </Menu.Button>
                        <Transition
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    // onClick={() => handleOpenEditModal(shipment)} // We will create the edit page later
                                    className={`${active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                  >
                                    Edit
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleDelete(shipment.id)}
                                    className={`${active ? 'bg-red-50 text-red-900' : 'text-red-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                  >
                                    Delete Shipment
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
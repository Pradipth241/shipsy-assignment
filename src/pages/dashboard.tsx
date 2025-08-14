// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

// Define the type for a single shipment
interface Shipment {
  id: string;
  description: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  isFragile: boolean;
  shippingCost: number;
  createdAt: string;
}

export default function Dashboard() {
  const { token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  const fetchShipments = async () => {
    if (!token) return;
    const res = await fetch(`/api/shipments?page=${page}&limit=5&status=${filter}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      const { data, pagination } = await res.json();
      setShipments(data);
      setTotalPages(pagination.totalPages);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchShipments();
    }
  }, [isAuthenticated, token, page, filter]);

  if (isLoading || !isAuthenticated) {
    return <p>Loading...</p>;
  }

  const handleDelete = (id: string) => alert(`Placeholder for deleting shipment ${id}`);
  const handleEdit = (shipment: Shipment) => alert(`Placeholder for editing ${shipment.description}`);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Shipments</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            New Shipment
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-4">
        <select onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="p-2 border rounded-md">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {/* Shipments Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{shipment.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                        shipment.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {shipment.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${shipment.shippingCost.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(shipment)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(shipment.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
          <p>Page {page} of {totalPages}</p>
          <div>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-white px-4 py-2 border rounded-md mr-2 disabled:opacity-50">
                Previous
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="bg-white px-4 py-2 border rounded-md disabled:opacity-50">
                Next
            </button>
          </div>
      </div>
    </Layout>
  );
}
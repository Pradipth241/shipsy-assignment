// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ShipmentModal from '@/components/ShipmentModal';
import toast from 'react-hot-toast'; // Import toast
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline'; // Import icon


// ... (Keep your Shipment interface)
interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  isFragile: boolean;
  shippingCost: number;
  weightInKg: number;
  ratePerKg: number;
  createdAt: string;
}

export default function Dashboard() {
  // ... (Keep all your existing state hooks)
  const { token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', isFragile: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const fetchShipments = async () => {
    // ... (Keep the existing fetchShipments logic)
    if (!token) return;
    const query = new URLSearchParams({ page: String(page), limit: '5', ...filters }).toString();
    try {
      const res = await fetch(`/api/shipments?${query}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const { data, pagination } = await res.json();
        setShipments(data);
        setTotalPages(pagination.totalPages);
      } else { toast.error("Failed to fetch shipments."); }
    } catch (error) { toast.error("An error occurred while fetching."); }
  };

  // ... (Keep the useEffect hooks)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) fetchShipments();
  }, [isAuthenticated, token, page, filters]);

  // ... (Keep handleFilterChange, handleOpenCreateModal, handleOpenEditModal)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleOpenCreateModal = () => {
    setEditingShipment(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setIsModalOpen(true);
  };

  // UPDATE DELETE HANDLER TO USE TOAST
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      const promise = fetch(`/api/shipments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      toast.promise(promise, {
        loading: 'Deleting shipment...',
        success: () => {
          fetchShipments(); // Refresh list on success
          return 'Shipment deleted successfully!';
        },
        error: 'Failed to delete shipment.',
      });
    }
  };
  
  // ... (Keep the isLoading check)
  if (isLoading || !isAuthenticated) {
     return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-slate-600">Loading application...</p>
        </div>
     )
  }

  // RETURN THE NEW JSX
  return (
    <>
      <Layout>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Shipments Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">View, create, and manage all your shipments.</p>
          </div>
          <button onClick={handleOpenCreateModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition-colors">
            Add Shipment
          </button>
        </div>
        
        <div className="flex gap-4 mb-4">
          <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border border-slate-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-indigo-500">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select name="isFragile" value={filters.isFragile} onChange={handleFilterChange} className="p-2 border border-slate-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-indigo-500">
            <option value="">Any Fragility</option>
            <option value="true">Fragile Only</option>
            <option value="false">Not Fragile</option>
          </select>
        </div>

        <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Shipment ID', 'Origin → Destination', 'Status', 'Cost', 'Created', ''].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <ArchiveBoxXMarkIcon className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-2 text-sm font-semibold text-slate-800">No shipments found</h3>
                      <p className="mt-1 text-sm text-slate-500">Get started by creating a new shipment.</p>
                    </td>
                  </tr>
                ) : (
                  shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{shipment.id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">
                          {shipment.origin} → {shipment.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                            shipment.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-800' :
                            shipment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                            {shipment.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">${shipment.shippingCost.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(shipment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleOpenEditModal(shipment)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(shipment.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {shipments.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-slate-700">Page {page} of {totalPages}</p>
            <div>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-white px-4 py-2 border rounded-md text-sm font-semibold mr-2 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="bg-white px-4 py-2 border rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </Layout>
      
      <ShipmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
            // Use toast on success from modal
            toast.success(editingShipment ? 'Shipment updated successfully!' : 'Shipment created successfully!');
            fetchShipments();
        }}
        shipmentToEdit={editingShipment}
      />
    </>
  );
}
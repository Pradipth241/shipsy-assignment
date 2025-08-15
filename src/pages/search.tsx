// src/pages/search.tsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';
import Barcode from 'react-barcode';

// Define the detailed Shipment interface including history
interface ShipmentHistory {
  timestamp: string;
  location: string;
  status: string;
  updatedBy: string;
  remarks: string | null;
}
interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  product: string;
  carrier: string;
  paymentMode: string;
  totalFreight: number;
  expectedDeliveryDate: string;
  history: ShipmentHistory[];
}

export default function SearchPage() {
  const { token } = useAuth();
  const [shipmentId, setShipmentId] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipmentId) return;

    setIsLoading(true);
    setError('');
    setShipment(null);

    try {
      const res = await fetch(`/api/shipments/${shipmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Shipment not found or an error occurred.');
      }
      const data = await res.json();
      setShipment(data);
    } catch (err: unknown) { // <-- THIS IS THE FIX (changed from 'any' to 'unknown')
      // This is a safe way to handle errors in TypeScript
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Track Shipment</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Enter a Shipment ID to see its full details and history.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          placeholder="Enter Shipment ID"
          className="w-full max-w-sm p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
        />
        <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300">
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results Section */}
      {shipment && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Shipment Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">ID: {shipment.id}</p>
            </div>
            <Barcode value={shipment.id} height={50} displayValue={false} background="transparent" lineColor={document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#334155'} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Origin</p><p className="font-semibold text-slate-800 dark:text-slate-200">{shipment.origin}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Destination</p><p className="font-semibold text-slate-800 dark:text-slate-200">{shipment.destination}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Status</p><p className="font-semibold text-slate-800 dark:text-slate-200">{shipment.status}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Product</p><p className="font-semibold text-slate-800 dark:text-slate-200">{shipment.product}</p></div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Shipment History</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                    {['Date', 'Time', 'Location', 'Status', 'Updated By'].map(header => (
                        <th key={header} className="px-4 py-2 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {shipment.history.map(entry => (
                    <tr key={entry.timestamp}>
                        <td className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">{new Date(entry.timestamp).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                        <td className="px-4 py-2 text-sm text-slate-800 dark:text-slate-200">{entry.location}</td>
                        <td className="px-4 py-2 text-sm text-slate-800 dark:text-slate-200">{entry.status}</td>
                        <td className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">{entry.updatedBy}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
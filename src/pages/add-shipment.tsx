// src/pages/add-shipment.tsx
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function AddShipmentPage() {
  const { register, handleSubmit, watch } = useForm();
  const { token } = useAuth();

  const weight = watch('weight', 0);
  const ratePerKg = watch('ratePerKg', 0);
  const totalFreight = (Number(weight) || 0) * (Number(ratePerKg) || 0);

  const onSubmit = async (data: any) => {
    const apiCall = async () => {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          weight: parseFloat(data.weight),
          packages: parseInt(data.packages, 10),
          quantity: parseInt(data.quantity, 10),
          ratePerKg: parseFloat(data.ratePerKg),
          totalFreight: totalFreight,
          pickupDate: new Date(data.pickupDate),
          expectedDeliveryDate: new Date(data.expectedDeliveryDate),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return response.json();
    };

    toast.promise(apiCall(), {
      loading: 'Creating shipment...',
      success: () => {
        window.location.href = '/dashboard';
        return 'Shipment created successfully!';
      },
      error: (err) => `Failed to create shipment: ${err.message}`,
    });
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Add New Shipment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Shipper Details</h2>
            <div className="space-y-4">
              <input {...register('shipperName', { required: true })} placeholder="Shipper Name" className="w-full p-2 border rounded" />
              <input {...register('shipperPhone', { required: true })} placeholder="Phone" className="w-full p-2 border rounded" />
              <input {...register('shipperAddress', { required: true })} placeholder="Address" className="w-full p-2 border rounded" />
              <input {...register('shipperEmail', { required: true })} type="email" placeholder="Email" className="w-full p-2 border rounded" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Receiver Details</h2>
            <div className="space-y-4">
              <input {...register('receiverName', { required: true })} placeholder="Receiver Name" className="w-full p-2 border rounded" />
              <input {...register('receiverPhone', { required: true })} placeholder="Phone" className="w-full p-2 border rounded" />
              <input {...register('receiverAddress', { required: true })} placeholder="Address" className="w-full p-2 border rounded" />
              <input {...register('receiverEmail', { required: true })} type="email" placeholder="Email" className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
           <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Shipment Details</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input {...register('origin', { required: true })} placeholder="Origin City" className="w-full p-2 border rounded" />
              <input {...register('destination', { required: true })} placeholder="Destination City" className="w-full p-2 border rounded" />
              <input {...register('carrier', { required: true })} placeholder="Carrier (e.g., FedEx)" className="w-full p-2 border rounded" />
              <input {...register('product', { required: true })} placeholder="Product Description" className="w-full p-2 border rounded" />
              <input {...register('weight', { required: true })} type="number" step="0.1" placeholder="Weight (kg)" className="w-full p-2 border rounded" />
              <input {...register('ratePerKg', { required: true })} type="number" step="0.01" placeholder="Rate per Kg" className="w-full p-2 border rounded" />
              <input {...register('packages', { required: true })} type="number" placeholder="Number of Packages" className="w-full p-2 border rounded" />
              <input {...register('quantity', { required: true })} type="number" placeholder="Total Quantity" className="w-full p-2 border rounded" />
              <select {...register('typeOfShipment')} defaultValue="DOOR_TO_DOOR" className="w-full p-2 border rounded">
                <option value="DOOR_TO_DOOR">Door to Door</option>
                <option value="DOOR_TO_PORT">Door to Port</option>
                <option value="PORT_TO_DOOR">Port to Door</option>
              </select>
              <select {...register('paymentMode')} defaultValue="PREPAID" className="w-full p-2 border rounded">
                <option value="PREPAID">Prepaid</option>
                <option value="POSTPAID">Postpaid</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              </select>
              <select {...register('mode')} defaultValue="LAND" className="w-full p-2 border rounded">
                <option value="LAND">Land</option>
                <option value="AIR">Air</option>
                <option value="OCEAN">Ocean</option>
              </select>
              <div>
                <label className="text-xs text-slate-500">Pickup Date</label>
                <input {...register('pickupDate', { required: true })} type="date" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Expected Delivery</label>
                <input {...register('expectedDeliveryDate', { required: true })} type="date" className="w-full p-2 border rounded" />
              </div>
           </div>
           <div className="mt-4">
              <p className="text-slate-600">Total Freight (Auto-Calculated): <span className="font-bold text-slate-800">${totalFreight.toFixed(2)}</span></p>
           </div>
           <div className="mt-4">
                <textarea {...register('comments')} placeholder="Comments (optional)" className="w-full p-2 border rounded" rows={3}></textarea>
           </div>
        </div>
        
        <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-indigo-700">
                Save Shipment
            </button>
        </div>
      </form>
    </Layout>
  );
}
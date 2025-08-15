// src/pages/edit/[id].tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function EditShipmentPage() {
  const { register, handleSubmit, watch, reset } = useForm();
  const { token } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id || !token) return;
    const fetchShipmentData = async () => {
      try {
        const res = await fetch(`/api/shipments/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Could not fetch shipment data');
        const data = await res.json();
        reset({
            ...data,
            pickupDate: new Date(data.pickupDate).toISOString().split('T')[0],
            expectedDeliveryDate: new Date(data.expectedDeliveryDate).toISOString().split('T')[0],
        });
      } catch (error) {
        toast.error('Failed to load shipment details.');
        router.push('/dashboard');
      }
    };
    fetchShipmentData();
  }, [id, token, reset, router]);

  const weight = watch('weight', 0);
  const ratePerKg = watch('ratePerKg', 0);
  const totalFreight = (Number(weight) || 0) * (Number(ratePerKg) || 0);

  const onSubmit = async (data: any) => {
    const apiCall = async () => {
      const response = await fetch(`/api/shipments/${id}`, {
        method: 'PUT',
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
      loading: 'Updating shipment...',
      success: () => {
        window.location.href = '/dashboard';
        return 'Shipment updated successfully!';
      },
      error: (err) => `Failed to update shipment: ${err.message}`,
    });
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Edit Shipment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 border-b dark:border-slate-600 pb-2">Shipper Details</h2>
            <div className="space-y-4">
              <input {...register('shipperName', { required: true })} placeholder="Shipper Name" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('shipperPhone', { required: true })} placeholder="Phone" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('shipperAddress', { required: true })} placeholder="Address" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('shipperEmail', { required: true })} type="email" placeholder="Email" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 border-b dark:border-slate-600 pb-2">Receiver Details</h2>
            <div className="space-y-4">
              <input {...register('receiverName', { required: true })} placeholder="Receiver Name" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('receiverPhone', { required: true })} placeholder="Phone" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('receiverAddress', { required: true })} placeholder="Address" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('receiverEmail', { required: true })} type="email" placeholder="Email" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
           <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 border-b dark:border-slate-600 pb-2">Shipment Details</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input {...register('origin', { required: true })} placeholder="Origin City" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('destination', { required: true })} placeholder="Destination City" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('carrier', { required: true })} placeholder="Carrier (e.g., FedEx)" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('product', { required: true })} placeholder="Product Description" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('weight', { required: true })} type="number" step="0.1" placeholder="Weight (kg)" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('ratePerKg', { required: true })} type="number" step="0.01" placeholder="Rate per Kg" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('packages', { required: true })} type="number" placeholder="Number of Packages" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <input {...register('quantity', { required: true })} type="number" placeholder="Total Quantity" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              <select {...register('typeOfShipment')} className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                <option value="DOOR_TO_DOOR">Door to Door</option>
                <option value="DOOR_TO_PORT">Door to Port</option>
                <option value="PORT_TO_DOOR">Port to Door</option>
              </select>
              <select {...register('paymentMode')} className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                <option value="PREPAID">Prepaid</option>
                <option value="POSTPAID">Postpaid</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              </select>
              <select {...register('mode')} className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                <option value="LAND">Land</option>
                <option value="AIR">Air</option>
                <option value="OCEAN">Ocean</option>
              </select>
              <select {...register('status')} className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                <option value="PENDING">Pending</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Pickup Date</label>
                <input {...register('pickupDate', { required: true })} type="date" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Expected Delivery</label>
                <input {...register('expectedDeliveryDate', { required: true })} type="date" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" />
              </div>
           </div>

           {/* --- THIS IS THE NEW CHECKBOX --- */}
           <div className="mt-6">
             <label className="flex items-center">
               <input type="checkbox" {...register('isFragile')} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
               <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">This shipment is fragile</span>
             </label>
           </div>
           
           <div className="mt-4">
              <p className="text-slate-600 dark:text-slate-300">Total Freight (Auto-Calculated): <span className="font-bold text-slate-800 dark:text-slate-100">${totalFreight.toFixed(2)}</span></p>
           </div>
           <div className="mt-4">
                <textarea {...register('comments')} placeholder="Comments (optional)" className="w-full p-2 border rounded bg-transparent border-slate-300 dark:border-slate-600" rows={3}></textarea>
           </div>
        </div>
        <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-indigo-700">
                Update Shipment
            </button>
        </div>
      </form>
    </Layout>
  );
}
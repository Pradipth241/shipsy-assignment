// src/components/ShipmentModal.tsx
// (Keep all your existing imports and logic)
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Add this import

// ... (Keep your type definitions and component props interface)
type ShipmentFormData = {
  origin: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  isFragile: boolean;
  weightInKg: number;
  ratePerKg: number;
};
interface Shipment {
  id: string;
  [key: string]: any; 
}
interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shipmentToEdit?: Shipment | null;
}


export default function ShipmentModal({ isOpen, onClose, onSuccess, shipmentToEdit }: ShipmentModalProps) {
  // ... (Keep all your existing hooks and logic from the previous version)
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ShipmentFormData>();
  const { token } = useAuth();
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!shipmentToEdit;
  const weight = watch('weightInKg', 0);
  const rate = watch('ratePerKg', 0);
  const calculatedCost = (Number(weight) || 0) * (Number(rate) || 0);

  useEffect(() => {
    if (isOpen) {
      if (shipmentToEdit) {
        reset({
          ...shipmentToEdit,
          weightInKg: Number(shipmentToEdit.weightInKg),
          ratePerKg: Number(shipmentToEdit.ratePerKg),
        });
      } else {
        reset({
          origin: '',
          destination: '',
          status: 'PENDING',
          isFragile: false,
          weightInKg: 10,
          ratePerKg: 2.5,
        });
      }
    }
  }, [isOpen, shipmentToEdit, reset]);

  const onSubmit = async (data: ShipmentFormData) => {
    setIsSubmitting(true);
    setApiError('');
    const url = isEditMode ? `/api/shipments/${shipmentToEdit?.id}` : '/api/shipments';
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save shipment.');
      onSuccess();
      onClose();
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Shipment' : 'Create New Shipment'}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-6 w-6"/>
            </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ... (The rest of your form JSX from the previous step goes here) ... */}
          {/* I'll re-paste the form with the new, cleaner styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-slate-700">Origin City</label>
              <input {...register('origin', { required: 'Origin is required' })} id="origin" className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>}
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-slate-700">Destination City</label>
              <input {...register('destination', { required: 'Destination is required' })} id="destination" className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
            </div>
            <div>
              <label htmlFor="weightInKg" className="block text-sm font-medium text-slate-700">Weight (kg)</label>
              <input type="number" step="0.1" {...register('weightInKg', { required: true, valueAsNumber: true, min: 0.1 })} id="weightInKg" className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
              <label htmlFor="ratePerKg" className="block text-sm font-medium text-slate-700">Rate (per kg)</label>
              <input type="number" step="0.01" {...register('ratePerKg', { required: true, valueAsNumber: true, min: 0.01 })} id="ratePerKg" className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
              <select {...register('status')} id="status" className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="PENDING">Pending</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Auto-Calculated Cost</label>
              <div className="mt-1 w-full p-2 border border-slate-200 bg-slate-50 rounded-md">
                <span className="text-slate-800 font-semibold">${calculatedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="flex items-center">
              <input type="checkbox" {...register('isFragile')} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="ml-2 text-sm text-slate-700">This shipment is fragile</span>
            </label>
          </div>
          {apiError && <p className="text-red-500 text-center text-sm my-4">{apiError}</p>}
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-white px-4 py-2 rounded-md text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300">
              {isSubmitting ? 'Saving...' : 'Save Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
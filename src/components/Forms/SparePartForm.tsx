import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { SparePart } from '../../types';

interface SparePartFormProps {
  sparePart?: SparePart;
  onSubmit: (data: Partial<SparePart>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface SparePartFormData {
  name: string;
  partNumber: string;
  compatibleWith: string;
  // price: number; // Removed
  supplier: string;
  brandName: string;
  apiSpec: string;
  packSize: string;
  uom: string;
  unitsPerCase: number;
  qtyPerCaseL?: number;
}

const SparePartForm: React.FC<SparePartFormProps> = ({
  sparePart,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // watch // No longer needed
  } = useForm<SparePartFormData>();

  useEffect(() => {
    if (sparePart) {
      reset({
        name: sparePart.name,
        partNumber: sparePart.partNumber,
        compatibleWith: sparePart.compatibleWith,
        // price: sparePart.price, // Removed
        supplier: sparePart.supplier,
        brandName: sparePart.brandName,
        apiSpec: sparePart.apiSpec,
        packSize: sparePart.packSize,
        uom: sparePart.uom,
        unitsPerCase: sparePart.unitsPerCase,
        qtyPerCaseL: sparePart.qtyPerCaseL,
      });
    } else {
      reset({ // Default values for new spare part
        qtyPerCaseL: undefined
      });
    }
  }, [sparePart, reset]);

  const onFormSubmit = (data: SparePartFormData) => {
    const submittedData = { ...data } as Partial<SparePartFormData & { qtyPerCaseL: number | undefined | string }>;
    if (submittedData.qtyPerCaseL === undefined || submittedData.qtyPerCaseL === null || String(submittedData.qtyPerCaseL).trim() === '') {
        delete submittedData.qtyPerCaseL;
    } else {
        submittedData.qtyPerCaseL = Number(submittedData.qtyPerCaseL);
    }
    onSubmit(submittedData as Partial<SparePart>);
  };

  // const uomValue = watch('uom'); // Removed
  // const showQtyPerCaseL = uomValue?.toLowerCase() === 'l' || uomValue?.toLowerCase() === 'ml'; // Removed

  const formFields = [
    { name: 'name' as const, label: 'Part Name', type: 'text', placeholder: 'Enter part name', required: 'Part name is required', colSpan: 'sm:col-span-2' },
    { name: 'brandName' as const, label: 'Brand Name', type: 'text', placeholder: 'Enter brand name', required: 'Brand name is required', colSpan: 'sm:col-span-1' },
    { name: 'partNumber' as const, label: 'Part Number', type: 'text', placeholder: 'Enter part number', required: 'Part number is required', colSpan: 'sm:col-span-1' },
    { name: 'apiSpec' as const, label: 'API Specification', type: 'text', placeholder: 'e.g., SP-API-XYZ12', required: 'API Spec is required', colSpan: 'sm:col-span-1' },
    { name: 'packSize' as const, label: 'Pack Size', type: 'text', placeholder: 'e.g., 1 unit, 1 set', required: 'Pack size is required', colSpan: 'sm:col-span-1' },
    { name: 'compatibleWith' as const, label: 'Compatible With', type: 'text', placeholder: 'Enter compatible models', required: 'Compatible models are required', colSpan: 'sm:col-span-2' },
    { name: 'supplier' as const, label: 'Supplier', type: 'text', placeholder: 'Enter supplier name', required: 'Supplier is required', colSpan: 'sm:col-span-2' },
    // { name: 'price' as const, label: 'Price ($)', type: 'number', placeholder: '0.00', required: 'Price is required', min: { value: 0, message: 'Price must be positive' }, colSpan: 'sm:col-span-1' }, // Removed
    { name: 'uom' as const, label: 'Unit of Measure (UOM)', type: 'text', placeholder: 'e.g., unit, set, pcs', required: 'UOM is required', colSpan: 'sm:col-span-1' },
    { name: 'unitsPerCase' as const, label: 'Units Per Case', type: 'number', placeholder: '0', required: 'Units per case is required', min: { value: 1, message: 'Must be at least 1' }, colSpan: 'sm:col-span-1' },
    { name: 'qtyPerCaseL' as const, label: 'Qty per Case (L)', type: 'number', placeholder: 'e.g., 1.5 (Optional)', required: false, min: { value: 0, message: 'Must be positive' }, colSpan: 'sm:col-span-1' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 lg:space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        {formFields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={field.colSpan || ''}
          >
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label} {field.required === false && <span className="text-xs text-gray-400">(Optional)</span>}
            </label>
            <input
              id={field.name}
              type={field.type}
              step={field.type === 'number' ? (field.name === 'qtyPerCaseL' ? '0.01' : '1') : undefined}
              placeholder={field.placeholder}
              {...register(field.name, {
                required: field.required,
                min: field.min,
                valueAsNumber: field.type === 'number',
                validate: field.name === 'qtyPerCaseL' ? (value => value === undefined || value === null || String(value).trim() === '' || !isNaN(parseFloat(String(value))) || 'Invalid number') : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
            {errors[field.name] && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-600"
              >
                {errors[field.name]?.message}
              </motion.p>
            )}
          </motion.div>
        ))}
        {/* Removed conditional rendering for QtyPerCaseL */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: formFields.length * 0.05 }} // Adjusted delay index
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm"
        >
          {isSubmitting ? 'Saving...' : sparePart ? 'Update Spare Part' : 'Add Spare Part'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors touch-manipulation text-sm"
        >
          Cancel
        </button>
      </motion.div>
    </motion.form>
  );
};

export default SparePartForm;

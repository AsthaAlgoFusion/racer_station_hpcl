import React, { useState, useEffect, useRef } from 'react';
import { Package, Search, Plus, Edit2, Trash2, UploadCloud, Download, Sheet, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { productAPI } from '@/services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import ProductForm from '@/components/Forms/ProductForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import Tooltip from '../ui/Tooltip2';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setIsDownloadDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.apiSpec.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      if (editingProduct) {
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...editingProduct, ...data } 
            : p
        ));
      } else {
        const newProduct: Product = {
          id: (products.length > 0 ? Math.max(...products.map(p => p.id)) : 0) + 1,
          createdAt: new Date().toISOString(),
          name: '',
          description: '',
          brandName: '',
          apiSpec: '',
          packSize: '',
          uom: '',
          unitsPerCase: 1,
          ...data, 
        } as Product;
        setProducts(prev => [newProduct, ...prev]);
      }
      
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); 
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (format: 'excel' | 'pdf') => {
    alert(`Simulating download of ${filteredProducts.length} products as ${format.toUpperCase()}... Check console for data.`);
    console.log(`Data for ${format.toUpperCase()} download:`, filteredProducts);
    setIsDownloadDropdownOpen(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderTooltipText = (text: string | number | undefined) => {
    if (text === undefined || text === null) return '';
    const strText = String(text);
    return strText.length > 15 ? (
      <span title={strText} className="truncate cursor-default">{strText.substring(0,15)}...</span>
    ) : strText;
  }
  
  const renderQtyPerCaseL = (qty?: number) => {
    return qty !== undefined ? `${qty.toFixed(1)}L` : '-';
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
            <Package className="mr-2 lg:mr-3 flex-shrink-0" size={24} />
            <span className="truncate">Products</span>
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3">
          <div className="relative" ref={downloadDropdownRef}>
            <Tooltip text="Download Data" position="bottom" color="slate">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                className="bg-slate-500 text-white p-2.5 rounded-lg hover:bg-slate-600 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors flex items-center justify-center touch-manipulation text-sm w-full xs:w-auto"
                aria-label="Download Data"
              >
                <Download size={18} />
              </motion.button>
            </Tooltip>
            <AnimatePresence>
              {isDownloadDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200"
                >
                  <ul className="py-1">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleDownload('excel')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Sheet size={16} className="text-green-500" />
                        <span>Download as Excel</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleDownload('pdf')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FileText size={16} className="text-red-500" />
                        <span>Download as PDF</span>
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Tooltip text="Upload Products" position="bottom" color="indigo">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenUploadModal}
              className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center touch-manipulation text-sm w-full xs:w-auto"
              aria-label="Upload Products"
            >
              <UploadCloud size={18} />
            </motion.button>
          </Tooltip>
          <Tooltip text="Add Product" position="bottom" color="blue">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddProduct}
              className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center touch-manipulation text-sm w-full xs:w-auto"
              aria-label="Add Product"
            >
              <Plus size={18} />
            </motion.button>
          </Tooltip>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products by name, brand, API spec..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Mobile Card Layout */}
        <div className="block lg:hidden">
          <AnimatePresence>
            {filteredProducts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{product.brandName}</p>
                      </div>
                      <div className="flex items-center space-x-0.5 ml-2"> {/* Reduced space for tighter buttons */}
                          <Tooltip text="Edit Product" position="top" color="blue">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEditProduct(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" aria-label="Edit Product"> <Edit2 size={14} /> </motion.button>
                          </Tooltip>
                          <Tooltip text="Delete Product" position="top" color="red">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteProduct(product)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" aria-label="Delete Product"> <Trash2 size={14} /> </motion.button>
                          </Tooltip>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div><span className="text-gray-500">API Spec:</span> <p className="font-medium text-gray-800 truncate">{product.apiSpec}</p></div>
                      <div><span className="text-gray-500">Pack Size:</span> <p className="font-medium text-gray-800 truncate">{product.packSize}</p></div>
                      <div><span className="text-gray-500">UOM:</span> <p className="font-medium text-gray-800 truncate">{product.uom}</p></div>
                      <div><span className="text-gray-500">Units/Case:</span> <p className="font-medium text-gray-800">{product.unitsPerCase}</p></div>
                      <div><span className="text-gray-500">Qty/Case (L):</span> <p className="font-medium text-gray-800">{renderQtyPerCaseL(product.qtyPerCaseL)}</p></div>
                    </div>
                     <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider">Product Info</th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider">API Spec</th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider">Pack Size</th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider">UOM</th>
                <th className="px-3 py-2.5 text-center font-medium text-gray-500 uppercase tracking-wider">Units/Case</th>
                <th className="px-3 py-2.5 text-center font-medium text-gray-500 uppercase tracking-wider">Qty/Case (L)</th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50">
                    <td className="px-3 py-3 max-w-[180px]">
                      <div className="font-medium text-gray-900 truncate" title={product.name}>{product.name}</div>
                      <div className="text-gray-500 truncate" title={product.description}>{product.description}</div>
                    </td>
                    <td className="px-3 py-3 max-w-[100px] text-gray-800">{renderTooltipText(product.brandName)}</td>
                    <td className="px-3 py-3 max-w-[90px] text-gray-800">{renderTooltipText(product.apiSpec)}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-800">{product.packSize}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-800">{product.uom}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-800 text-center">{product.unitsPerCase}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-800 text-center">{renderQtyPerCaseL(product.qtyPerCaseL)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex space-x-0.5"> {/* Reduced space for tighter buttons */}
                        <Tooltip text="Edit Product" position="top" color="blue">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEditProduct(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" aria-label="Edit Product"> <Edit2 size={14} /> </motion.button>
                        </Tooltip>
                        <Tooltip text="Delete Product" position="top" color="red">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteProduct(product)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md" aria-label="Delete Product"> <Trash2 size={14} /> </motion.button>
                        </Tooltip>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs lg:text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </motion.div>

      <Modal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingProduct(null); }} title={editingProduct ? 'Edit Product' : 'Add New Product'} size="lg">
        <ProductForm product={editingProduct || undefined} onSubmit={handleFormSubmit} onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }} isSubmitting={isSubmitting} />
      </Modal>

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Products via File" size="md">
        <div className="text-center p-4">
          <UploadCloud size={48} className="mx-auto text-indigo-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Bulk Product Upload</h3>
          <p className="text-gray-600 mb-3"> This feature allows for uploading multiple products at once using a CSV or Excel file. </p>
          <p className="text-sm text-gray-500 mb-6"> Currently, this functionality is a placeholder. For now, please use the "Add Product" button for manual entry. </p>
          <button type="button" onClick={() => setIsUploadModalOpen(false)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 touch-manipulation"> Got it </button>
        </div>
      </Modal>

      <ConfirmDialog isOpen={isDeleteDialogOpen} title="Delete Product" message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`} onConfirm={handleConfirmDelete} onCancel={() => { setIsDeleteDialogOpen(false); setDeletingProduct(null); }} isLoading={isSubmitting} />
    </div>
  );
};

export default Products;

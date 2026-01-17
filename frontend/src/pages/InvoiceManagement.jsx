import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Plus, Search, Filter, Eye, Download, 
  Trash2, Edit, Printer, CheckCircle, Clock, AlertCircle, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import Swal from 'sweetalert2';
import { invoicesAPI, projectsAPI } from '../utils/api';
import { Pagination, ExportButton } from '../utils/tableUtils.jsx';
import InvoiceView from '../components/InvoiceView';

const InvoiceManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [modalType, setModalType] = useState('create'); // create or edit
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    project: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    dueDate: '',
    notes: '',
    status: 'Draft',
    taxRate: 0
  });

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: viewInvoice ? `Invoice-${viewInvoice.invoiceNumber}` : 'Invoice',
  });



  const fetchInvoices = React.useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(activeTab !== 'all' && { status: activeTab })
      };
      
      const response = await invoicesAPI.getAll(params);
      if (response.success) {
        setInvoices(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch invoices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm]);

  const fetchProjects = React.useCallback(async () => {
    try {
      const response = await projectsAPI.getAll();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
    fetchProjects();
  }, [fetchInvoices, fetchProjects]);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Auto calculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = parseFloat(field === 'quantity' ? value : newItems[index].quantity) || 0;
      const price = parseFloat(field === 'unitPrice' ? value : newItems[index].unitPrice) || 0;
      newItems[index].amount = qty * price;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = (subtotal * (formData.taxRate || 0)) / 100;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { total, subtotal, tax } = calculateTotal();
      const payload = {
        ...formData,
        total,
        subtotal,
        taxAmount: tax
      };

      if (modalType === 'create') {
        await invoicesAPI.create(payload);
        toast.success('Invoice created successfully');
      } else {
        await invoicesAPI.update(viewInvoice._id, payload);
        toast.success('Invoice updated successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchInvoices();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      project: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
      dueDate: '',
      notes: '',
      status: 'Draft',
      taxRate: 0
    });
    setViewInvoice(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Invoice?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await invoicesAPI.delete(id);
        toast.success('Invoice deleted');
        fetchInvoices();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete invoice');
      }
    }
  };

  const openViewModal = (invoice) => {
    setViewInvoice(invoice);
    // Directly open custom view modal logic or reuse showViewModal state if separate
    // For simplicity, reusing a state or component
    // We'll create a full screen or large modal for viewing
  };

  const tabs = [
    { key: 'all', label: 'All Invoices' },
    { key: 'Paid', label: 'Paid' },
    { key: 'Sent', label: 'Sent' },
    { key: 'Draft', label: 'Draft' },
    { key: 'Overdue', label: 'Overdue' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-2">Create and manage invoices</p>
        </div>
        <button
          onClick={() => {
            setModalType('create');
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-3"
        >
          <Plus className="w-5 h-5" />
          <span>create Invoice</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter(i => i.status === 'Paid').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                {invoices.filter(i => ['Sent', 'Draft'].includes(i.status)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {invoices.filter(i => i.status === 'Overdue').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-red-600 to-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <ExportButton data={invoices} filename="invoices" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Invoice #</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Client</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Project</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8">No invoices found.</td></tr>
              ) : (
                invoices.map(invoice => (
                  <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-red-600">#{invoice.invoiceNumber}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{invoice.customerName}</p>
                      <p className="text-xs text-gray-500">{invoice.customerPhone}</p>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{invoice.project?.name || 'N/A'}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">₹{invoice.total.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                         invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                         invoice.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                         invoice.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                         'bg-gray-100 text-gray-600'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openViewModal(invoice)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setModalType('edit');
                            setFormData(invoice);
                            setViewInvoice(invoice); // Keep reference
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(invoice._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination 
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={(page) => fetchInvoices(page)}
            totalItems={pagination.total}
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{modalType === 'create' ? 'Create New Invoice' : 'Edit Invoice'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="input-field w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" required value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="input-field w-full border rounded-lg p-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="input-field w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select required value={formData.project?._id || formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="input-field w-full border rounded-lg p-2">
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" required value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="input-field w-full border rounded-lg p-2" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-field w-full border rounded-lg p-2">
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                   <input type="number" min="0" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value)})} className="input-field w-full border rounded-lg p-2" />
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Invoice Items</h3>
                  <button type="button" onClick={handleAddItem} className="text-sm text-red-600 font-medium hover:underline">+ Add Item</button>
                </div>
                {formData.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <label className="text-xs text-gray-500">Description</label>
                      <input type="text" required value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500">Qty</label>
                      <input type="number" min="1" required value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div className="col-span-3">
                       <label className="text-xs text-gray-500">Price</label>
                       <input type="number" min="0" required value={item.unitPrice} onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div className="col-span-1 text-center pb-2 font-bold text-gray-700">
                      {(item.quantity * item.unitPrice).toLocaleString()}
                    </div>
                    <div className="col-span-1 pb-2">
                      {formData.items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-right pt-4 border-t border-gray-200">
                  <p className="text-lg font-bold">Total: ₹{calculateTotal().total.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2 rounded-lg">
                  {modalType === 'create' ? 'Create Invoice' : 'Update Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Print Modal */}
      {viewInvoice && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h2 className="font-bold text-lg">Invoice Preview</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="btn-primary flex items-center gap-2 px-3 py-1 text-sm">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={() => setViewInvoice(null)} className="p-2 hover:bg-gray-200 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-8">
              <InvoiceView ref={printRef} invoice={viewInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;

import React, { useState } from 'react';
import { DollarSign, Plus, Eye, Calendar, User, Building, Search, CheckCircle, Clock, MoreVertical, Filter, Edit, Trash2, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { Pagination, ExportButton, usePagination } from '../utils/tableUtils.jsx';
import Swal from 'sweetalert2';

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPayment, setViewPayment] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [formData, setFormData] = useState({
    clientName: '',
    project: '',
    amount: '',
    type: '',
    paymentDate: '',
    dueDate: '',
    paymentMethod: '',
    status: 'Pending',
    transactionId: ''
  });

  const [payments, setPayments] = useState([
    { id: 1, clientName: 'John Doe', project: 'SP Heights', amount: 500000, type: 'Token Amount', status: 'Received', date: '2025-01-02', dueDate: '2025-01-02', paymentMethod: 'Bank Transfer', transactionId: 'TXN123456789' },
    { id: 2, clientName: 'Jane Smith', project: 'SP Gardens', amount: 1200000, type: 'Booking Amount', status: 'Pending', date: '2025-01-01', dueDate: '2025-01-05', paymentMethod: 'Cheque', transactionId: '' },
    { id: 3, clientName: 'Mike Johnson', project: 'SP Plaza', amount: 2500000, type: 'Final Payment', status: 'Received', date: '2024-12-30', dueDate: '2024-12-30', paymentMethod: 'RTGS', transactionId: 'TXN987654321' },
    { id: 4, clientName: 'Sarah Wilson', project: 'SP Heights', amount: 800000, type: 'Installment', status: 'Pending', date: '2025-01-03', dueDate: '2025-01-10', paymentMethod: 'Bank Transfer', transactionId: '' },
    { id: 5, clientName: 'David Brown', project: 'SP Gardens', amount: 600000, type: 'Token Amount', status: 'Received', date: '2025-01-04', dueDate: '2025-01-04', paymentMethod: 'RTGS', transactionId: 'TXN456789123' },
    { id: 6, clientName: 'Lisa Davis', project: 'SP Plaza', amount: 1500000, type: 'Booking Amount', status: 'Pending', date: '2025-01-05', dueDate: '2025-01-08', paymentMethod: 'Bank Transfer', transactionId: '' },
    { id: 7, clientName: 'Robert Miller', project: 'SP Heights', amount: 900000, type: 'Installment', status: 'Received', date: '2025-01-06', dueDate: '2025-01-06', paymentMethod: 'Cheque', transactionId: 'TXN789123456' },
    { id: 8, clientName: 'Emily Wilson', project: 'SP Gardens', amount: 3000000, type: 'Final Payment', status: 'Received', date: '2025-01-07', dueDate: '2025-01-07', paymentMethod: 'RTGS', transactionId: 'TXN321654987' },
    { id: 9, clientName: 'James Taylor', project: 'SP Plaza', amount: 700000, type: 'Token Amount', status: 'Pending', date: '2025-01-08', dueDate: '2025-01-12', paymentMethod: 'Bank Transfer', transactionId: '' },
    { id: 10, clientName: 'Maria Garcia', project: 'SP Heights', amount: 1100000, type: 'Booking Amount', status: 'Received', date: '2025-01-09', dueDate: '2025-01-09', paymentMethod: 'RTGS', transactionId: 'TXN654987321' },
    { id: 11, clientName: 'William Anderson', project: 'SP Gardens', amount: 850000, type: 'Installment', status: 'Pending', date: '2025-01-10', dueDate: '2025-01-15', paymentMethod: 'Cheque', transactionId: '' },
    { id: 12, clientName: 'Jennifer Martinez', project: 'SP Plaza', amount: 950000, type: 'Token Amount', status: 'Received', date: '2025-01-11', dueDate: '2025-01-11', paymentMethod: 'Bank Transfer', transactionId: 'TXN987321654' }
  ]);

  const tabs = [
    { key: 'all', label: 'All Payments', count: payments.length },
    { key: 'Received', label: 'Received', count: payments.filter(p => p.status === 'Received').length },
    { key: 'Pending', label: 'Pending', count: payments.filter(p => p.status === 'Pending').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'green';
      case 'Pending': return 'yellow';
      case 'Overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Received': return <CheckCircle size={16} />;
      case 'Pending': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    const matchesSearch = payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const { currentPage, totalPages, currentData, goToPage, totalItems } = usePagination(filteredPayments, 10);

  const totalReceived = payments.filter(p => p.status === 'Received').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

  const handleViewPayment = (payment) => {
    setViewPayment(payment);
    setShowViewModal(true);
  };

  const handleEditPayment = (payment) => {
    setModalType('edit');
    setSelectedPayment(payment);
    setFormData({
      clientName: payment.clientName,
      project: payment.project,
      amount: payment.amount.toString(),
      type: payment.type,
      paymentDate: payment.date,
      dueDate: payment.dueDate,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      transactionId: payment.transactionId || ''
    });
    setShowModal(true);
  };

  const handleAddPayment = () => {
    setModalType('add');
    setFormData({
      clientName: '',
      project: '',
      amount: '',
      type: '',
      paymentDate: '',
      dueDate: '',
      paymentMethod: '',
      status: 'Pending',
      transactionId: ''
    });
    setShowModal(true);
  };

  const handleDeletePayment = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Payment?',
      text: 'Are you sure you want to delete this payment record? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setPayments(payments.filter(p => p.id !== id));
      toast.success('Payment deleted successfully!');
    }
    setDropdownOpen(null);
  };

  const handleMarkReceived = async (payment) => {
    const result = await Swal.fire({
      title: 'Mark as Received?',
      text: `Mark payment of ₹${payment.amount.toLocaleString()} from ${payment.clientName} as received?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, mark received!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setPayments(payments.map(p => 
        p.id === payment.id 
          ? { ...p, status: 'Received', transactionId: `TXN${Date.now()}` }
          : p
      ));
      toast.success('Payment marked as received!');
    }
    setDropdownOpen(null);
  };

  const toggleDropdown = (paymentId) => {
    setDropdownOpen(dropdownOpen === paymentId ? null : paymentId);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newPayment = {
        ...formData,
        id: Date.now(),
        amount: parseInt(formData.amount),
        date: formData.paymentDate
      };
      setPayments([...payments, newPayment]);
      toast.success(`Payment record for ${formData.clientName} has been added.`);
    } else {
      setPayments(payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, ...formData, amount: parseInt(formData.amount), date: formData.paymentDate }
          : p
      ));
      toast.success(`Payment record for ${formData.clientName} has been updated.`);
    }
    
    setFormData({
      clientName: '',
      project: '',
      amount: '',
      type: '',
      paymentDate: '',
      dueDate: '',
      paymentMethod: '',
      status: 'Pending',
      transactionId: ''
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Track and manage all payments</p>
        </div>
        <button
          onClick={handleAddPayment}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add Payment</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Received</p>
              <p className="text-2xl font-bold text-green-600">₹{(totalReceived / 100000).toFixed(1)}L</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-yellow-600">₹{(totalPending / 100000).toFixed(1)}L</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-purple-600">₹{((totalReceived + totalPending) / 100000).toFixed(1)}L</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-red-600 to-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-2">
            <ExportButton 
              data={filteredPayments} 
              filename="payments" 
              headers={['Client Name', 'Project', 'Amount', 'Type', 'Status', 'Payment Method', 'Date', 'Due Date', 'Transaction ID']}
            />
            <button className="btn-primary flex items-center space-x-2 px-4 py-3">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Client & Project</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Amount & Type</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Payment Details</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Dates</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{payment.clientName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payment.clientName}</p>
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{payment.project}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div>
                      <p className="font-bold text-gray-900">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{payment.type}</p>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div>
                      <p className="text-sm text-gray-900">{payment.paymentMethod}</p>
                      {payment.transactionId && (
                        <p className="text-xs text-gray-500">ID: {payment.transactionId}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Paid: {payment.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Due: {payment.dueDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      {payment.status === 'Received' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-yellow-500" />}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewPayment(payment)}
                        className="btn-primary p-2 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'Pending' && (
                        <button 
                          onClick={() => handleEditPayment(payment)}
                          className="btn-primary px-3 py-2 rounded-lg text-xs"
                        >
                          Edit
                        </button>
                      )}
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(payment.id)}
                          className="btn-primary p-2 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {dropdownOpen === payment.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleViewPayment(payment);
                                  setDropdownOpen(null);
                                }}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              
                              {payment.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      handleEditPayment(payment);
                                      setDropdownOpen(null);
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Payment</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleMarkReceived(payment)}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                  >
                                    <Check className="w-4 h-4" />
                                    <span>Mark as Received</span>
                                  </button>
                                </>
                              )}
                              
                              <hr className="my-1" />
                              
                              <button
                                onClick={() => handleDeletePayment(payment.id)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Payment</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            itemsPerPage={10}
            totalItems={totalItems}
          />
        )}

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first payment record</p>
            <button onClick={handleAddPayment} className="btn-primary">
              Add Payment
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalType === 'add' ? 'Add Payment Record' : 'Edit Payment Record'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Project</option>
                      <option value="SP Heights">SP Heights</option>
                      <option value="SP Gardens">SP Gardens</option>
                      <option value="SP Plaza">SP Plaza</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Token Amount">Token Amount</option>
                      <option value="Booking Amount">Booking Amount</option>
                      <option value="Installment">Installment</option>
                      <option value="Final Payment">Final Payment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="RTGS">RTGS</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID (Optional)</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Enter transaction ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {modalType === 'add' ? 'Add Payment' : 'Update Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Payment Modal */}
      {showViewModal && viewPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Payment Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{viewPayment.clientName.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewPayment.clientName}</h3>
                    <p className="text-gray-600">Payment ID: #{viewPayment.id}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        viewPayment.status === 'Received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {viewPayment.status}
                      </span>
                      <span className="text-xs text-gray-500">{viewPayment.type}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="bg-green-50 p-6 rounded-xl text-center">
                  <p className="text-3xl font-bold text-green-600">₹{viewPayment.amount.toLocaleString()}</p>
                  <p className="text-gray-600 mt-1">{viewPayment.type}</p>
                </div>

                {/* Payment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Project Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Project</p>
                          <p className="font-medium">{viewPayment.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="font-medium">{viewPayment.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Payment Date</p>
                          <p className="font-medium">{viewPayment.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Due Date</p>
                          <p className="font-medium">{viewPayment.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                {viewPayment.transactionId && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Transaction Details</h4>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Transaction ID</p>
                      <p className="font-mono font-medium text-gray-900">{viewPayment.transactionId}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t">
                  {viewPayment.status === 'Pending' && (
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditPayment(viewPayment);
                      }}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Payment</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setDropdownOpen(null)}
        ></div>
      )}
    </div>
  );
};

export default PaymentManagement;
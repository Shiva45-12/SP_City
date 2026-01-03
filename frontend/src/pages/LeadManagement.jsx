import React, { useState } from 'react';
import { Users, Plus, Eye, Phone, Mail, MapPin, Calendar, Filter, Search, MoreVertical, Edit, Trash2, Shield, UserCheck, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { Pagination, ExportButton, usePagination } from '../utils/tableUtils.jsx';
import Swal from 'sweetalert2';

const LeadManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewLead, setViewLead] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: '',
    status: 'Pending',
    source: '',
    budget: '',
    notes: ''
  });

  const [leads, setLeads] = useState([
    { id: 1, name: 'John Doe', phone: '+91 9876543210', email: 'john@email.com', project: 'SP Heights', status: 'Visit', date: '2025-01-02', source: 'Website', budget: '50L', addedBy: 'Admin', addedByName: 'Admin User' },
    { id: 2, name: 'Jane Smith', phone: '+91 9876543211', email: 'jane@email.com', project: 'SP Gardens', status: 'Pending', date: '2025-01-01', source: 'Referral', budget: '75L', addedBy: 'Associate', addedByName: 'John Associate' },
    { id: 3, name: 'Mike Johnson', phone: '+91 9876543212', email: 'mike@email.com', project: 'SP Plaza', status: 'Deal Done', date: '2024-12-30', source: 'Social Media', budget: '1Cr', addedBy: 'Admin', addedByName: 'Admin User' },
    { id: 4, name: 'Sarah Wilson', phone: '+91 9876543213', email: 'sarah@email.com', project: 'SP Heights', status: 'Show', date: '2025-01-02', source: 'Walk-in', budget: '60L', addedBy: 'Associate', addedByName: 'Mike Associate' },
    { id: 5, name: 'David Brown', phone: '+91 9876543214', email: 'david@email.com', project: 'SP Gardens', status: 'Visit', date: '2025-01-03', source: 'Website', budget: '80L', addedBy: 'Admin', addedByName: 'Admin User' },
    { id: 6, name: 'Lisa Davis', phone: '+91 9876543215', email: 'lisa@email.com', project: 'SP Plaza', status: 'Pending', date: '2025-01-03', source: 'Referral', budget: '65L', addedBy: 'Associate', addedByName: 'John Associate' },
    { id: 7, name: 'Robert Miller', phone: '+91 9876543216', email: 'robert@email.com', project: 'SP Heights', status: 'Show', date: '2025-01-04', source: 'Social Media', budget: '90L', addedBy: 'Admin', addedByName: 'Admin User' },
    { id: 8, name: 'Emily Wilson', phone: '+91 9876543217', email: 'emily@email.com', project: 'SP Gardens', status: 'Deal Done', date: '2025-01-04', source: 'Walk-in', budget: '1.2Cr', addedBy: 'Associate', addedByName: 'Mike Associate' },
    { id: 9, name: 'James Taylor', phone: '+91 9876543218', email: 'james@email.com', project: 'SP Plaza', status: 'Visit', date: '2025-01-05', source: 'Website', budget: '70L', addedBy: 'Admin', addedByName: 'Admin User' },
    { id: 10, name: 'Maria Garcia', phone: '+91 9876543219', email: 'maria@email.com', project: 'SP Heights', status: 'Pending', date: '2025-01-05', source: 'Referral', budget: '55L', addedBy: 'Associate', addedByName: 'John Associate' },
    { id: 11, name: 'William Anderson', phone: '+91 9876543220', email: 'william@email.com', project: 'SP Gardens', status: 'Show', date: '2025-01-06', source: 'Social Media', budget: '85L', addedBy: 'Admin', addedByName: 'Admin User' },
    { id: 12, name: 'Jennifer Martinez', phone: '+91 9876543221', email: 'jennifer@email.com', project: 'SP Plaza', status: 'Deal Done', date: '2025-01-06', source: 'Walk-in', budget: '95L', addedBy: 'Associate', addedByName: 'Mike Associate' }
  ]);

  const tabs = [
    { key: 'all', label: 'All Leads', count: leads.length },
    { key: 'Show', label: 'Show', count: leads.filter(l => l.status === 'Show').length },
    { key: 'Visit', label: 'Visit', count: leads.filter(l => l.status === 'Visit').length },
    { key: 'Pending', label: 'Pending', count: leads.filter(l => l.status === 'Pending').length },
    { key: 'Deal Done', label: 'Deal Done', count: leads.filter(l => l.status === 'Deal Done').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Show': return 'bg-purple-100 text-purple-800';
      case 'Visit': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Deal Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesTab = activeTab === 'all' || lead.status === activeTab;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         lead.project.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const { currentPage, totalPages, currentData, goToPage, totalItems } = usePagination(filteredLeads, 10);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddLead = () => {
    setModalType('add');
    setFormData({
      name: '',
      phone: '',
      email: '',
      project: '',
      status: 'Pending',
      source: '',
      budget: '',
      notes: ''
    });
    setShowModal(true);
  };

  const handleViewLead = (lead) => {
    setViewLead(lead);
    setShowViewModal(true);
  };

  const handleEditLead = (lead) => {
    setModalType('edit');
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      project: lead.project,
      status: lead.status,
      source: lead.source,
      budget: lead.budget,
      notes: lead.notes || ''
    });
    setShowModal(true);
  };

  const handleDeleteLead = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Lead?',
      text: 'Are you sure you want to delete this lead? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setLeads(leads.filter(l => l.id !== id));
      toast.success('Lead deleted successfully!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newLead = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        addedBy: 'Admin',
        addedByName: 'Admin User'
      };
      setLeads([...leads, newLead]);
      toast.success('Lead added successfully!');
    } else {
      setLeads(leads.map(l => 
        l.id === selectedLead.id ? { ...l, ...formData } : l
      ));
      toast.success('Lead updated successfully!');
    }

    setShowModal(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      project: '',
      status: 'Pending',
      source: '',
      budget: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all your leads</p>
        </div>
        <button
          onClick={handleAddLead}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add New Lead</span>
          <span className="sm:hidden">Add Lead</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={` px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-red-600 to-black text-white text-white'
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
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-2">
            <ExportButton 
              data={filteredLeads} 
              filename="leads" 
              headers={['Name', 'Phone', 'Email', 'Project', 'Status', 'Budget', 'Source', 'Added By', 'Date']}
            />
            <button className="btn-primary flex items-center space-x-2 px-4 py-3">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Lead Details</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Contact</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Project</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Budget</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Added By</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-600">Source: {lead.source}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{lead.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{lead.project}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-bold text-green-600">₹{lead.budget}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        lead.addedBy === 'Admin' 
                          ? 'bg-gradient-to-r from-red-600 to-black' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}>
                        {lead.addedBy === 'Admin' ? (
                          <Shield className="w-4 h-4 text-white" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.addedBy}</p>
                        <p className="text-xs text-gray-500">{lead.addedByName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{lead.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewLead(lead)}
                        className="btn-primary p-2 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditLead(lead)}
                        className="btn-primary p-2 rounded-lg"
                        title="Edit Lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLead(lead.id)}
                        className="btn-primary p-2 rounded-lg"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first lead</p>
            <button onClick={handleAddLead} className="btn-primary">
              Add Lead
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalType === 'add' ? 'Add New Lead' : 'Edit Lead'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Interest *</label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="e.g., 50L - 1Cr"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Source</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Advertisement">Advertisement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Show">Show</option>
                    <option value="Visit">Visit</option>
                    <option value="Deal Done">Deal Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Additional notes about the lead..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    {modalType === 'add' ? 'Add Lead' : 'Update Lead'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {showViewModal && viewLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Lead Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{viewLead.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewLead.name}</h3>
                    <p className="text-gray-600">Lead ID: #{viewLead.id}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        viewLead.status === 'Deal Done' ? 'bg-green-100 text-green-800' :
                        viewLead.status === 'Visit' ? 'bg-blue-100 text-blue-800' :
                        viewLead.status === 'Show' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {viewLead.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          viewLead.addedBy === 'Admin' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">Added by {viewLead.addedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{viewLead.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{viewLead.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Project Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Project</p>
                          <p className="font-medium">{viewLead.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-medium text-green-600">₹{viewLead.budget}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date Added</p>
                        <p className="font-medium">{viewLead.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Search className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Source</p>
                        <p className="font-medium">{viewLead.source}</p>
                      </div>
                    </div>
                  </div>
                  {viewLead.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Notes</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{viewLead.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditLead(viewLead);
                    }}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Lead</span>
                  </button>
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
    </div>
  );
};

export default LeadManagement;
import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Eye, Phone, Mail, Calendar, Search, Key, Shield, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { Pagination, ExportButton, usePagination } from '../utils/tableUtils.jsx';
import Swal from 'sweetalert2';

const AssociateManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState('add');
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAssociate, setViewAssociate] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    permissions: []
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    associateId: null,
    newPassword: '',
    confirmPassword: ''
  });

  const [associates, setAssociates] = useState([
    { id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', email: 'rajesh@spcity.com', role: 'Sales Manager', joinDate: '2024-01-15', leads: 45, deals: 12, status: 'Active', department: 'Sales', permissions: ['leads', 'projects', 'reports'], createdBy: 'Admin' },
    { id: 2, name: 'Priya Sharma', phone: '+91 9876543211', email: 'priya@spcity.com', role: 'Sales Executive', joinDate: '2024-03-20', leads: 32, deals: 8, status: 'Active', department: 'Sales', permissions: ['leads'], createdBy: 'Admin' },
    { id: 3, name: 'Amit Singh', phone: '+91 9876543212', email: 'amit@spcity.com', role: 'Team Lead', joinDate: '2023-11-10', leads: 67, deals: 18, status: 'Active', department: 'Sales', permissions: ['leads', 'projects'], createdBy: 'Admin' },
    { id: 4, name: 'Neha Gupta', phone: '+91 9876543213', email: 'neha@spcity.com', role: 'Sales Executive', joinDate: '2024-02-10', leads: 28, deals: 6, status: 'Active', department: 'Sales', permissions: ['leads'], createdBy: 'Admin' },
    { id: 5, name: 'Vikram Patel', phone: '+91 9876543214', email: 'vikram@spcity.com', role: 'Sales Manager', joinDate: '2023-12-05', leads: 52, deals: 15, status: 'Active', department: 'Sales', permissions: ['leads', 'projects', 'reports'], createdBy: 'Admin' },
    { id: 6, name: 'Anita Rao', phone: '+91 9876543215', email: 'anita@spcity.com', role: 'Team Lead', joinDate: '2024-01-25', leads: 41, deals: 11, status: 'Active', department: 'Sales', permissions: ['leads', 'projects'], createdBy: 'Admin' },
    { id: 7, name: 'Suresh Reddy', phone: '+91 9876543216', email: 'suresh@spcity.com', role: 'Sales Executive', joinDate: '2024-04-12', leads: 19, deals: 4, status: 'Active', department: 'Sales', permissions: ['leads'], createdBy: 'Admin' },
    { id: 8, name: 'Kavita Joshi', phone: '+91 9876543217', email: 'kavita@spcity.com', role: 'Sales Manager', joinDate: '2023-10-18', leads: 63, deals: 20, status: 'Active', department: 'Sales', permissions: ['leads', 'projects', 'reports'], createdBy: 'Admin' },
    { id: 9, name: 'Ravi Kumar', phone: '+91 9876543218', email: 'ravi@spcity.com', role: 'Sales Executive', joinDate: '2024-03-08', leads: 35, deals: 9, status: 'Active', department: 'Sales', permissions: ['leads'], createdBy: 'Admin' },
    { id: 10, name: 'Deepika Singh', phone: '+91 9876543219', email: 'deepika@spcity.com', role: 'Team Lead', joinDate: '2024-01-30', leads: 48, deals: 13, status: 'Active', department: 'Sales', permissions: ['leads', 'projects'], createdBy: 'Admin' },
    { id: 11, name: 'Manoj Verma', phone: '+91 9876543220', email: 'manoj@spcity.com', role: 'Sales Executive', joinDate: '2024-05-15', leads: 22, deals: 5, status: 'Active', department: 'Sales', permissions: ['leads'], createdBy: 'Admin' },
    { id: 12, name: 'Sunita Agarwal', phone: '+91 9876543221', email: 'sunita@spcity.com', role: 'Sales Manager', joinDate: '2023-09-22', leads: 58, deals: 17, status: 'Active', department: 'Sales', permissions: ['leads', 'projects', 'reports'], createdBy: 'Admin' }
  ]);

  const rolePermissions = {
    'Sales Executive': ['leads'],
    'Team Lead': ['leads', 'projects'],
    'Sales Manager': ['leads', 'projects', 'reports']
  };

  const permissionLabels = {
    'leads': 'Lead Management',
    'projects': 'Project Management', 
    'reports': 'Reports & Analytics'
  };

  const filteredAssociates = associates.filter(associate =>
    associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    associate.phone.includes(searchTerm) ||
    associate.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { currentPage, totalPages, currentData, goToPage, totalItems } = usePagination(filteredAssociates, 10);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAssociate = () => {
    setModalType('add');
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: '',
      permissions: []
    });
    setShowModal(true);
  };

  const handleViewAssociate = (associate) => {
    setViewAssociate(associate);
    setShowViewModal(true);
  };

  const handleEditAssociate = (associate) => {
    setModalType('edit');
    setSelectedAssociate(associate);
    setFormData({
      name: associate.name,
      phone: associate.phone,
      email: associate.email,
      password: '',
      confirmPassword: '',
      role: associate.role,
      department: associate.department,
      permissions: associate.permissions || []
    });
    setShowModal(true);
  };

  const handleChangePassword = (associate) => {
    setPasswordData({
      associateId: associate.id,
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    const result = await Swal.fire({
      title: 'Change Password?',
      text: 'Are you sure you want to change this associate\'s password?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Here you would typically make an API call to update password
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ associateId: null, newPassword: '', confirmPassword: '' });
    }
  };

  const handleDeleteAssociate = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Associate?',
      text: 'Are you sure you want to delete this associate? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setAssociates(associates.filter(a => a.id !== id));
      toast.success('Associate deleted successfully!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation for add mode
    if (modalType === 'add') {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long!');
        return;
      }
      
      // Check if email already exists
      if (associates.some(a => a.email === formData.email)) {
        toast.error('Email already exists!');
        return;
      }

      const newAssociate = {
        ...formData,
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0],
        leads: 0,
        deals: 0,
        status: 'Active',
        createdBy: 'Admin',
        permissions: formData.permissions
      };
      setAssociates([...associates, newAssociate]);
      
      // Show success with login credentials
      Swal.fire({
        title: 'Associate Added Successfully!',
        html: `
          <div class="text-left">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Password:</strong> ${formData.password}</p>
            <p class="text-sm text-gray-600 mt-2">Please share these credentials with the associate.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#dc2626'
      });
    } else {
      // For edit mode, don't update password unless provided
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      } else if (updateData.password !== updateData.confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      
      setAssociates(associates.map(a => 
        a.id === selectedAssociate.id 
          ? { ...a, ...updateData }
          : a
      ));
      toast.success(`${formData.name} has been updated.`);
    }
    
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: '',
      permissions: []
    });
    setShowModal(false);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    const defaultPermissions = rolePermissions[selectedRole] || [];
    
    setFormData({
      ...formData,
      role: selectedRole,
      permissions: defaultPermissions
    });
  };

  const handlePermissionChange = (permission) => {
    const updatedPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({
      ...formData,
      permissions: updatedPermissions
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Associate Management</h1>
          <p className="text-gray-600 mt-2">Manage your sales team and associates</p>
        </div>
        <button
          onClick={handleAddAssociate}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add Associate</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="card">
        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search associates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <ExportButton 
            data={filteredAssociates} 
            filename="associates" 
            headers={['Name', 'Phone', 'Email', 'Role', 'Department', 'Join Date', 'Leads', 'Deals', 'Status']}
          />
        </div>

        {/* Associates Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Associate</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Contact</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Role</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Performance</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((associate) => (
                <tr key={associate.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{associate.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{associate.name}</p>
                        <p className="text-sm text-gray-600">Joined: {associate.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{associate.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{associate.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-medium">{associate.role}</span>
                    <p className="text-sm text-gray-600">{associate.department}</p>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <p className="font-bold text-blue-600">{associate.leads}</p>
                        <p className="text-xs text-gray-500">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-600">{associate.deals}</p>
                        <p className="text-xs text-gray-500">Deals</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {associate.status}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewAssociate(associate)}
                        className="btn-primary p-2 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditAssociate(associate)}
                        className="btn-primary p-2 rounded-lg"
                        title="Edit Associate"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleChangePassword(associate)}
                        className="btn-primary p-2 rounded-lg"
                        title="Change Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAssociate(associate.id)}
                        className="btn-primary p-2 rounded-lg"
                        title="Delete Associate"
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

        {filteredAssociates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No associates found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first associate</p>
            <button onClick={handleAddAssociate} className="btn-primary">
              Add Associate
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
                  {modalType === 'add' ? 'Add New Associate' : 'Edit Associate'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@spcity.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                {modalType === 'add' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Team Lead">Team Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Sales Department"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(key)}
                          onChange={() => handlePermissionChange(key)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
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
                    {modalType === 'add' ? 'Add Associate' : 'Update Associate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Associate Modal */}
      {showViewModal && viewAssociate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Associate Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Associate Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{viewAssociate.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewAssociate.name}</h3>
                    <p className="text-gray-600">{viewAssociate.role}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {viewAssociate.status}
                      </span>
                      <span className="text-xs text-gray-500">ID: #{viewAssociate.id}</span>
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
                          <p className="font-medium">{viewAssociate.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{viewAssociate.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Work Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Join Date</p>
                          <p className="font-medium">{viewAssociate.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium">{viewAssociate.department}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Permissions & Access</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {viewAssociate.permissions?.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2 p-3 bg-green-50 rounded-xl">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{permissionLabels[permission]}</span>
                      </div>
                    ))}
                  </div>
                  {(!viewAssociate.permissions || viewAssociate.permissions.length === 0) && (
                    <p className="text-gray-500 text-sm">No permissions assigned</p>
                  )}
                </div>

                {/* Performance Stats */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Performance Overview</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-600">{viewAssociate.leads}</p>
                      <p className="text-sm text-gray-600">Total Leads</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-green-600">{viewAssociate.deals}</p>
                      <p className="text-sm text-gray-600">Deals Closed</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <p className="text-lg font-bold text-purple-600">
                      {viewAssociate.leads > 0 ? ((viewAssociate.deals / viewAssociate.leads) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditAssociate(viewAssociate);
                    }}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleChangePassword(viewAssociate);
                    }}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Password</span>
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    minLength={6}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800 font-medium">Security Notice</p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    The associate will need to use the new password for their next login.
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociateManagement;
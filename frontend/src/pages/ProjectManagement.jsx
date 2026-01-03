import React, { useState } from 'react';
import { Building, Plus, Edit, Trash2, Eye, MapPin, Calendar, DollarSign, Users, Search, MoreVertical, Grid, List } from 'lucide-react';
import { toast } from 'react-toastify';
import { Pagination, ExportButton, usePagination } from '../utils/tableUtils.jsx';
import Swal from 'sweetalert2';

const ProjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProject, setViewProject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    totalUnits: '',
    startDate: '',
    endDate: '',
    priceRange: '',
    description: '',
    image: null,
    imagePreview: null
  });

  const [projects, setProjects] = useState([
    { id: 1, name: 'SP Heights', location: 'Sector 15, Gurgaon', type: 'Residential', status: 'Active', startDate: '2024-01-15', endDate: '2025-12-31', totalUnits: 120, soldUnits: 45, priceRange: '₹45L - ₹85L', leads: 67, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop', description: 'Premium residential project with modern amenities' },
    { id: 2, name: 'SP Gardens', location: 'Sector 22, Noida', type: 'Residential', status: 'Active', startDate: '2024-03-20', endDate: '2026-06-30', totalUnits: 200, soldUnits: 78, priceRange: '₹35L - ₹65L', leads: 89, image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop', description: 'Affordable housing with green spaces' },
    { id: 3, name: 'SP Plaza', location: 'MG Road, Delhi', type: 'Commercial', status: 'Completed', startDate: '2023-06-10', endDate: '2024-11-30', totalUnits: 50, soldUnits: 50, priceRange: '₹1.2Cr - ₹3.5Cr', leads: 34, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', description: 'Prime commercial space in business district' },
    { id: 4, name: 'SP Towers', location: 'Cyber City, Gurgaon', type: 'Commercial', status: 'Active', startDate: '2024-02-10', endDate: '2025-08-15', totalUnits: 80, soldUnits: 25, priceRange: '₹80L - ₹2Cr', leads: 45, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop', description: 'Modern office spaces with IT infrastructure' },
    { id: 5, name: 'SP Residency', location: 'Sector 45, Noida', type: 'Residential', status: 'Active', startDate: '2024-04-01', endDate: '2026-03-31', totalUnits: 150, soldUnits: 60, priceRange: '₹55L - ₹95L', leads: 72, image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop', description: 'Luxury apartments with club facilities' },
    { id: 6, name: 'SP Mall', location: 'Connaught Place, Delhi', type: 'Commercial', status: 'On Hold', startDate: '2024-01-20', endDate: '2025-12-20', totalUnits: 100, soldUnits: 15, priceRange: '₹1.5Cr - ₹5Cr', leads: 28, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', description: 'Retail and entertainment complex' },
    { id: 7, name: 'SP Villas', location: 'Golf Course Road, Gurgaon', type: 'Residential', status: 'Active', startDate: '2024-05-15', endDate: '2026-12-31', totalUnits: 40, soldUnits: 12, priceRange: '₹2Cr - ₹5Cr', leads: 35, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop', description: 'Independent villas with private gardens' },
    { id: 8, name: 'SP Tech Park', location: 'Sector 62, Noida', type: 'Commercial', status: 'Active', startDate: '2024-03-01', endDate: '2025-10-31', totalUnits: 60, soldUnits: 22, priceRange: '₹1Cr - ₹3Cr', leads: 41, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', description: 'IT park with modern facilities' },
    { id: 9, name: 'SP Homes', location: 'Sector 18, Gurgaon', type: 'Residential', status: 'Active', startDate: '2024-06-01', endDate: '2026-05-31', totalUnits: 180, soldUnits: 55, priceRange: '₹40L - ₹75L', leads: 68, image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop', description: 'Mid-segment housing with amenities' },
    { id: 10, name: 'SP Square', location: 'Sector 32, Noida', type: 'Mixed Use', status: 'Active', startDate: '2024-07-01', endDate: '2026-06-30', totalUnits: 90, soldUnits: 30, priceRange: '₹60L - ₹1.5Cr', leads: 52, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop', description: 'Mixed-use development with retail and residential' },
    { id: 11, name: 'SP Elite', location: 'DLF Phase 3, Gurgaon', type: 'Residential', status: 'Active', startDate: '2024-08-01', endDate: '2026-07-31', totalUnits: 75, soldUnits: 18, priceRange: '₹1.2Cr - ₹2.5Cr', leads: 38, image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop', description: 'Premium apartments in prime location' },
    { id: 12, name: 'SP Business Hub', location: 'Sector 44, Noida', type: 'Commercial', status: 'Active', startDate: '2024-09-01', endDate: '2025-11-30', totalUnits: 45, soldUnits: 8, priceRange: '₹2Cr - ₹6Cr', leads: 25, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', description: 'Business center with conference facilities' }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { currentPage, totalPages, currentData, goToPage, totalItems } = usePagination(filteredProjects, 10);

  const handleViewProject = (project) => {
    setViewProject(project);
    setShowViewModal(true);
  };

  const handleEditProject = (project) => {
    setModalType('edit');
    setSelectedProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      type: project.type,
      totalUnits: project.totalUnits.toString(),
      startDate: project.startDate,
      endDate: project.endDate,
      priceRange: project.priceRange,
      description: project.description || '',
      image: null,
      imagePreview: project.image
    });
    setShowModal(true);
  };

  const handleAddProject = () => {
    setModalType('add');
    setFormData({
      name: '',
      location: '',
      type: '',
      totalUnits: '',
      startDate: '',
      endDate: '',
      priceRange: '',
      description: '',
      image: null,
      imagePreview: null
    });
    setShowModal(true);
  };

  const handleDeleteProject = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: 'Are you sure you want to delete this project? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add') {
      const newProject = {
        ...formData,
        id: Date.now(),
        totalUnits: parseInt(formData.totalUnits),
        soldUnits: 0,
        leads: 0,
        status: 'Active',
        image: formData.imagePreview
      };
      setProjects([...projects, newProject]);
      toast.success(`${formData.name} has been added to projects.`);
    } else {
      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? { ...p, ...formData, totalUnits: parseInt(formData.totalUnits), image: formData.imagePreview }
          : p
      ));
      toast.success(`${formData.name} has been updated.`);
    }
    
    setFormData({
      name: '',
      location: '',
      type: '',
      totalUnits: '',
      startDate: '',
      endDate: '',
      priceRange: '',
      description: '',
      image: null,
      imagePreview: null
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">Manage all your real estate projects</p>
        </div>
        <button
          onClick={handleAddProject}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="card">
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div className="flex gap-2">
            <ExportButton 
              data={filteredProjects} 
              filename="projects" 
              headers={['Name', 'Location', 'Type', 'Total Units', 'Sold Units', 'Price Range', 'Status', 'Start Date', 'End Date']}
            />
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 flex items-center space-x-2 text-sm ${
                  viewMode === 'cards' 
                    ? 'bg-gradient-to-r from-red-600 to-black text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 flex items-center space-x-2 text-sm border-l border-gray-300 ${
                  viewMode === 'table' 
                    ? 'bg-gradient-to-r from-red-600 to-black text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Cards View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentData.map((project) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-purple-400 overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Building className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{project.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {project.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{project.priceRange}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold">{project.soldUnits}/{project.totalUnits}</p>
                      <p className="text-xs text-gray-600">Units Sold</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(project.soldUnits / project.totalUnits) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold">{project.leads}</p>
                      <p className="text-xs text-gray-600">Active Leads</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{project.startDate} - {project.endDate}</span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => handleViewProject(project)}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2 text-sm py-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button 
                      onClick={() => handleEditProject(project)}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2 text-sm py-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="btn-primary p-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Project</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Location</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Units</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Price Range</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg overflow-hidden">
                          {project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Building className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{project.name}</p>
                          <p className="text-sm text-gray-500">{project.leads} leads</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{project.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.type}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-center">
                        <p className="font-bold">{project.soldUnits}/{project.totalUnits}</p>
                        <p className="text-xs text-gray-500">Sold/Total</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(project.soldUnits / project.totalUnits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-medium">{project.priceRange}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewProject(project)}
                          className="btn-primary p-2 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditProject(project)}
                          className="btn-primary p-2 rounded-lg"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="btn-primary p-2 rounded-lg"
                          title="Delete Project"
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
        )}

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

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first project</p>
            <button onClick={handleAddProject} className="btn-primary">
              Add Project
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalType === 'add' ? 'Add New Project' : 'Edit Project'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Mixed Use">Mixed Use</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Units *</label>
                    <input
                      type="number"
                      name="totalUnits"
                      value={formData.totalUnits}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <input
                    type="text"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹45L - ₹85L"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {formData.imagePreview && (
                      <div className="w-full max-w-xs">
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter project description"
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
                    {modalType === 'add' ? 'Add Project' : 'Update Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {showViewModal && viewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Header */}
                <div className="flex items-start space-x-6">
                  <div className="w-32 h-32 bg-purple-500 rounded-xl overflow-hidden flex-shrink-0">
                    {viewProject.image ? (
                      <img 
                        src={viewProject.image} 
                        alt={viewProject.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{viewProject.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{viewProject.location}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {viewProject.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewProject.status)}`}>
                        {viewProject.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-600">{viewProject.totalUnits}</p>
                    <p className="text-sm text-gray-600">Total Units</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-600">{viewProject.soldUnits}</p>
                    <p className="text-sm text-gray-600">Units Sold</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-purple-600">{viewProject.leads}</p>
                    <p className="text-sm text-gray-600">Active Leads</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {((viewProject.soldUnits / viewProject.totalUnits) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Sold</p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Project Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Price Range</p>
                          <p className="font-medium">{viewProject.priceRange}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Project Type</p>
                          <p className="font-medium">{viewProject.type}</p>
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
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium">{viewProject.startDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-medium">{viewProject.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {viewProject.description && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Description</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{viewProject.description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditProject(viewProject);
                    }}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Project</span>
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

export default ProjectManagement;
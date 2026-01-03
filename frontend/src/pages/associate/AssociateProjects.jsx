import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building, 
  Users, 
  Upload,
  X,
  Save,
  Camera
} from 'lucide-react';
import { toast } from 'react-toastify';

const AssociateProjects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'SP Heights',
      location: 'Sector 15, Gurgaon',
      type: 'Residential',
      status: 'Active',
      totalUnits: 120,
      soldUnits: 85,
      availableUnits: 35,
      priceRange: '₹75L - ₹1.2Cr',
      possession: 'Dec 2025',
      amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Garden', 'Security'],
      description: 'Premium residential apartments with modern amenities and excellent connectivity.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
      configurations: ['2BHK', '3BHK', '4BHK'],
      commission: '2%'
    },
    {
      id: 2,
      name: 'SP Gardens',
      location: 'Sector 22, Noida',
      type: 'Residential',
      status: 'Active',
      totalUnits: 80,
      soldUnits: 45,
      availableUnits: 35,
      priceRange: '₹55L - ₹90L',
      possession: 'Mar 2026',
      amenities: ['Garden', 'Playground', 'Community Hall', 'Security', 'Parking'],
      description: 'Affordable housing with green spaces and family-friendly environment.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      configurations: ['1BHK', '2BHK', '3BHK'],
      commission: '1.5%'
    },
    {
      id: 3,
      name: 'SP Plaza',
      location: 'MG Road, Bangalore',
      type: 'Commercial',
      status: 'Active',
      totalUnits: 50,
      soldUnits: 30,
      availableUnits: 20,
      priceRange: '₹1.5Cr - ₹3Cr',
      possession: 'Jun 2025',
      amenities: ['Food Court', 'Parking', 'Security', 'Power Backup', 'Elevators'],
      description: 'Prime commercial spaces in the heart of the business district.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
      configurations: ['Office Space', 'Retail Shop', 'Restaurant Space'],
      commission: '2.5%'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Residential',
    status: 'Active',
    totalUnits: '',
    soldUnits: '',
    priceRange: '',
    possession: '',
    description: '',
    image: '',
    configurations: '',
    amenities: '',
    commission: ''
  });

  const projectTypes = ['Residential', 'Commercial', 'Villa', 'Plot'];
  const statusOptions = ['Active', 'Upcoming', 'Completed', 'On Hold'];

  const handleAddProject = () => {
    setModalType('add');
    setFormData({
      name: '',
      location: '',
      type: 'Residential',
      status: 'Active',
      totalUnits: '',
      soldUnits: '',
      priceRange: '',
      possession: '',
      description: '',
      image: '',
      configurations: '',
      amenities: '',
      commission: ''
    });
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setModalType('edit');
    setSelectedProject(project);
    setFormData({
      ...project,
      configurations: project.configurations.join(', '),
      amenities: project.amenities.join(', ')
    });
    setShowModal(true);
  };

  const handleViewProject = (project) => {
    setModalType('view');
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      totalUnits: parseInt(formData.totalUnits),
      soldUnits: parseInt(formData.soldUnits),
      availableUnits: parseInt(formData.totalUnits) - parseInt(formData.soldUnits),
      configurations: formData.configurations.split(',').map(c => c.trim()),
      amenities: formData.amenities.split(',').map(a => a.trim())
    };

    if (modalType === 'add') {
      const newProject = {
        ...projectData,
        id: Date.now()
      };
      setProjects([...projects, newProject]);
      toast.success('Project added successfully!');
    } else if (modalType === 'edit') {
      setProjects(projects.map(p => 
        p.id === selectedProject.id ? { ...projectData, id: selectedProject.id } : p
      ));
      toast.success('Project updated successfully!');
    }

    setShowModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Upcoming': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'On Hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Residential': 'bg-blue-100 text-blue-800',
      'Commercial': 'bg-purple-100 text-purple-800',
      'Villa': 'bg-orange-100 text-orange-800',
      'Plot': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.status.toLowerCase() === activeTab);

  const calculateProgress = (sold, total) => {
    return total > 0 ? (sold / total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-2">Manage and track your project portfolio</p>
        </div>
        <button
          onClick={handleAddProject}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: `All (${projects.length})` },
            { key: 'active', label: `Active (${projects.filter(p => p.status === 'Active').length})` },
            { key: 'upcoming', label: `Upcoming (${projects.filter(p => p.status === 'Upcoming').length})` },
            { key: 'completed', label: `Completed (${projects.filter(p => p.status === 'Completed').length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-red-600 to-black text-white text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop'}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(project.type)}`}>
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{project.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-semibold text-gray-900">{project.priceRange}</span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Sales Progress</span>
                    <span>{project.soldUnits}/{project.totalUnits}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(project.soldUnits, project.totalUnits)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Commission</span>
                    <p className="font-semibold text-green-600">{project.commission}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600">Available</span>
                    <p className="font-semibold text-gray-900">{project.availableUnits} units</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleViewProject(project)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-1 py-2 px-3 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEditProject(project)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-1 py-2 px-3 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-1 py-2 px-3 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first project</p>
            <button
              onClick={handleAddProject}
              className="btn-primary"
            >
              Add Project
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
                  {modalType === 'add' && 'Add New Project'}
                  {modalType === 'edit' && 'Edit Project'}
                  {modalType === 'view' && selectedProject?.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalType === 'view' ? (
                <ProjectViewContent project={selectedProject} />
              ) : (
                <ProjectFormContent
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  handleImageUpload={handleImageUpload}
                  projectTypes={projectTypes}
                  statusOptions={statusOptions}
                  modalType={modalType}
                  setShowModal={setShowModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Project View Component
const ProjectViewContent = ({ project }) => (
  <div className="space-y-6">
    <img
      src={project.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop'}
      alt={project.name}
      className="w-full h-64 object-cover rounded-2xl"
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Location</label>
          <p className="text-gray-900">{project.location}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Price Range</label>
          <p className="text-gray-900">{project.priceRange}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Possession</label>
          <p className="text-gray-900">{project.possession}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Commission</label>
          <p className="text-green-600 font-semibold">{project.commission}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Total Units</label>
          <p className="text-gray-900">{project.totalUnits}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Sold Units</label>
          <p className="text-gray-900">{project.soldUnits}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Available Units</label>
          <p className="text-gray-900">{project.availableUnits}</p>
        </div>
      </div>
    </div>
    
    <div>
      <label className="text-sm font-medium text-gray-600">Description</label>
      <p className="text-gray-900 mt-1">{project.description}</p>
    </div>
    
    <div>
      <label className="text-sm font-medium text-gray-600">Configurations</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {project.configurations?.map((config, index) => (
          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {config}
          </span>
        ))}
      </div>
    </div>
    
    <div>
      <label className="text-sm font-medium text-gray-600">Amenities</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {project.amenities?.map((amenity, index) => (
          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {amenity}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Project Form Component
const ProjectFormContent = ({ 
  formData, 
  setFormData, 
  handleSubmit, 
  handleImageUpload, 
  projectTypes, 
  statusOptions, 
  modalType,
  setShowModal
}) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Image Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors">
        {formData.image ? (
          <div className="relative">
            <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, image: '' })}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">Upload project image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Image</span>
            </label>
          </div>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          {projectTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Total Units *</label>
        <input
          type="number"
          value={formData.totalUnits}
          onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sold Units *</label>
        <input
          type="number"
          value={formData.soldUnits}
          onChange={(e) => setFormData({ ...formData, soldUnits: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Commission *</label>
        <input
          type="text"
          value={formData.commission}
          onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
          placeholder="e.g., 2%"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range *</label>
        <input
          type="text"
          value={formData.priceRange}
          onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
          placeholder="e.g., ₹75L - ₹1.2Cr"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Possession Date *</label>
        <input
          type="text"
          value={formData.possession}
          onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
          placeholder="e.g., Dec 2025"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Configurations</label>
      <input
        type="text"
        value={formData.configurations}
        onChange={(e) => setFormData({ ...formData, configurations: e.target.value })}
        placeholder="e.g., 2BHK, 3BHK, 4BHK (comma separated)"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
      <input
        type="text"
        value={formData.amenities}
        onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
        placeholder="e.g., Swimming Pool, Gym, Garden (comma separated)"
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
        className="flex-1 btn-primary flex items-center justify-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{modalType === 'add' ? 'Add Project' : 'Update Project'}</span>
      </button>
    </div>
  </form>
);

export default AssociateProjects;
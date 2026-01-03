import React from 'react';
import { Users, Building, DollarSign, TrendingUp, Eye, Phone, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: 'Total Leads', value: '1,234', icon: Users, color: 'bg-gradient-to-r from-red-600 to-black', change: '+12%' },
    { title: 'Associates', value: '56', icon: Users, color: 'bg-gradient-to-r from-red-600 to-black', change: '+5%' },
    { title: 'Projects', value: '23', icon: Building, color: 'bg-gradient-to-r from-red-600 to-black', change: '+8%' },
    { title: 'Revenue', value: '₹45.2L', icon: DollarSign, color: 'bg-gradient-to-r from-red-600 to-black', change: '+15%' }
  ];

  const recentLeads = [
    { id: 1, name: 'John Doe', phone: '+91 9876543210', status: 'Visit', project: 'SP Heights' },
    { id: 2, name: 'Jane Smith', phone: '+91 9876543211', status: 'Pending', project: 'SP Gardens' },
    { id: 3, name: 'Mike Johnson', phone: '+91 9876543212', status: 'Deal Done', project: 'SP Plaza' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Visit': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Deal Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart configurations
  const leadsTrendOptions = {
    chart: {
      type: 'line',
      height: 300,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Leads Trend (Last 6 Months)',
      style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
    },
    xAxis: {
      categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      labels: { style: { color: '#6B7280' } }
    },
    yAxis: {
      title: { text: 'Number of Leads', style: { color: '#6B7280' } },
      labels: { style: { color: '#6B7280' } }
    },
    series: [{
      name: 'Leads Generated',
      data: [180, 220, 195, 245, 280, 320],
      color: '#dc2626'
    }, {
      name: 'Leads Converted',
      data: [45, 58, 52, 68, 75, 89],
      color: '#059669'
    }],
    legend: {
      itemStyle: { color: '#374151' }
    },
    accessibility: {
      enabled: false
    },
    credits: { enabled: false }
  };

  const revenueChartOptions = {
    chart: {
      type: 'column',
      height: 300,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Monthly Revenue',
      style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
    },
    xAxis: {
      categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      labels: { style: { color: '#6B7280' } }
    },
    yAxis: {
      title: { text: 'Revenue (₹ Lakhs)', style: { color: '#6B7280' } },
      labels: { style: { color: '#6B7280' } }
    },
    series: [{
      name: 'Revenue',
      data: [25.5, 32.8, 28.9, 38.2, 42.1, 45.2],
      color: '#dc2626'
    }],
    legend: {
      itemStyle: { color: '#374151' }
    },
    accessibility: {
      enabled: false
    },
    credits: { enabled: false }
  };

  const projectStatusOptions = {
    chart: {
      type: 'pie',
      height: 300,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Project Status Distribution',
      style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
    },
    series: [{
      name: 'Projects',
      data: [
        { name: 'Active', y: 15, color: '#059669' },
        { name: 'Completed', y: 6, color: '#3b82f6' },
        { name: 'On Hold', y: 2, color: '#f59e0b' }
      ]
    }],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: { color: '#374151' }
        }
      }
    },
    accessibility: {
      enabled: false
    },
    credits: { enabled: false }
  };

  const quickActions = [
    { title: 'Add Lead', desc: 'Create new lead', icon: Users, color: 'bg-blue-50 hover:bg-blue-100', iconColor: 'text-blue-600', path: '/admin/leads' },
    { title: 'Add Project', desc: 'New project', icon: Building, color: 'bg-green-50 hover:bg-green-100', iconColor: 'text-green-600', path: '/admin/projects' },
    { title: 'Add Associate', desc: 'New team member', icon: Users, color: 'bg-purple-50 hover:bg-purple-100', iconColor: 'text-purple-600', path: '/admin/associates' },
    { title: 'Add Payment', desc: 'Record payment', icon: DollarSign, color: 'bg-orange-50 hover:bg-orange-100', iconColor: 'text-orange-600', path: '/admin/payments' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <HighchartsReact highcharts={Highcharts} options={leadsTrendOptions} />
        </div>
        <div className="card">
          <HighchartsReact highcharts={Highcharts} options={revenueChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <HighchartsReact highcharts={Highcharts} options={projectStatusOptions} />
        </div>
        
        {/* Recent Leads */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-sm text-gray-500">{lead.project}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                onClick={() => navigate(action.path)}
                className="btn-primary p-4 rounded-lg text-left"
              >
                <action.icon className="w-6 h-6 text-white mb-2" />
                <p className="font-medium text-white">{action.title}</p>
                <p className="text-sm text-red-100">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
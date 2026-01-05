import React, { useState, useEffect } from 'react';
import { Users, Building, DollarSign, TrendingUp, Eye, Phone, CheckCircle, Clock, MapPin, Calendar, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { dashboardAPI, leadsAPI } from '../../utils/api';

const AssociateDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { title: 'My Leads', value: '0', icon: Users, color: 'bg-gradient-to-r from-red-600 to-black', change: '+0%', desc: 'Total leads generated' },
    { title: 'Site Visits', value: '0', icon: MapPin, color: 'bg-gradient-to-r from-red-600 to-black', change: '+0%', desc: 'Visits completed' },
    { title: 'Deals Closed', value: '0', icon: CheckCircle, color: 'bg-gradient-to-r from-red-600 to-black', change: '+0%', desc: 'Successful closures' },
    { title: 'Commission', value: '₹0', icon: DollarSign, color: 'bg-gradient-to-r from-red-600 to-black', change: '+0%', desc: 'Total earnings' }
  ]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, leadsData] = await Promise.all([
        dashboardAPI.getStats(),
        leadsAPI.getAll({ limit: 5, page: 1 })
      ]);

      if (statsData.success) {
        setStats([
          { title: 'My Leads', value: statsData.data.totalLeads || '0', icon: Users, color: 'bg-gradient-to-r from-red-600 to-black', change: `+${statsData.data.leadsGrowth || 0}%`, desc: 'Total leads generated' },
          { title: 'Site Visits', value: statsData.data.totalSiteVisits || '0', icon: MapPin, color: 'bg-gradient-to-r from-red-600 to-black', change: `+${statsData.data.visitsGrowth || 0}%`, desc: 'Visits completed' },
          { title: 'Deals Closed', value: statsData.data.totalDeals || '0', icon: CheckCircle, color: 'bg-gradient-to-r from-red-600 to-black', change: `+${statsData.data.dealsGrowth || 0}%`, desc: 'Successful closures' },
          { title: 'Commission', value: `₹${(statsData.data.totalCommission || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-gradient-to-r from-red-600 to-black', change: `+${statsData.data.commissionGrowth || 0}%`, desc: 'Total earnings' }
        ]);
      }

      if (leadsData.success) {
        setRecentLeads(leadsData.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingSiteVisits = [
    { id: 1, client: 'Sarah Wilson', project: 'SP Heights', time: '10:00 AM', date: 'Today' },
    { id: 2, client: 'David Brown', project: 'SP Gardens', time: '2:00 PM', date: 'Tomorrow' },
    { id: 3, client: 'Lisa Davis', project: 'SP Plaza', time: '11:00 AM', date: 'Dec 28' }
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

  // Chart configurations for Associate Dashboard
  const performanceChartOptions = {
    chart: {
      type: 'area',
      height: 300,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'My Performance Trend',
      style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
    },
    xAxis: {
      categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      labels: { style: { color: '#6B7280' } }
    },
    yAxis: {
      title: { text: 'Count', style: { color: '#6B7280' } },
      labels: { style: { color: '#6B7280' } }
    },
    series: [{
      name: 'Leads Generated',
      data: [8, 12, 10, 15, 18, 22],
      color: '#dc2626',
      fillOpacity: 0.3
    }, {
      name: 'Site Visits',
      data: [3, 5, 4, 6, 8, 12],
      color: '#059669',
      fillOpacity: 0.3
    }, {
      name: 'Deals Closed',
      data: [1, 2, 1, 3, 4, 8],
      color: '#3b82f6',
      fillOpacity: 0.3
    }],
    legend: {
      itemStyle: { color: '#374151' }
    },
    accessibility: {
      enabled: false
    },
    credits: { enabled: false }
  };

  const commissionChartOptions = {
    chart: {
      type: 'column',
      height: 300,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Monthly Commission Earnings',
      style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
    },
    xAxis: {
      categories: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      labels: { style: { color: '#6B7280' } }
    },
    yAxis: {
      title: { text: 'Commission (₹ Thousands)', style: { color: '#6B7280' } },
      labels: { style: { color: '#6B7280' } }
    },
    series: [{
      name: 'Commission',
      data: [15, 25, 18, 35, 42, 58],
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

  const leadStatusOptions = {
    chart: {
      type: 'pie',
      height: 300,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'My Leads Status',
      style: { color: '#374151', fontSize: '16px', fontWeight: 'bold' }
    },
    series: [{
      name: 'Leads',
      data: [
        { name: 'Follow Up', y: 18, color: '#f59e0b' },
        { name: 'Site Visit', y: 15, color: '#3b82f6' },
        { name: 'Final Stage', y: 8, color: '#059669' },
        { name: 'Closed', y: 4, color: '#dc2626' }
      ],
      innerSize: '50%'
    }],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
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
    { title: 'Add Lead', desc: 'New lead entry', icon: Users, color: 'bg-blue-50 hover:bg-blue-100', iconColor: 'text-blue-600', path: '/associate/leads' },
    { title: 'Site Visit', desc: 'Schedule visit', icon: MapPin, color: 'bg-green-50 hover:bg-green-100', iconColor: 'text-green-600', path: '/associate/site-visits' },
    { title: 'View Projects', desc: 'Browse projects', icon: Building, color: 'bg-purple-50 hover:bg-purple-100', iconColor: 'text-purple-600', path: '/associate/projects' },
    { title: 'Commission', desc: 'Check earnings', icon: DollarSign, color: 'bg-orange-50 hover:bg-orange-100', iconColor: 'text-orange-600', path: '/associate/commission' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Associate Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your performance overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today's Date</p>
          <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
                <div className="flex items-center mt-3">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center ml-4`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <HighchartsReact highcharts={Highcharts} options={performanceChartOptions} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <HighchartsReact highcharts={Highcharts} options={commissionChartOptions} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <HighchartsReact highcharts={Highcharts} options={leadStatusOptions} />
        </div>
        
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">My Recent Leads</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              </div>
            ) : recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.phone}</p>
                      <p className="text-xs text-gray-500">{lead.project?.name || 'No Project'} • {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent leads</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/associate/leads')}
            className="w-full mt-4 py-2 text-center text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            View All Leads →
          </button>
        </div>

        {/* Upcoming Site Visits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Site Visits</h3>
            <Award className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {upcomingSiteVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{visit.client}</p>
                    <p className="text-sm text-gray-600">{visit.project}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{visit.time}</p>
                  <p className="text-xs text-gray-500">{visit.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/associate/site-visits')}
            className="w-full mt-4 py-2 text-center text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            View All Visits →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              onClick={() => navigate(action.path)}
              className="btn-primary p-4 rounded-xl text-left transition-all hover:scale-105 hover:shadow-md"
            >
              <action.icon className="w-8 h-8 text-white mb-3" />
              <p className="font-semibold text-white text-sm">{action.title}</p>
              <p className="text-xs text-red-100 mt-1">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssociateDashboard;
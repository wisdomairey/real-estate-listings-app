import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOffice2Icon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Loading dashboard data...');
        
        // Load statistics
        try {
          const statsResponse = await propertyService.getPropertyStats();
          console.log('Stats response:', statsResponse);
          if (statsResponse.success) {
            setStats(statsResponse.data);
          }
        } catch (statsError) {
          console.error('Error loading stats:', statsError);
          // Continue loading other data even if stats fail
        }

        // Load recent properties
        try {
          const propertiesResponse = await propertyService.getProperties({
            limit: 5,
            sort: '-createdAt'
          });
          console.log('Properties response:', propertiesResponse);
          if (propertiesResponse.success) {
            setRecentProperties(propertiesResponse.data.properties);
          }
        } catch (propertiesError) {
          console.error('Error loading properties:', propertiesError);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats?.overview?.totalProperties || 0,
      change: '+12%',
      changeType: 'increase',
      icon: BuildingOffice2Icon,
      color: 'blue'
    },
    {
      title: 'Available',
      value: stats?.overview?.availableProperties || 0,
      change: '+8%',
      changeType: 'increase',
      icon: HomeIcon,
      color: 'green'
    },
    {
      title: 'Sold This Month',
      value: stats?.overview?.soldProperties || 0,
      change: '+15%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'yellow'
    },
    {
      title: 'Total Value',
      value: stats?.overview?.totalValue ? propertyService.formatPrice(stats.overview.totalValue) : '$0',
      change: '+10%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'purple'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's what's happening with your properties.
            </p>
          </div>
          <Link
            to="/admin/properties/new"
            className="btn btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const isIncrease = stat.changeType === 'increase';
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {isIncrease ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    isIncrease ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Properties */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
                  <Link
                    to="/admin/properties"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </Link>
                </div>
              </div>
              
              <div className="overflow-hidden">
                {recentProperties.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {recentProperties.map((property) => (
                      <div key={property._id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {property.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                {property.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {property.address}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <span className="font-medium">
                                {propertyService.formatPrice(property.price)}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Link
                              to={`/properties/${property._id}`}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="View Property"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/properties/${property._id}/edit`}
                              className="p-1 text-gray-400 hover:text-primary-600"
                              title="Edit Property"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <BuildingOffice2Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Get started by adding your first property.
                    </p>
                    <Link
                      to="/admin/properties/new"
                      className="btn btn-primary btn-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Property
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Property Types Breakdown */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types</h3>
              {stats?.byType && stats.byType.length > 0 ? (
                <div className="space-y-3">
                  {stats.byType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{type._id}</span>
                      <span className="text-sm font-medium text-gray-900">{type.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No data available</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/admin/properties/new"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Add New Property
                </Link>
                <Link
                  to="/admin/properties"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Manage Properties
                </Link>
                <Link
                  to="/properties"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  View Public Site
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {recentProperties.length} properties added this week
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ChartBarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {stats?.overview?.soldProperties || 0} properties sold this month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

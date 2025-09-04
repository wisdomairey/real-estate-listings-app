import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import SearchFilters from '../components/SearchFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get initial filters from URL params
  const getFiltersFromParams = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === 'features') {
        filters[key] = searchParams.getAll(key);
      } else if (key === 'petFriendly' || key === 'furnished') {
        filters[key] = value === 'true';
      } else {
        filters[key] = value;
      }
    }
    return filters;
  };

  const [currentFilters, setCurrentFilters] = useState(getFiltersFromParams());

  const loadProperties = async (filters = {}, page = 1) => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page,
        limit: 12
      };

      const response = await propertyService.getProperties(params);
      
      if (response.success) {
        setProperties(response.data.properties);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load properties when component mounts or URL params change
  useEffect(() => {
    const filters = getFiltersFromParams();
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentFilters(filters);
    loadProperties(filters, page);
  }, [searchParams]);

  const handleSearch = (filters) => {
    setCurrentFilters(filters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key])) {
        filters[key].forEach(value => {
          newParams.append(key, value);
        });
      } else {
        newParams.set(key, filters[key]);
      }
    });
    
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setCurrentFilters({});
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSortOptions = () => [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'bedrooms', label: 'Bedrooms: Low to High' },
    { value: '-bedrooms', label: 'Bedrooms: High to Low' },
    { value: 'area', label: 'Area: Small to Large' },
    { value: '-area', label: 'Area: Large to Small' }
  ];

  const handleSortChange = (sortValue) => {
    const newFilters = { ...currentFilters, sort: sortValue };
    handleSearch(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
              <p className="mt-2 text-gray-600">
                {pagination.total ? `${pagination.total} properties found` : 'Browse our property listings'}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Toggle (Mobile) */}
        <div className="mb-6 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'} mb-8 lg:mb-0`}>
            <SearchFilters
              onSearch={handleSearch}
              onReset={handleReset}
              initialFilters={currentFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {pagination.total > 0 && (
                  <span className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </span>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={currentFilters.sort || '-createdAt'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {getSortOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Properties Grid/List */}
            {loading ? (
              <div className="space-y-4">
                <LoadingSpinner className="mx-auto" />
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse bg-white rounded-lg p-4">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      showStatus={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          pagination.hasPrev
                            ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(pagination.pages, 5))].map((_, index) => {
                          const pageNum = index + 1;
                          const isCurrentPage = pageNum === pagination.page;
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                isCurrentPage
                                  ? 'bg-primary-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          pagination.hasNext
                            ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    </div>

                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                  </div>
                )}
              </>
            ) : (
              // No Results
              <div className="text-center py-12">
                <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search filters or browse all properties.
                </p>
                <button
                  onClick={handleReset}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;

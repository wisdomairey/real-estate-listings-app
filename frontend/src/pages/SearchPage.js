import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import {
  MagnifyingGlassIcon,
  MapIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({});

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    
    // Navigate to properties page with search parameters
    const searchParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key])) {
        filters[key].forEach(value => {
          searchParams.append(key, value);
        });
      } else {
        searchParams.set(key, filters[key]);
      }
    });
    
    navigate(`/properties?${searchParams.toString()}`);
  };

  const handleReset = () => {
    setSearchFilters({});
  };

  const handleMapSearch = () => {
    // Navigate to map view with current filters
    const searchParams = new URLSearchParams();
    Object.keys(searchFilters).forEach(key => {
      if (Array.isArray(searchFilters[key])) {
        searchFilters[key].forEach(value => {
          searchParams.append(key, value);
        });
      } else {
        searchParams.set(key, searchFilters[key]);
      }
    });
    
    navigate(`/map?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Property
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Use our advanced search filters to discover properties that match your exact needs and preferences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              <span>Advanced Filters</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
              <MapIcon className="h-5 w-5 mr-2" />
              <span>Map Integration</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              <span>Smart Search</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Properties
            </h2>
            <p className="text-gray-600">
              Use the filters below to narrow down your search and find properties that meet your criteria.
            </p>
          </div>

          <SearchFilters
            onSearch={handleSearch}
            onReset={handleReset}
            initialFilters={searchFilters}
          />

          {/* Search Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSearch(searchFilters)}
              className="btn btn-primary btn-lg"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search Properties
            </button>
            <button
              onClick={handleMapSearch}
              className="btn btn-outline btn-lg"
            >
              <MapIcon className="h-5 w-5 mr-2" />
              View on Map
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Search Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced search system helps you find exactly what you're looking for with precision and ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AdjustmentsHorizontalIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Advanced Filters
              </h3>
              <p className="text-gray-600">
                Filter by price, size, type, features, and more to find properties that match your exact requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Location-Based Search
              </h3>
              <p className="text-gray-600">
                Search properties within specific areas or find homes near important locations like schools and work.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Text Search
              </h3>
              <p className="text-gray-600">
                Use natural language to search property descriptions, addresses, and features for better results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Search Tips
            </h2>
            <p className="text-xl text-gray-600">
              Get the most out of your property search with these helpful tips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Start Broad, Then Narrow
              </h3>
              <p className="text-gray-600">
                Begin with basic criteria like location and price range, then add specific features 
                and amenities to refine your results.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Use Price Ranges
              </h3>
              <p className="text-gray-600">
                Select predefined price ranges for quick filtering, or set custom min/max values 
                for more precise budget matching.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Consider Commute Times
              </h3>
              <p className="text-gray-600">
                Use the map view to check distances to work, schools, and other important 
                locations when evaluating properties.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Save Your Searches
              </h3>
              <p className="text-gray-600">
                Bookmark properties you're interested in and save search criteria to easily 
                revisit and compare options later.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchPage;

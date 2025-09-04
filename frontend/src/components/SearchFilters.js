import React from 'react';
import { useForm } from 'react-hook-form';
import { PROPERTY_TYPES, PRICE_RANGES } from '../config/config';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const SearchFilters = ({ onSearch, onReset, initialFilters = {} }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      petFriendly: false,
      furnished: false,
      features: [],
      ...initialFilters
    }
  });

  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = React.useState('');

  const watchedValues = watch();

  const handlePriceRangeChange = (range) => {
    if (range) {
      const priceRange = PRICE_RANGES.find(r => r.label === range);
      if (priceRange) {
        setValue('minPrice', priceRange.min);
        setValue('maxPrice', priceRange.max || '');
        setSelectedPriceRange(range);
      }
    } else {
      setValue('minPrice', '');
      setValue('maxPrice', '');
      setSelectedPriceRange('');
    }
  };

  const onSubmit = (data) => {
    // Clean up empty values
    const cleanedData = Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      
      // Skip empty values
      if (value === '' || value === null || value === undefined) {
        return acc;
      }
      
      // Handle arrays (like features)
      if (Array.isArray(value)) {
        if (value.length > 0) {
          acc[key] = value;
        }
        return acc;
      }
      
      // Handle booleans - only include if true
      if (typeof value === 'boolean') {
        if (value === true) {
          acc[key] = value;
        }
        return acc;
      }
      
      // Include all other non-empty values
      acc[key] = value;
      return acc;
    }, {});

    console.log('Search filters:', cleanedData); // Debug log
    onSearch(cleanedData);
  };

  const handleReset = () => {
    reset();
    setSelectedPriceRange('');
    setShowAdvanced(false);
    onReset();
  };

  const commonFeatures = [
    'Swimming Pool',
    'Garage',
    'Balcony',
    'Garden',
    'Fireplace',
    'Gym',
    'Laundry Room',
    'Walk-in Closet',
    'Hardwood Floors',
    'Modern Kitchen',
    'Master Suite',
    'Security System'
  ];

  return (
    <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            {...register('search')}
            type="text"
            placeholder="Search by title, description, or address..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Property Type */}
          <select
            {...register('type')}
            className="input pr-8 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[length:16px_16px]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")` 
            }}
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <select
            value={selectedPriceRange}
            onChange={(e) => handlePriceRangeChange(e.target.value)}
            className="input pr-8 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[length:16px_16px]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")` 
            }}
          >
            <option value="">Any Price</option>
            {PRICE_RANGES.map(range => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Bedrooms */}
          <select
            {...register('bedrooms')}
            className="input pr-8 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[length:16px_16px]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")` 
            }}
          >
            <option value="">Any Bedrooms</option>
            <option value="0">Studio</option>
            <option value="1">1+ Bedroom</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </select>

          {/* Bathrooms */}
          <select
            {...register('bathrooms')}
            className="input pr-8 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[length:16px_16px]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")` 
            }}
          >
            <option value="">Any Bathrooms</option>
            <option value="1">1+ Bathroom</option>
            <option value="1.5">1.5+ Bathrooms</option>
            <option value="2">2+ Bathrooms</option>
            <option value="2.5">2.5+ Bathrooms</option>
            <option value="3">3+ Bathrooms</option>
            <option value="4">4+ Bathrooms</option>
          </select>
        </div>

        {/* Advanced Filters Toggle and Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors self-start"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline w-full sm:w-auto sm:min-w-[100px]"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto sm:min-w-[100px]"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-gray-200 pt-6 space-y-6">
            {/* Custom Price Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Price Range</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min Price</label>
                  <input
                    {...register('minPrice')}
                    type="number"
                    placeholder="e.g., 200000"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Max Price</label>
                  <input
                    {...register('maxPrice')}
                    type="number"
                    placeholder="e.g., 800000"
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Area Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Square Footage</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min Area (sq ft)</label>
                  <input
                    {...register('minArea')}
                    type="number"
                    placeholder="e.g., 800"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Max Area (sq ft)</label>
                  <input
                    {...register('maxArea')}
                    type="number"
                    placeholder="e.g., 3000"
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      value={feature}
                      {...register('features')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Options</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('petFriendly')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pet Friendly</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('furnished')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Furnished</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Active Filters Summary */}
      {Object.keys(watchedValues).some(key => 
        watchedValues[key] && 
        watchedValues[key] !== '' && 
        watchedValues[key] !== false &&
        !(Array.isArray(watchedValues[key]) && watchedValues[key].length === 0)
      ) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h5>
          <div className="flex flex-wrap gap-2">
            {Object.entries(watchedValues).map(([key, value]) => {
              if (!value || value === '' || value === false || 
                  (Array.isArray(value) && value.length === 0)) {
                return null;
              }

              let displayValue = value;
              if (key === 'type') {
                const type = PROPERTY_TYPES.find(t => t.value === value);
                displayValue = type ? type.label : value;
              } else if (key === 'minPrice' || key === 'maxPrice') {
                displayValue = `$${parseInt(value).toLocaleString()}`;
              } else if (Array.isArray(value)) {
                displayValue = value.join(', ');
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {key}: {displayValue.toString()}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;

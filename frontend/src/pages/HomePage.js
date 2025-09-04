import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MagnifyingGlassIcon,
  MapIcon,
  BuildingOffice2Icon,
  HomeIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    happyClients: 0,
    yearsExperience: 15
  });

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const response = await propertyService.getProperties({
          limit: 6,
          status: 'available',
          sort: '-createdAt'
        });
        
        if (response.success) {
          setFeaturedProperties(response.data.properties);
          setStats(prev => ({
            ...prev,
            totalProperties: response.data.pagination.total,
            availableProperties: response.data.properties.length
          }));
        }
      } catch (error) {
        console.error('Error loading featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Advanced Search',
      description: 'Find your perfect property with our powerful search filters and criteria matching.'
    },
    {
      icon: MapIcon,
      title: 'Interactive Maps',
      description: 'Explore properties on our interactive map to see neighborhoods and nearby amenities.'
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Quality Listings',
      description: 'All properties are verified and come with detailed information and high-quality photos.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Trusted Service',
      description: 'Our experienced team provides reliable service and expert guidance throughout your journey.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream
              <span className="block text-yellow-300">Property Today</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Discover amazing properties with our advanced search features and interactive maps. 
              Your perfect home is just a click away.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                Browse Properties
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Advanced Search
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-white border-opacity-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.totalProperties}+
                </div>
                <div className="text-sm text-gray-200">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.availableProperties}+
                </div>
                <div className="text-sm text-gray-200">Available Now</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">1000+</div>
                <div className="text-sm text-gray-200">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.yearsExperience}+
                </div>
                <div className="text-sm text-gray-200">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PropertyHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide cutting-edge tools and premium services to help you discover, evaluate, 
              and secure your ideal property with complete confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-gray-600">
                Discover our handpicked selection of premium properties
              </p>
            </div>
            <Link
              to="/properties"
              className="hidden md:inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Properties
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    showStatus={false}
                  />
                ))}
              </div>

              {featuredProperties.length === 0 && (
                <div className="text-center py-12">
                  <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No properties available
                  </h3>
                  <p className="text-gray-600">
                    Check back later for new listings.
                  </p>
                </div>
              )}

              {/* Mobile View All Button */}
              <div className="mt-12 text-center md:hidden">
                <Link
                  to="/properties"
                  className="btn btn-primary btn-lg"
                >
                  View All Properties
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers who found their dream homes with us. 
            Start your property search today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Start Your Search
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              <MapIcon className="h-5 w-5 mr-2" />
              Explore on Map
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-primary-500">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-sm">4.9/5 Customer Rating</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-primary-400"></div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-1" />
                <span className="text-sm">Verified Listings</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-primary-400"></div>
              <div className="flex items-center">
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

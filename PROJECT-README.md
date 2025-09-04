# Real Estate Listings Application

A full-featured real estate listings web application with admin dashboard and public client portal, featuring searchable and map-based property listings.

## Features

### Client Portal (Public)

- **Property Listings**: Browse all available properties with filtering and pagination
- **Advanced Search**: Filter by price, type, location, bedrooms, bathrooms, and features
- **Property Details**: Detailed property pages with image galleries and contact information
- **Interactive Maps**: Map view with property markers and location visualization
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

### Admin Dashboard

- **Property Management**: Full CRUD operations for property listings
- **Image Upload**: Multiple image upload with preview and management
- **User Authentication**: Secure admin login with JWT tokens
- **Dashboard Analytics**: Property statistics and overview
- **Bulk Operations**: Select and manage multiple properties

### Technical Features

- **Authentication**: JWT-based authentication with role-based access control
- **File Upload**: Image upload with validation and storage
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API with comprehensive validation
- **Security**: Rate limiting, CORS, helmet, and input validation

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

### Frontend

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Mapbox GL JS** - Interactive maps
- **Heroicons** - Icon library

## Project Structure

```
real-estate-listings-app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── propertyController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Property.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── properties.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── PropertyCard.js
│   │   │   ├── SearchFilters.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ProtectedRoute.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── PropertiesPage.js
│   │   │   ├── PropertyDetailPage.js
│   │   │   ├── SearchPage.js
│   │   │   ├── MapViewPage.js
│   │   │   ├── AdminLoginPage.js
│   │   │   ├── AdminDashboardPage.js
│   │   │   ├── AdminPropertiesPage.js
│   │   │   └── AdminPropertyFormPage.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── propertyService.js
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Mapbox account (for map functionality)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/real-estate-listings
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

4. Start the server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=your-mapbox-access-token-here
```

4. Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Database Setup

The application will automatically create the necessary collections when you start using it. For development, you can create an admin user by registering through the admin login page.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Properties

- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (admin only)
- `PUT /api/properties/:id` - Update property (admin only)
- `DELETE /api/properties/:id` - Delete property (admin only)

## Configuration

### Environment Variables

#### Backend (.env)

```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=your-mapbox-access-token
```

### Mapbox Setup

1. Create a free account at [Mapbox](https://www.mapbox.com/)
2. Get your access token from the dashboard
3. Add it to your frontend `.env` file as `REACT_APP_MAPBOX_TOKEN`

## Usage

### Admin Features

1. **Login**: Access the admin panel at `/admin/login`
2. **Dashboard**: View property statistics and recent listings
3. **Manage Properties**: Add, edit, or delete property listings
4. **Image Upload**: Upload multiple images for each property
5. **Property Status**: Mark properties as available, pending, or sold

### Public Features

1. **Browse Properties**: View all available properties with filtering
2. **Search**: Use advanced search with multiple criteria
3. **Property Details**: View detailed information and images
4. **Map View**: See properties on an interactive map
5. **Contact**: Get agent contact information for each property

## Development

### Adding New Features

1. **Backend**: Add new routes in `/routes`, controllers in `/controllers`, and models in `/models`
2. **Frontend**: Add new components in `/components` and pages in `/pages`
3. **Database**: Modify existing models or create new ones in `/models`

### Testing

Run the backend tests:

```bash
cd backend
npm test
```

Run the frontend tests:

```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy using platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment

1. Build the production version:

```bash
npm run build
```

2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3

### Database

- Use MongoDB Atlas for production database
- Ensure proper indexing for performance
- Set up regular backups

## Security Considerations

- JWT tokens for authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- File upload validation
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue on the GitHub repository.

# Real Estate Listings Application

A full-featured real estate platform with admin dashboard and public client portal featuring searchable and map-based property listings.

## 🏗️ Architecture

- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Maps**: Mapbox GL JS
- **Authentication**: JWT-based

## 📁 Project Structure

```
real-estate-listings-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Mapbox account (for map functionality)

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `.env` files in the backend directory:

```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/real-estate-app
JWT_SECRET=your-super-secure-jwt-secret-key-here
PORT=5000
NODE_ENV=development
MAPBOX_TOKEN=your-mapbox-access-token
```

### 3. Database Setup

1. Install and start MongoDB locally, or use MongoDB Atlas
2. The database will be automatically created when you first run the application
3. Sample data will be seeded on first startup

### 4. Mapbox Setup

1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Create a new access token
3. Add your token to the `.env` file
4. Update the frontend Mapbox configuration

### 5. Running the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Admin Access

Default admin credentials:

- Email: admin@realestate.com
- Password: admin123

## 📋 Features

### Admin Dashboard

- ✅ JWT-based authentication
- ✅ Create, edit, delete property listings
- ✅ Upload and manage property images
- ✅ Comprehensive property management

### Client Portal

- ✅ Browse all property listings
- ✅ Advanced search and filtering
- ✅ Interactive Mapbox map with property markers
- ✅ Detailed property pages
- ✅ Responsive design

### API Endpoints

#### Authentication

- `POST /api/auth/login` - Admin login

#### Properties

- `GET /api/properties` - Get all properties (with optional filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (admin only)
- `PUT /api/properties/:id` - Update property (admin only)
- `DELETE /api/properties/:id` - Delete property (admin only)

## 🛠️ Development

### Database Schema

**Property Model:**

```javascript
{
  title: String,
  description: String,
  price: Number,
  type: String, // 'house', 'apartment', 'condo', 'townhouse'
  status: String, // 'available', 'sold', 'pending'
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  images: [String],
  features: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**User Model:**

```javascript
{
  email: String,
  password: String,
  role: String, // 'admin'
  createdAt: Date
}
```

### Key Technologies

- **React Router** - Client-side routing
- **Axios** - HTTP client
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Mongoose** - MongoDB ODM
- **TailwindCSS** - Utility-first CSS

## 🔧 Customization

1. **Styling**: Modify TailwindCSS classes or add custom CSS
2. **Map Style**: Change Mapbox map style in frontend configuration
3. **Property Types**: Add new property types in the Property model
4. **Search Filters**: Extend search functionality in PropertyService
5. **Image Storage**: Replace local storage with cloud services (AWS S3, Cloudinary)

## 🚀 Deployment

### Backend (Node.js)

- Deploy to Heroku, Railway, or DigitalOcean
- Set environment variables in production
- Use MongoDB Atlas for production database

### Frontend (React)

- Deploy to Vercel, Netlify, or AWS S3
- Update API base URL for production
- Build optimized production bundle

## 📝 License

MIT License - feel free to use this project for your real estate business!

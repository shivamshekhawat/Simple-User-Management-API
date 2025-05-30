# Authentication System

A secure user authentication system built with modern web technologies, featuring JWT-based authentication, PostgreSQL database integration, and a beautiful responsive UI.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon account recommended)
- Vercel account (for deployment)

## 🛠️ How to Run the Project

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd fastapi-auth-system

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Database Setup

The database will automatically initialize on first API call. No manual setup required!

### 4. Run Development Server

```bash
npm run dev
```


### 5. Deploy to Vercel
Live Link: https://user-management-api2.vercel.app/

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/register` | Register a new user | ❌ |
| `POST` | `/api/login` | Login user and get JWT token | ❌ |

### User Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/profile/{id}` | Get user profile by ID | ✅ |
| `PUT` | `/api/profile/{id}` | Update user profile | ✅ |

### Request/Response Examples

#### Register User
```bash
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```

#### Login User
```bash
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Response
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile (Protected)
```bash
GET /api/profile/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Update Profile (Protected)
```bash
PUT /api/profile/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with 7-day expiration
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Email format validation, password strength requirements
- **Authorization**: Bearer token authentication for protected routes
- **CORS Protection**: Secure cross-origin resource sharing
- **SQL Injection Prevention**: Parameterized queries with Neon client

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Password Strength Indicator**: Visual feedback for password security
- **Form Validation**: Real-time input validation and error handling
- **Loading States**: Smooth loading animations and feedback
- **Modern UI**: Beautiful gradients, shadows, and animations
- **Auto-redirect**: Automatic navigation after successful actions

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── login/route.ts          # Login endpoint
│   │   ├── register/route.ts       # Registration endpoint
│   │   └── profile/[id]/route.ts   # Profile endpoints
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Registration page
│   ├── profile/page.tsx            # Profile page
│   └── page.tsx                    # Home page
├── lib/
│   ├── auth.ts                     # JWT utilities
│   ├── db.ts                       # Database operations
│   └── types.ts                    # TypeScript types
└── components/ui/                  # Reusable UI components
```

## 🧪 Testing

The system includes comprehensive error handling and validation:

- Email format validation
- Password strength requirements (minimum 8 characters)
- Duplicate email prevention
- JWT token expiration handling
- Database connection error handling

## 📝 License

This project is built for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using Next.js, PostgreSQL, and JWT**
```

This README provides a comprehensive overview of your authentication system, including the tech stack, setup instructions, API documentation, and security features. It's structured to help both developers and users understand how to use and deploy the system.

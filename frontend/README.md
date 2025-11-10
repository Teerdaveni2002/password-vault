# Password Vault Frontend

A professional React frontend application for secure password management with role-based access control.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Role-based access control (User/Admin)
  - Secure token storage and auto-refresh
  - Protected routes

- **Password Management**
  - Create, view, update, and delete passwords
  - Password encryption and secure storage
  - Category-based organization
  - Search and filter functionality
  - Password sharing capabilities

- **Access Control**
  - Request-based password access
  - Admin approval workflow
  - Access request tracking
  - Audit trail for all actions

- **User Experience**
  - Modern Material-UI design
  - Dark/Light theme support
  - Responsive layout for all devices
  - Loading states and notifications
  - Password strength indicators
  - Form validation

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **React Query** - Data fetching and caching
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see backend documentation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables:
```env
VITE_API_URL=http://localhost:8000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Lint

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── auth/       # Authentication components
│   │   ├── password/   # Password management components
│   │   ├── admin/      # Admin dashboard components
│   │   └── common/     # Shared components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── context/        # React context providers
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user

### Passwords
- `GET /api/passwords/` - List passwords
- `POST /api/passwords/` - Create password
- `GET /api/passwords/:id/` - Get password details
- `PATCH /api/passwords/:id/` - Update password
- `DELETE /api/passwords/:id/` - Delete password
- `GET /api/passwords/:id/view/` - View decrypted password

### Password Requests
- `GET /api/password-requests/` - List requests
- `POST /api/password-requests/` - Create request
- `POST /api/password-requests/:id/approve/` - Approve request
- `POST /api/password-requests/:id/reject/` - Reject request

## Security Features

- Secure token storage in localStorage
- Automatic token refresh
- XSS protection through input sanitization
- CORS configuration
- Password strength validation
- Auto logout on token expiry
- Protected admin routes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

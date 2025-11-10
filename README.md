# Password Vault

A professional, secure password management application with role-based access control. Built with a React/TypeScript frontend and Django backend (backend implementation in progress).

## 🚀 Features

### For All Users
- **Secure Password Storage** - Store passwords with encryption
- **Easy Organization** - Categorize and search your passwords
- **Access Control** - Request access to shared passwords
- **Modern UI** - Clean, responsive interface with dark/light themes
- **Password Strength** - Visual indicators for password security

### For Administrators
- **Request Management** - Review and approve/reject access requests
- **User Management** - Monitor user activities
- **Audit Trail** - Track all password access and changes

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional component library
- **React Router** - Client-side routing
- **React Hook Form** - Efficient form handling
- **React Query** - Data fetching and caching
- **Axios** - HTTP client with interceptors
- **Vite** - Fast build tool

### Backend (In Progress)
- **Django** - Python web framework
- **Django REST Framework** - API development
- **Simple JWT** - JWT authentication
- **PostgreSQL** - Database
- **Cryptography** - Password encryption

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for backend)
- PostgreSQL (for backend)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
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

4. Update the `.env` file with your API URL:
```env
VITE_API_URL=http://localhost:8000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Backend Setup (Coming Soon)

Backend implementation is in progress. Stay tuned for setup instructions.

## 🏗️ Project Structure

```
password-vault/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/     # Authentication components
│   │   │   ├── password/ # Password management
│   │   │   ├── admin/    # Admin dashboard
│   │   │   └── common/   # Shared components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   ├── context/      # React context
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   ├── package.json
│   └── README.md         # Frontend documentation
├── backend/              # Django backend (coming soon)
└── README.md            # This file
```

## 📖 Documentation

- [Frontend Documentation](./frontend/README.md)
- [Features Documentation](./frontend/FEATURES.md)
- Backend Documentation (Coming Soon)

## 🎨 User Interface

The application features a modern, professional interface with:

- **Login Page** - Secure authentication
- **Registration Page** - New user signup with password strength indicator
- **Password List** - Grid view of all passwords with search
- **Password Details** - Detailed view with copy functionality
- **Admin Dashboard** - Request management for administrators
- **Dark/Light Theme** - Toggle between themes

## 🔒 Security Features

### Authentication
- JWT-based authentication
- Secure token storage
- Automatic token refresh
- Auto-logout on expiry

### Password Security
- Strong password requirements
- Password strength indicators
- Encrypted storage (backend)
- Secure password viewing

### Access Control
- Role-based permissions
- Request-approval workflow
- Admin-only features
- Protected routes

### Input Security
- XSS prevention
- Input sanitization
- CORS configuration
- Request validation

## 🚦 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/Teerdaveni2002/password-vault.git
cd password-vault
```

2. **Set up the frontend**
```bash
cd frontend
npm install
npm run dev
```

3. **Access the application**
- Open `http://localhost:3000` in your browser
- Note: Backend is not yet implemented, so API calls will fail

## 🧪 Development

### Frontend Development

Build for production:
```bash
cd frontend
npm run build
```

Run linter:
```bash
npm run lint
```

Preview production build:
```bash
npm run preview
```

### Type Checking
```bash
npx tsc --noEmit
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Teerdaveni2002** - Initial work

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- All contributors and users of this project

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ React frontend with TypeScript
- ✅ Authentication components
- ✅ Password management UI
- ✅ Admin dashboard
- ✅ Dark/Light theme support

### Version 1.1 (In Progress)
- ⏳ Django backend implementation
- ⏳ API endpoints
- ⏳ Database integration
- ⏳ Password encryption

### Version 2.0 (Planned)
- 🔜 Password generator
- 🔜 Two-factor authentication
- 🔜 Password sharing
- 🔜 Export/Import functionality
- 🔜 Browser extension
- 🔜 Mobile app

## ⚠️ Current Limitations

- Backend is not yet implemented
- API calls will not work until backend is ready
- Some features are UI-only demonstrations

## 🔄 Status

- Frontend: ✅ Complete
- Backend: 🚧 In Progress
- Testing: ⏳ Pending
- Documentation: ✅ Complete
- Deployment: ⏳ Pending

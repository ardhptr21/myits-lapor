<div align="center">

# MyITS Lapor - Campus Reporting System

Aplikasi pelaporan dan pemantauan fasilitas kampus yang rusak untuk civitas ITS (Institut Teknologi Sepuluh Nopember).

https://myits-lapor.ardhptr21.space/

![myits logo](https://i.ibb.co.com/B2shmF5G/myits-lapor.jpg)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Installation & Setup](#️-installation--setup)
- [Demo & Screenshots](#-demo--screenshots)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Presentation Notes](#-presentation-notes)

## ⚠️ Problem Statement

### Masalah yang Diidentifikasi:

1. **Sistem Pelaporan Manual**: Civitas akademika ITS mengalami kesulitan dalam melaporkan kerusakan fasilitas kampus karena belum ada sistem digital yang terstruktur
2. **Tidak Ada Tracking Progress**: Laporan yang sudah dibuat seringkali tidak memiliki follow-up yang jelas dan tidak ada cara untuk memantau progress perbaikan
3. **Komunikasi Tidak Efektif**: Kurangnya transparansi antara pelapor dan tim maintenance dalam proses penanganan laporan
4. **Data Tidak Terstruktur**: Laporan kerusakan yang ada tidak tersimpan dalam database yang terorganisir, sehingga sulit untuk dianalisis dan ditindaklanjuti
5. **Duplikasi Laporan**: Tidak ada mekanisme untuk mencegah laporan ganda untuk masalah yang sama

### Target Pengguna:

- **Mahasiswa ITS**: Yang menemukan fasilitas rusak di area kampus
- **Dosen & Staff**: Yang membutuhkan fasilitas kampus dalam kondisi baik untuk kegiatan akademik
- **Tim Maintenance**: Yang bertugas menangani dan memperbaiki fasilitas kampus
- **Admin/Pengelola**: Yang perlu memantau dan mengatur prioritas perbaikan

## ✅ Solution

### Solusi yang Dikembangkan:

**MyITS Lapor** adalah aplikasi web full-stack yang menyediakan platform digital terintegrasi untuk:

1. **Sistem Pelaporan Digital**:

   - Interface yang user-friendly untuk melaporkan kerusakan fasilitas
   - Upload foto sebagai bukti kerusakan
   - Kategorisasi laporan berdasarkan jenis fasilitas dan tingkat urgensi

2. **Real-time Progress Tracking**:

   - Timeline visual untuk setiap laporan
   - Status update real-time (Pending → In Progress → Resolved)
   - Notifikasi otomatis untuk perubahan status

3. **Manajemen User dan Role**:

   - Sistem autentikasi yang aman dengan JWT
   - Role-based access (User, Admin, Maintenance)
   - Dashboard khusus untuk setiap role

4. **Database Terstruktur**:

   - Penyimpanan data laporan dalam MongoDB
   - Relasi data yang optimal antara user, laporan, dan progress
   - Search dan filter untuk memudahkan pencarian laporan

5. **Responsive Web Application**:
   - Dapat diakses dari desktop dan mobile
   - UI modern dengan Tailwind CSS dan shadcn/ui
   - Dark/Light theme support

### Keunggulan Solusi:

- **Efisiensi**: Mengurangi waktu pelaporan dari manual ke digital
- **Transparansi**: Semua pihak dapat melihat status real-time
- **Accountability**: History lengkap setiap laporan dan penanganannya
- **Data-Driven**: Analytics dan reporting untuk improvement kampus
- **Scalable**: Arsitektur modern yang dapat dikembangkan lebih lanjut

## 🚀 Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **Report Management**: Create, view, update, and delete reports
- **Progress Tracking**: Track report status and progress with timeline
- **Role-based Access**: Different access levels for users and administrators
- **File Uploads**: Support for uploading images and documents with reports
- **Real-time Updates**: Dynamic status updates and notifications
- **Responsive Design**: Modern UI that works on all devices

## 🏗️ Architecture

This project follows a modern full-stack architecture:

### Backend (Node.js + TypeScript)

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **File Storage**: Multer for handling file uploads
- **Validation**: Zod for runtime type checking and validation
- **Security**: bcrypt for password hashing, CORS enabled

### Frontend (React + TypeScript)

- **Framework**: React 19 with TypeScript and Vite
- **Routing**: React Router DOM v7
- **State Management**: TanStack React Query for server state
- **UI Components**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Theming**: next-themes for dark/light mode

## 📁 Project Structure

```
myits-lapor/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── domains/        # Business logic layer
│   │   ├── http/           # HTTP controllers/routes
│   │   ├── libs/           # Utility libraries (DB, JWT, etc.)
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── repositories/   # Data access layer
│   │   ├── services/       # Business logic services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── validators/     # Zod validation schemas
│   │   └── app.ts         # Main application entry point
│   └── uploads/           # File upload storage
│
├── frontend/               # React frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable React components
│       ├── contexts/      # React context providers
│       ├── hocs/          # Higher-order components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions
│       ├── libs/          # External libraries configuration
│       ├── pages/         # Page components
│       ├── types/         # TypeScript type definitions
│       └── validators/    # Frontend validation schemas
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended package manager)
- MongoDB database

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment variables file:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```env
HOST=127.0.0.1
PORT=8080
DATABASE_URL=mongodb://127.0.0.1:27017/myits-lapor
JWT_SECRET=your-secret-key
```

5. Start the development server:

```bash
pnpm dev
```

The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The frontend application will be available at `http://localhost:5173`

## 🎬 Demo & Screenshots

### Live Demo

> **🚀 Aplikasi sudah live dan dapat diakses!**
>
> 🌐 **Demo URL**: [https://myits-lapor.ardhptr21.space](https://myits-lapor.ardhptr21.space)
>
> Silakan kunjungi link di atas untuk mencoba langsung fitur-fitur aplikasi MyITS Lapor.

### Screenshot Aplikasi

#### 1. Landing Page & Authentication

```
🏠 Home Page: Interface utama dengan navigasi ke semua fitur
🔐 Login Page: Form login dengan validasi
📝 Register Page: Form registrasi user baru
```

#### 2. Report Management

```
📊 Reports Dashboard: Daftar semua laporan dengan filter dan search
➕ Create Report: Form untuk membuat laporan baru dengan upload foto
📋 Report Detail: Detail lengkap laporan dengan progress timeline
👤 My Reports: Laporan yang dibuat oleh user yang login
```

#### 3. Progress Tracking

```
📈 Progress Timeline: Visual timeline status laporan
🔄 Status Updates: Interface untuk update progress (admin only)
📱 Responsive Design: Tampilan optimal di semua device
```

### Key User Flows

#### Flow 1: Membuat Laporan Baru

1. User login ke aplikasi
2. Klik "Buat Laporan" atau navigate ke `/reports/create`
3. Isi form laporan (judul, deskripsi, kategori, lokasi)
4. Upload foto bukti kerusakan
5. Submit laporan
6. Laporan masuk dengan status "Pending"

#### Flow 2: Tracking Progress Laporan

1. User mengakses "My Reports" atau detail laporan
2. Melihat timeline progress real-time
3. Mendapat notifikasi saat ada update status
4. Dapat memberikan feedback atau komentar

#### Flow 3: Admin Management

1. Admin login dengan role admin
2. Akses dashboard admin untuk melihat semua laporan
3. Update status laporan (Pending → In Progress → Resolved)
4. Tambahkan progress notes dan estimated completion
5. Manage user roles dan permissions

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Report Endpoints

- `GET /reports` - Get all reports
- `POST /reports` - Create new report
- `GET /reports/:id` - Get specific report
- `PUT /reports/:id` - Update report
- `DELETE /reports/:id` - Delete report
- `POST /reports/:id/progress` - Add progress to report

### File Upload

- Static files served at `/uploads/`

## 🧪 Development Guide

### Quick Start (Development)

```bash
# 1. Clone repository
git clone https://github.com/ardhptr21/myits-lapor.git
cd myits-lapor

# 2. Setup Backend
cd backend
pnpm install
cp .env.example .env  # Configure your environment variables
pnpm dev             # Start backend server (port 8080)

# 3. Setup Frontend (new terminal)
cd ../frontend
pnpm install
pnpm dev           # Start frontend server (port 5173)
```

### Environment Configuration

Create `.env` file in `backend/` directory:

```env
# Database
DATABASE_URL=mongodb://127.0.0.1:27017/myits-lapor

# Server Configuration
HOST=127.0.0.1
PORT=8080

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# File Upload (optional)
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_EXTENSIONS=jpg,jpeg,png,pdf
```

### Backend Development

```bash
cd backend
pnpm dev          # Start development server with hot reload
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server
pnpm test         # Run tests (if available)
```

### Frontend Development

```bash
cd frontend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

### Database Setup

#### Option 1: Local MongoDB

```bash
# Install MongoDB locally or use MongoDB Compass
# Create database: myits-lapor
# Collections will be created automatically by Mongoose
```

#### Option 2: MongoDB Atlas (Cloud)

```bash
# 1. Create account at mongodb.com/atlas
# 2. Create new cluster
# 3. Get connection string
# 4. Update DATABASE_URL in .env file
```

### Testing the Application

1. **Backend Testing**:

   ```bash
   # Test API endpoints using curl or Postman
   curl -X GET http://localhost:8080/reports
   curl -X POST http://localhost:8080/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
   ```

2. **Frontend Testing**:
   - Navigate to `http://localhost:5173`
   - Test user registration and login
   - Create sample reports
   - Test responsive design on different screen sizes

## 📱 Features Overview

### User Management

- Secure user registration and login
- JWT-based authentication
- Role-based access control (User, Admin)

### Report System

- Create detailed reports with categories
- Upload supporting files and images
- Track report status (Pending, In Progress, Resolved)
- View report history and timeline

### Progress Tracking

- Add progress updates to reports
- Visual timeline of report progress
- Status management and updates

### User Interface

- Modern, responsive design
- Dark/light theme support
- Intuitive navigation and user experience
- Real-time feedback and notifications

## 🔧 Technology Stack

### Backend Technologies

- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Multer**: File upload handling
- **Zod**: Schema validation
- **CORS**: Cross-origin resource sharing

### Frontend Technologies

- **React 19**: JavaScript library for building user interfaces
- **TypeScript**: Static type checking
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **TanStack Query**: Server state management
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI components
- **React Hook Form**: Performant forms with easy validation
- **Axios**: HTTP client for API requests

## 🎤 Presentation Notes

### Poin-Poin Penting untuk Presentasi:

#### 1. Problem Identification & Solution

- **Problem**: Sistem pelaporan fasilitas kampus yang masih manual dan tidak terstruktur
- **Impact**: Keterlambatan penanganan, duplikasi laporan, kurangnya transparansi
- **Solution**: Platform digital terintegrasi dengan real-time tracking dan role-based access

#### 2. Technical Highlights

- **Full-Stack TypeScript**: Type safety dari frontend hingga backend
- **Modern React**: Hooks, Context API, dan component composition pattern
- **RESTful API**: Clean architecture dengan separation of concerns
- **Database Design**: Relational document structure dengan MongoDB
- **Authentication**: Secure JWT-based auth dengan bcrypt password hashing

#### 3. Key Features Demo Flow

1. **User Registration/Login** → Show authentication system
2. **Create Report** → Demonstrate form validation and file upload
3. **View Reports** → Show filtering, searching, and pagination
4. **Progress Tracking** → Display real-time status updates
5. **Admin Dashboard** → Role-based access and management features

#### 4. Code Quality & Best Practices

- **Clean Code**: Consistent naming conventions and code structure
- **Type Safety**: Comprehensive TypeScript usage
- **Validation**: Client-side and server-side validation with Zod
- **Error Handling**: Proper error boundaries and HTTP status codes
- **Security**: Protected routes, input sanitization, CORS configuration

#### 5. Scalability & Future Enhancements

- **Modular Architecture**: Easy to add new features
- **API Design**: RESTful patterns that can evolve
- **Component Reusability**: Shared UI components
- **Database Schema**: Flexible document structure for future fields

### Demo Script:

1. **Opening** (2 min): Problem statement dan solusi yang dibuat
2. **Architecture Overview** (3 min): Tech stack dan struktur project
3. **Live Demo** (10 min): User flow dari registration hingga report management
4. **Code Walkthrough** (5 min): Key features implementation
5. **Q&A** (5 min): Pertanyaan dan diskusi teknis

### Troubleshooting Demo:

- **Backup Plan**: Screenshots jika ada masalah koneksi
- **Local Development**: Pastikan server lokal running dengan sample data
- **Browser Compatibility**: Test di multiple browsers sebelum presentasi

## 👨‍💻 Developer

Aplikasi ini dibuat untuk keperluan penugasan mata kuliah Pemrograman Website 2025. Dibuat oleh:

| Data  | Keterangan          |
| ----- | ------------------- |
| Nama  | Ardhi Putra Pradana |
| NRP   | 5027241022          |
| Kelas | C                   |

### Pembelajaran yang Didapat:

- **Full-Stack Development**: Integrasi frontend-backend dengan TypeScript
- **Modern React Patterns**: Hooks, Context, dan component architecture
- **RESTful API Design**: Clean architecture dan separation of concerns
- **Database Modeling**: Document-based database design dengan MongoDB
- **Authentication & Authorization**: JWT implementation dan role-based access
- **UI/UX Design**: Modern interface dengan Tailwind CSS dan Radix UI

## 🚀 Deployment

### Production Checklist:

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Build process verified
- [ ] Static assets optimized
- [ ] Security headers configured
- [ ] CORS policy set for production domain

### Deployment Options:

- **Frontend**: Vercel, Netlify, atau GitHub Pages
- **Backend**: Railway, Render, atau DigitalOcean
- **Database**: MongoDB Atlas (recommended for production)

# PDF Highlight Hub

A modern full-stack web application for annotating, highlighting..

![PDF Highlight Hub](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18.20+-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green?style=flat-square&logo=mongodb)

## 🚀 Live Demo

- **Frontend**: [https://pdf-highlight-hub.vercel.app/](https://pdf-highlight-hub.vercel.app/)
- **Backend API**: [https://pdf-highlighthub.onrender.com](https://pdf-highlighthub.onrender.com)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication with signup/login
- 📄 **PDF Management** - Upload, view, and organize PDF documents
- ✏️ **PDF Annotation** - Interactive highlighting and annotation tools
- 🔍 **Advanced Search** - Full-text search across PDFs and annotations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates** - Live activity feed and instant UI updates
- 🎨 **Modern UI** - Clean, intuitive interface with dark theme
- 🔒 **Secure Storage** - Encrypted file storage and user data protection

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Rendering**: PDF.js with react-pdf
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 18.20+
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Security**: bcryptjs for password hashing
- **CORS**: Configured for cross-origin requests
- **Deployment**: Render

### Database
- **Primary**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Features**: Full-text search indexes, document relationships

## 📦 Installation

### Prerequisites
- Node.js 18.20 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/school_hub.git
   cd school_hub-main
2. Install dependencies:
    ```bash
    cd frontend
    npm install
3. Set up environment variables:
    ```bash
    MONGODB_UR=
    JWT_SECRET=
4. Run the project:
- Backend
    ```bash
    cd backend
    npm run start:dev
- Frontend
    ```bash
    cd frontend
    npm start

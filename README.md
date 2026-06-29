# 🩸 BloodNet - Blood Donation Platform

BloodNet is a full-stack MERN-based blood donation platform that connects blood donors with recipients in a fast, secure, and user-friendly way. The platform provides role-based dashboards for Donors, Volunteers, and Administrators to efficiently manage blood donation requests while also supporting online funding through Stripe.

---

## 🌐 Live Website

🔗 https://blood-net-u4rt.vercel.app

---

## 🚀 Project Purpose

The primary goal of BloodNet is to simplify the blood donation process by allowing users to:

- Find blood donors based on blood group and location.
- Create and manage blood donation requests.
- Connect donors with recipients quickly.
- Manage users and donation requests through role-based dashboards.
- Support blood donation organizations through secure online funding.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure authentication with Better Auth
- JWT protected private APIs
- Role-based access (Admin, Volunteer, Donor)
- Protected routes

### 👤 User Management
- User Registration & Login
- Profile Update
- Blood Group Selection
- District & Upazila Selection
- Avatar Upload
- Active / Blocked User Management

### 🩸 Blood Donation
- Create Blood Donation Requests
- Edit & Delete Requests
- Donation Request Details
- Donate Blood Workflow
- Donation Status Management
- Recent Donation History
- Public Donation Request Listing

### 🔍 Donor Search
- Search donors by:
  - Blood Group
  - District
  - Upazila

### 💰 Funding System
- Stripe Payment Integration
- Funding History
- Total Funding Statistics
- Secure Checkout

### 📊 Dashboard
#### Admin
- Dashboard Statistics
- User Management
- Blood Request Management
- Funding Statistics

#### Volunteer
- View All Blood Requests
- Update Donation Status

#### Donor
- Manage Own Requests
- Donation History
- Funding History

### 🎨 UI/UX
- Responsive Design
- Premium Dashboard
- Modern Cards & Tables
- Mobile Friendly
- Loading UI
- Custom 404 Page
- Error Handling

---

# 🛠️ Technology Stack

### Frontend

- Next.js 16
- React
- Tailwind CSS
- Better Auth
- React Hook Form
- Lucide React
- React Icons
- React Hot Toast
- Framer Motion

### Backend

- Node.js
- Express.js
- MongoDB
- JWT
- Stripe
- CORS
- Dotenv

---

# 📦 NPM Packages Used

## Client

```bash
next
react
tailwindcss
better-auth
lucide-react
react-hook-form
react-hot-toast
framer-motion
react-icons
```

## Server

```bash
express
mongodb
jsonwebtoken
cors
dotenv
stripe
```

---


# 📂 Project Structure

```
Client
│
├── app
├── components
├── lib
├── constants
├── public
└── utils

Server
│
├── routes
└── index.js
```

---

### Clone the repositories

```bash
git clone <client-repo>
git clone <server-repo>
```

### Client

```bash
npm install
npm run dev
```

### Server

```bash
npm install
npm start
```

---

# 👨‍💻 Admin Credentials

```
Email:
Password:
```

---


### Client

https://github.com/your-client-repository

### Server

https://github.com/your-server-repository

---

# 📜 License

This project was developed for educational purposes as part of a MERN Stack assignment.
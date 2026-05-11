# 📚 SHELF — Campus Peer-to-Peer Marketplace

**SHELF** is a modern, campus-exclusive marketplace designed specifically for verified college students. It enables students to buy, sell, and trade items within their own university ecosystem securely and efficiently.

![Project Preview](https://via.placeholder.com/1200x600/FF3300/FFFFFF?text=SHELF+CAMPUS+MARKETPLACE)

## 🚀 Key Features

- **🎓 Campus Verification**: Exclusive access via student roll numbers.
- **💬 Real-time Chat**: Integrated messaging with instant notifications.
- **💰 Smart Offers**: Negotiate prices directly with a custom offer system (Accept/Decline/Counter).
- **🛡️ Trust System**: Dynamic trust scores based on successful trades and user ratings.
- **📸 Multi-step Posting**: A seamless 4-step wizard for creating detailed listings with image uploads.
- **🔍 Advanced Search**: Filter by category, price, condition, and campus area.
- **🛡️ Admin Moderation**: Robust dashboard for managing users and reviewing reported content.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS (Modern, Responsive Design)
- **Icons**: Lucide React
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (JSON Web Tokens) with OTP verification
- **Media**: Cloudinary (Image Hosting)
- **Socket**: Socket.IO for real-time messaging

## 📦 Project Structure

```bash
shelf-app/
├── backend/            # Express API & Socket server
│   ├── src/
│   │   ├── modules/    # Domain-driven modules (Auth, Listings, Chat)
│   │   ├── config/     # DB & App configurations
│   │   └── utils/      # Helpers (Cloudinary, Email)
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # View components
│   │   └── data.js     # Shared constants & mock data
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🔐 Credentials for Testing

| Role | Roll Number | Password |
|---|---|---|
| **Student** | `2300000000000` | *any* |
| **Admin** | `2100000000001` | *any* |

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License.

---
Built with ❤️ by [Farhan](https://github.com/FarhanAnsari124) for students, by students.

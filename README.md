# 🏋️ Ahilyanagar Armwrestling - Online Registration Portal

A full-stack online registration portal for the Ahilyanagar Armwrestling Championship, featuring UPI payment integration, real-time form validation, and an admin dashboard.

![Ahilyanagar Armwrestling](./Client/public/logo.jpeg)
---

## 📋 Features

- ✅ **Online Registration Form** with full validation (Zod + React Hook Form)
- ✅ **Cashfree Payment Gateway** integration (Live)
- ✅ **Dynamic UPI QR Code** for zero-fee payments
- ✅ **Mobile Optimized** — UPI deep links for GPay, PhonePe, Paytm
- ✅ **Desktop Support** — QR code scanning
- ✅ **Payment Verification** — server-side verification via Cashfree API
- ✅ **Duplicate Payment Protection** — prevents double registration
- ✅ **Amount Verification** — prevents tampered payment amounts
- ✅ **Admin Dashboard** — view all registrations
- ✅ **Success/Failure Pages** with retry logic
- ✅ **Webhook Support** — backup registration saving
- ✅ **Fully Responsive** — mobile first design
- ✅ **Animated UI** — Framer Motion animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Tailwind CSS | Styling |
| Shadcn UI | UI Components |
| React Hook Form | Form management |
| Zod | Form validation |
| Framer Motion | Animations |
| React Router DOM | Routing |
| qrcode.react | Dynamic UPI QR generation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Backend framework |
| MongoDB + Mongoose | Database |
| Cashfree PG SDK | Payment gateway |
| Axios | HTTP requests |
| dotenv | Environment variables |
| CORS | Cross-origin handling |

---

## 📁 Project Structure

OnlineRegistrationForm/
│
├── Client/                          # React Frontend
│   ├── public/
│   │   └── logo.jpeg
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── RegistrationForm.jsx # Main registration form
│   │   │   ├── Success.jsx          # Payment success/verify page
│   │   │   └── AdminPage.jsx        # Admin dashboard
│   │   ├── components/
│   │   │   └── ui/                  # Shadcn components
│   │   ├── helpers/
│   │   │   ├── getEnv.js            # Environment variable helper
│   │   │   └── showToast.js         # Toast notification helper
│   │   ├── App.jsx                  # Routes
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
└── Server/                          # Express Backend
├── controllers/
│   ├── payment.controller.js    # Cashfree payment logic
│   └── registration.controller.js
├── models/
│   └── user.model.js            # MongoDB schema
├── routes/
│   ├── payment.routes.js
│   └── registration.routes.js
├── .env
├── index.js                     # Entry point
└── package.json


---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cashfree account (for payment gateway)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ahilyanagar-armwrestling.git
cd ahilyanagar-armwrestling
```

### 2. Setup Backend

```bash
cd Server
npm install
```

Create `.env` file in `Server/`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_WEBHOOK_SECRET=your_cashfree_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd Client
npm install
```

Create `.env` file in `Client/`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

Start frontend:

```bash
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`Server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 3000) |
| `MONGO_URI` | MongoDB connection string |
| `CASHFREE_APP_ID` | Cashfree App ID |
| `CASHFREE_SECRET_KEY` | Cashfree Secret Key |
| `CASHFREE_WEBHOOK_SECRET` | Same as secret key |
| `FRONTEND_URL` | Frontend URL for CORS & redirects |
| `NODE_ENV` | `development` or `production` |

### Frontend (`Client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_NODE_ENV` | `development` or `production` |

---

---

## 🔒 Security Features

- ✅ **Duplicate payment protection** — same order never saved twice
- ✅ **Server-side payment verification** — never trust frontend
- ✅ **Amount verification** — prevents tampered amounts
- ✅ **Webhook backup** — saves registration even if user closes browser
- ✅ **Retry logic** — frontend retries 3 times on network failure
- ✅ **Audit trail** — orderId, paymentId, paidAt all saved in DB
- ✅ **CORS protection** — only allowed origins can access API

---

## 📱 API Endpoints

### Payment Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/create-order` | Create Cashfree order |
| POST | `/api/payment/verify` | Verify payment + save registration |
| POST | `/api/payment/webhook` | Cashfree webhook handler |

### Registration Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/registration/all` | Get all registrations (admin) |
| POST | `/api/registration/save` | Save registration directly |

---

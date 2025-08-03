# Digital Wallet API | CashTaka

A secure, modular, and role-based backend API for a digital wallet system built with **Express.js** and **Mongoose**.  
This project simulates core features similar to popular digital wallets like Bkash or Nagad.

---
Live Deployment Link : https://cash-tk-backend.vercel.app/

---

## 🚀 Features

- **JWT Authentication** with 3 roles: Admin, User, Agent  
- **Secure password hashing** with bcrypt  
- Automatic **wallet creation** on registration (initial balance ৳50)  
- Users can:
  - Add money (top-up)  
  - Withdraw money  
  - Send money to other users  
  - View their transaction history  
- Agents can:
  - Add money (cash-in) to any user's wallet  
  - Withdraw money (cash-out) from any user's wallet  
- Admins can:
  - View all users, wallets, agents, and transactions  
  - Block/unblock wallets  
  - Approve or suspend agents  
- All transactions are stored and trackable  
- Role-based route protection and access control  
- Input validation using **Zod**  
- Pagination and sorting for transaction history  

---

## 🧱 Tech Stack

- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JWT for authentication  
- bcrypt for password hashing  
- Zod for schema validation  

---

## 📦 Installation

1. Clone the repository  
```bash
git clone https://github.com/Ananna-Datta/CashTaka_Backend.git
cd CashTaka_Backend

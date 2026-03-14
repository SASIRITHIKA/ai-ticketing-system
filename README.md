# 🎫 AI-Based Customer Support Ticket Classification System for Zoho

![Project Banner](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.12-green?style=for-the-badge&logo=python)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Local-47A248?style=for-the-badge&logo=mongodb)

> An intelligent customer support ticket classification system that uses AI/ML to automatically classify, prioritize, summarize, and route support tickets to the appropriate team.

---

## 🚀 Features

- 🤖 **AI-Powered Classification** — Automatically classifies tickets into 5 categories using scikit-learn
- 🔥 **Priority Assignment** — Assigns Low / Medium / High / Critical priority based on ticket content
- 📝 **AI Summary** — Generates a 2-line summary of every ticket automatically
- 🏃 **Auto Routing** — Routes tickets to the correct support team automatically
- 🔐 **Role-Based Access Control** — Each team sees only their assigned tickets
- 👤 **Admin Management** — Admin can create team accounts, override AI classification, view analytics
- 📊 **Dashboard Analytics** — Stats, category breakdown, priority breakdown, team breakdown

---

## 🛠️ Tech Stack

### Frontend
- **Vite + React.js** — Fast, modern frontend
- **Tailwind CSS v3** — Utility-first styling
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **CORS** — Cross-origin resource sharing

### AI Model
- **Python 3.12** — AI service
- **Flask** — AI microservice API
- **Scikit-learn** — ML model (Random Forest Classifier)
- **TF-IDF Vectorizer** — Text feature extraction
- **Pandas + NumPy** — Data processing
- **Joblib** — Model serialization

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Customer** | Register, submit tickets, view own ticket status and team response |
| **Admin** | View ALL tickets, manage users, create team accounts, override AI classification, view analytics |
| **Technical Team** | View & resolve only Technical Problem tickets |
| **Finance Team** | View & resolve only Billing Issue tickets |
| **Product Team** | View & resolve only Feature Request tickets |
| **General Team** | View & resolve Account Management & General Query tickets |

---

## 🤖 AI Categories

| Category | Assigned Team |
|----------|--------------|
| Billing Issue | Finance Team |
| Technical Problem | Technical Team |
| Feature Request | Product Team |
| Account Management | General Team |
| General Query | General Team |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- Python 3.12
- MongoDB (local installation)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/zoho-ticket-system.git
cd zoho-ticket-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend/:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zoho_tickets
JWT_SECRET=zoho_secret_key_2026
AI_SERVICE_URL=http://localhost:8000
```

### 3. AI Model Setup
```bash
cd ai-model
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash
# or
venv\Scripts\activate  # Windows CMD
# or
source venv/bin/activate  # Mac/Linux

pip install flask scikit-learn pandas numpy
python train_model.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

---

## ▶️ Running the Project

You need **3 terminals** running simultaneously:

**Terminal 1 — Backend (Port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — AI Model (Port 8000):**
```bash
cd ai-model
source venv/Scripts/activate
python app.py
```

**Terminal 3 — Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔄 How It Works

```
Customer submits ticket
        ↓
Backend receives ticket text
        ↓
Calls Python Flask AI API (Port 8000)
        ↓
AI classifies category + assigns priority + generates 2-line summary
        ↓
Ticket saved to MongoDB with all AI results
        ↓
Auto-routed to correct team
        ↓
Team views and resolves ticket with remarks
        ↓
Customer sees status update and team response
```

---

## 🔐 API Endpoints

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Customer registration |
| POST | `/api/auth/login` | Public | User login |
| GET | `/api/auth/me` | Protected | Get current user |

### Ticket Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tickets` | Customer | Submit new ticket |
| GET | `/api/tickets/my` | Customer | Get own tickets |
| GET | `/api/tickets/team` | Team | Get assigned tickets |
| PUT | `/api/tickets/:id/resolve` | Team | Resolve ticket with remarks |
| GET | `/api/tickets/:id` | Protected | Get single ticket |

### Admin Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/tickets` | Admin | Get all tickets |
| PUT | `/api/admin/tickets/:id` | Admin | Override classification |
| GET | `/api/admin/users` | Admin | Get all users |
| POST | `/api/admin/users` | Admin | Create team member |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/stats` | Admin | Get dashboard stats |

### AI Routes (Flask - Port 8000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/predict` | Classify single ticket |
| POST | `/predict/batch` | Classify multiple tickets |

---

## 🧪 Test Credentials

> ⚠️ These are for development/testing only.

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.com | 123456 |
| Admin | admin@test.com | 123456 |
| Finance Team | finance@test.com | 123456 |
| Technical Team | technical@test.com | 123456 |
| Product Team | product@test.com | 123456 |
| General Team | general@test.com | 123456 |

---

## 📊 AI Model Details

- **Algorithm:** Random Forest Classifier
- **Text Vectorization:** TF-IDF (Term Frequency-Inverse Document Frequency)
- **N-gram Range:** (1, 2) — unigrams and bigrams
- **Max Features:** 5000
- **Training Split:** 80% train, 20% test
- **Models Saved:** `category_classifier.pkl`, `priority_classifier.pkl`

---

## 🔒 Security Features

- JWT-based authentication with 7-day expiry
- Password hashing using bcryptjs
- Role-based access control on all routes
- Team members can only see their own assigned tickets
- Admin cannot be deleted
- Only admin can create team member accounts

---

## 🚀 Future Improvements

- [ ] Email notifications when ticket is resolved
- [ ] Ticket search and pagination
- [ ] Charts and graphs in admin dashboard
- [ ] More training data for better AI accuracy
- [ ] Multi-language support
- [ ] Mobile responsive improvements
- [ ] Cloud deployment (Railway + Vercel)

---

## 📄 License

This project is for academic purposes only.

---

## 🙏 Acknowledgements

- [Zoho Desk API Documentation](https://www.zoho.com/desk/api/)
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [IEEE Std 830-1998 – SRS Standard](https://ieeexplore.ieee.org/document/720574)
- [Jurafsky & Martin – Speech and Language Processing](https://web.stanford.edu/~jurafsky/slp3/)

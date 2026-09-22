# 🎓 Alumni Tracking System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Workflow](https://img.shields.io/badge/GitHub-Workflow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rumeysa478/alumni)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **3rd Year Web Programming Course Project — An end-to-end web platform connecting university alumni, current students, and faculty.**

---

## 📌 Project Overview

The **Alumni Tracking System** is a modern web application designed to bridge the gap between university graduates, current students, and the institution. It serves as an active networking platform where alumni can track their career milestones, share job and internship opportunities, connect with other graduates, and participate in academic and social events.

This project is developed as part of the **3rd Year Web Programming Course**, adhering to industry-standard software engineering practices, containerized microservices, relational database design, and collaborative Git workflows.

---

## ✨ Key Features

- **👤 Alumni Profiles & Portfolio Management:**
  - Comprehensive academic history (faculty, department, graduation year, degree).
  - Career journey tracking (current employer, position, industry, location, LinkedIn & GitHub profiles).
  - Skills, certifications, and portfolio links.
- **💼 Job & Internship Board:**
  - Alumni and verified employers can post job and internship openings.
  - Search, filter, and apply for open positions.
- **🔍 Advanced Search & Directory:**
  - Multi-criteria filtering by graduation year, department, company, sector, and location.
  - Full-text search for finding peers and mentors.
- **📅 Events & Announcements:**
  - University reunions, webinars, career fairs, and departmental announcements.
  - Event registration and RSVP tracking.
- **🔒 Authentication & Role-Based Access Control (RBAC):**
  - Secure authentication using JWT (JSON Web Tokens) and password hashing with `bcrypt`.
  - Distinct permission tiers: **Admin**, **Alumni**, and **Student**.
- **🛡️ Administrative Dashboard:**
  - Verification and approval workflow for new alumni registrations against university records.
  - Moderation of job posts and public announcements.
  - Statistical insights and analytics (employment rates, industry distribution, geographic dispersion).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose / Rationale |
| :--- | :--- | :--- |
| **Backend** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) | High-performance, asynchronous RESTful API architecture |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Reliable relational database with ACID compliance and indexing |
| **ORM / Query Builder** | Prisma / Sequelize / pg | Type-safe database queries, schema migrations, and seeding |
| **Containerization** | [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) | Consistent, isolated development and production environments |
| **Version Control & CI/CD** | [Git](https://git-scm.com/) & [GitHub](https://github.com/) | Branching strategy, issue tracking, code reviews, and automated workflows |
| **Security & Auth** | JWT & Bcrypt | Stateless session management and secure credential hashing |
| **Frontend** | HTML5, CSS3 / Tailwind CSS, Modern JavaScript | Responsive, accessible, and intuitive user interface |

---

## 📂 System Architecture & Directory Structure

```plaintext
alumni/
├── .github/                  # GitHub Actions CI/CD workflows & issue templates
│   └── workflows/
├── docker/                   # Docker configuration files
│   ├── Dockerfile            # Application container configuration
│   └── Dockerfile.dev        # Development container configuration
├── src/
│   ├── config/               # Database, environment, and third-party configs
│   ├── controllers/          # Route handlers & request validation
│   ├── middlewares/          # Authentication, error handling & logging middlewares
│   ├── models/               # Database schemas & ORM entities
│   ├── routes/               # Modular REST API routes
│   ├── services/             # Core business logic and external integrations
│   ├── utils/                # Helper functions, constants, and custom loggers
│   └── server.js             # Application entry point
├── .env.example              # Sample environment variables template
├── .gitignore                # Git ignore rules
├── docker-compose.yml        # Docker Compose configuration (App + PostgreSQL)
├── package.json              # Project dependencies and npm scripts
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/) (Recommended)
- [Git](https://git-scm.com/)

---

### Option 1: Running with Docker (Recommended) 🐳

Run the entire stack (Node.js API + PostgreSQL) in isolated containers with a single command:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rumeysa478/alumni.git
   cd alumni
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Build and start services:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Web App / API: `http://localhost:3000`
   - PostgreSQL Database: `localhost:5432`

To stop the containers:
```bash
docker compose down
```

---

### Option 2: Local Manual Setup 💻

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create and configure `.env`:**
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:password@localhost:5432/alumni_db
   JWT_SECRET=your_jwt_super_secret_key
   JWT_EXPIRES_IN=7d
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev  # or your respective ORM migration command
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🌿 Git & GitHub Collaboration Guidelines

To maintain code quality and a clear commit history, team members should adhere to the following standards:

### Branch Strategy
- `main`: Production-ready, stable code only. Direct commits to `main` are restricted.
- `develop`: Integration branch for ongoing development.
- `feature/<feature-name>`: Feature branches branched off `develop` (e.g., `feature/auth-jwt`, `feature/alumni-search`).
- `bugfix/<bug-name>`: Bug fixes (e.g., `bugfix/profile-update-error`).

### Commit Message Convention (Conventional Commits)
Follow semantic commit messages:
- `feat:` A new feature (e.g., `feat: implement alumni directory search filter`)
- `fix:` A bug fix (e.g., `fix: correct token expiry handling`)
- `docs:` Documentation updates only (e.g., `docs: update api endpoints table`)
- `refactor:` Code restructuring without changing functionality
- `test:` Adding or updating unit/integration tests
- `chore:` Maintenance tasks, dependency updates, build configurations

### Pull Request (PR) Workflow
1. Create a feature branch from `develop`.
2. Commit your changes following the commit guidelines.
3. Open a Pull Request into `develop`.
4. Request at least one peer code review before merging.

---

## 🗺️ Project Milestones & Roadmap

- [x] **Milestone 1:** Project requirements definition & architectural design
- [ ] **Milestone 2:** PostgreSQL database schema design & E-R diagram
- [ ] **Milestone 3:** Docker & Docker Compose setup
- [ ] **Milestone 4:** Core REST API & JWT-based authentication
- [ ] **Milestone 5:** Alumni profiles, search/filter, and job board modules
- [ ] **Milestone 6:** Admin verification panel & system analytics
- [ ] **Milestone 7:** Frontend integration & UI/UX testing
- [ ] **Milestone 8:** Final testing, deployment, and presentation

---

## 👥 Contributors

- **Rumeysa Aydın** — *Developer / Project Lead* — [@rumeysa478](https://github.com/rumeysa478)

---

## 📄 License

This project is developed for educational purposes under the **Web Programming** course and is licensed under the [MIT License](LICENSE).

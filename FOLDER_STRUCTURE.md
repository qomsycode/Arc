# ARCademy — Full Project Folder Structure

> **Stack**: React (Vite + TypeScript) · Express.js · Supabase (PostgreSQL) · Solidity (Arc L1)
> **Architecture**: Frontend → Backend API → Smart Contracts + Supabase Database

---

## Root Layout

```
Arc Project/
├── frontend/              # React (TypeScript) UI — what users see
├── backend/               # Express.js API — the brain/coordinator
├── contracts/             # Solidity Smart Contracts — on-chain payment logic
├── database/              # Supabase PostgreSQL — off-chain data records
├── ui_design_mockups/     # UI screens for all 8 Phase 1 pages
└── FOLDER_STRUCTURE.md    # This file
```

---

## 📁 frontend/
> React + Vite + TypeScript. All UI, pages, and user interactions.

```
frontend/
├── public/                        # Static assets (favicon, images)
├── src/
│   ├── components/                # Reusable UI pieces
│   │   ├── Navbar.tsx             # Top/side navigation bar
│   │   ├── Sidebar.tsx            # Dashboard sidebar
│   │   ├── LessonCard.tsx         # Card for each lesson
│   │   ├── QuizModal.tsx          # Quiz popup with MCQ options
│   │   ├── SubmissionForm.tsx     # Build challenge submission form
│   │   ├── CertificateCard.tsx    # Certificate of completion card
│   │   └── WalletBadge.tsx        # Wallet address + USDC balance display
│   │
│   ├── contexts/                  # Global state providers (React Context)
│   │   ├── AuthContext.tsx        # Privy login state (user, wallet, session)
│   │   └── WalletContext.tsx      # Arc L1 wallet connection & USDC balance
│   │
│   ├── views/                     # Full page views/screens
│   │   ├── LoginPage.tsx          # Screen 1 — Privy Gmail login + wallet connect
│   │   ├── Dashboard.tsx          # Screen 2 — Student home (XP, USDC, progress)
│   │   ├── LearnPage.tsx          # Screen 3 — Learning path & lesson list
│   │   ├── LessonView.tsx         # Screen 3b — Single lesson reading + quiz trigger
│   │   ├── QuizPage.tsx           # Screen 4 — Quiz questions, grading, reward
│   │   ├── BuildPage.tsx          # Screen 5 — Challenges list & submission form
│   │   ├── PortfolioPage.tsx      # Screen 8 — Public developer profile
│   │   ├── CertificatePage.tsx    # Screen 7 — Certificate + rewards audit log
│   │   └── AdminPortal.tsx        # Screen 6 — Reviewer queue & project approval
│   │
│   ├── types/                     # TypeScript interfaces
│   │   ├── user.ts                # User, Profile, WalletType definitions
│   │   ├── lesson.ts              # Lesson, Module, Progress definitions
│   │   └── submission.ts          # Challenge, Submission, Review definitions
│   │
│   ├── utils/                     # Helper functions
│   │   ├── api.ts                 # Axios/fetch wrapper to call backend routes
│   │   ├── arcChain.ts            # Arc L1 chain config (Chain ID, RPC URL)
│   │   └── formatters.ts          # Format wallet address, USDC amounts, dates
│   │
│   ├── App.tsx                    # Root app + React Router route definitions
│   ├── main.tsx                   # React entry point (renders App)
│   └── index.css                  # Global dark mode styles & design system
│
├── index.html                     # HTML shell template (loads React)
├── package.json                   # Frontend dependencies (React, Privy, Vite)
└── vite.config.ts                 # Vite dev server (port 3000)
```

---

## 📁 backend/
> Express.js API server. Coordinates frontend requests, Supabase queries, and smart contract calls.
> **Structure mirrors your bootcamp MVC pattern.**

```
backend/
├── config/
│   └── supabase.js                # Supabase client initialization
│
├── db/
│   └── supabaseClient.js          # Exports the reusable Supabase connection
│
├── models/                        # Database query functions (Supabase)
│   ├── userModel.js               # CRUD for profiles table
│   ├── progressModel.js           # Read/write user_progress table
│   ├── submissionModel.js         # CRUD for submissions table
│   └── rewardsModel.js            # Insert/read rewards_log table
│
├── controllers/                   # Handle req/res — call models & services
│   ├── authController.js          # Sync Privy user → create/get Supabase profile
│   ├── quizController.js          # Grade quiz answers, trigger reward if passed
│   └── submissionController.js    # Create submission, reviewer approve/reject
│
├── routes/                        # URL endpoint definitions
│   ├── authRoutes.js              # POST /api/auth/sync
│   ├── quizRoutes.js              # POST /api/quiz/grade
│   └── submissionRoutes.js        # POST /api/submissions/create
│                                  # PATCH /api/submissions/:id/review
│
├── middlewares/
│   └── authMiddleware.js          # Verify Privy JWT token on protected routes
│
├── index.js                       # Express server entry point
└── package.json                   # Backend dependencies (express, cors, dotenv)
```

---

## 📁 contracts/
> Solidity smart contracts. Deployed on Arc L1 blockchain. Handle all on-chain USDC payments.
> **Arc L1 is EVM-compatible — same as Ethereum. Written in Solidity.**

```
contracts/
├── RewardDistributor.sol          # Sends USDC micropayments to students on quiz pass
├── ChallengeEscrow.sol            # Locks bounty USDC, releases on reviewer approval
├── scripts/
│   └── deploy.js                  # Hardhat deploy script (deploys to Arc L1 testnet)
├── test/
│   └── escrow.test.js             # Contract unit tests
├── hardhat.config.js              # Hardhat + Arc L1 RPC config
└── package.json                   # Hardhat + ethers.js dependencies
```

### How the contracts work (plain English):

| Contract | What it does |
| :--- | :--- |
| `RewardDistributor.sol` | When a student passes a quiz, the backend calls this contract. It automatically sends **0.05 USDC** from the platform treasury wallet to the student's Arc L1 wallet. |
| `ChallengeEscrow.sol` | When a build challenge is created, **$20 USDC** is locked into this contract. When a reviewer approves the submission, the contract releases the $20 USDC directly to the student's wallet. No manual transfer needed. |

---

## 📁 database/
> Supabase (PostgreSQL). Stores all off-chain data: user profiles, lesson progress, submissions, rewards.

```
database/
└── schema.sql                     # All table definitions to paste into Supabase dashboard
```

### Tables at a glance:

| Table | Purpose |
| :--- | :--- |
| `profiles` | User accounts — wallet address, XP, role (student/reviewer/admin) |
| `user_progress` | Tracks which lessons each student completed and their quiz scores |
| `submissions` | Build challenge submissions — GitHub URL, live demo, review status |
| `rewards_log` | Every USDC payout — amount, type (quiz/challenge), on-chain tx_hash |

---

## 📁 ui_design_mockups/
> Visual reference for all 8 Phase 1 screens. Use these during development to match the design.

```
ui_design_mockups/
├── 1_login_onboarding.jpg         # Privy Gmail login + wallet connect
├── 2_student_dashboard.jpg        # Stats, balance, lesson progress
├── 3_lesson_learning_center.jpg   # Lesson content + code examples
├── 4_quiz_system.jpg              # Multiple choice + reward trigger
├── 5_build_submission.jpg         # Challenge brief + submission form
├── 6_developer_portfolio.jpg      # Verified public developer profile
├── 7_admin_reviewer_portal.jpg    # Review queue + approve/reject
├── 8_certificate_rewards_audit.jpg # Certificate + USDC audit log
└── README.md                      # Phase 1 UI audit & compliance table
```

---

## How The Layers Connect

```
User (Browser)
    ↕
frontend/          ← React UI (Privy login, show balance, submit quiz)
    ↕
backend/           ← Express API (grade quiz, sync user, record reward)
    ↕          ↘
database/       contracts/    ← Supabase stores records; Contract sends USDC on-chain
                    ↕
              Arc L1 Blockchain   ← Final settlement layer
```

---

## Build Status

| Layer | Status |
| :--- | :--- |
| Folder structure | ✅ Done |
| Database schema | ✅ Done |
| UI Mockups (8 screens) | ✅ Done |
| Frontend components | 🔲 Not started |
| Backend routes & controllers | 🔲 Not started |
| Smart contracts | 🔲 Not started |

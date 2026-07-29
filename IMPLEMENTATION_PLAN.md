# ARCademy — Full Implementation Plan

> **Platform**: Learn. Build. Earn on Arc L1 Blockchain.
> **Stack**: React (Vite + TypeScript) · Express.js · Supabase · Solidity (Arc L1)
> **Auth**: Privy (Gmail login → auto Arc L1 wallet + external wallet connect)
> **Payment**: USDC on Arc L1 (quiz micropayments + build challenge escrow bounties)

---

## What We Are Building

ARCademy is a **Learn-to-Earn** developer education platform on the Arc L1 Blockchain. It has three core pillars:

| Pillar | What It Means |
| :--- | :--- |
| **Learn** | Students go through structured blockchain development courses with reading material, code examples, and quizzes |
| **Build** | Students complete real coding challenges and submit GitHub repos + live demos for human review |
| **Earn** | Students earn **real USDC** — micropayments for passing quizzes + bounties for approved build challenges |

---

## Tech Stack Decisions

| Layer | Technology | Why |
| :--- | :--- | :--- |
| Frontend | React + Vite + TypeScript | Fast dev server, type safety, component-based UI |
| Auth | Privy | Allows Gmail login AND auto-generates an Arc L1 wallet for new users |
| Backend | Express.js | Lightweight, MVC pattern matches your bootcamp knowledge |
| Database | Supabase (PostgreSQL) | Stores user profiles, progress, submissions, and rewards off-chain |
| Payments | USDC on Arc L1 | Stable coin, no price volatility for students receiving rewards |
| Smart Contracts | Solidity (Arc L1 EVM) | Handles on-chain payment logic — quiz rewards + challenge escrow |
| Contract Tooling | Hardhat | Compiles, tests, and deploys Solidity contracts to Arc L1 |

---

## How Payments Work (Plain English)

### Quiz Micropayment

> ⚠️ **Design Rule (Collaborator Feedback)**: The reward amount is **hidden during the quiz**. Users must complete ALL questions before they can see their score or claim any USDC. This prevents early exits and keeps the quiz feeling like a real assessment.

```
Student answers ALL questions (reward amount hidden throughout)
  → Student submits the full quiz
  → Backend grades all answers together
  → IF score ≥ 75%:
      → Results screen shows: "You Passed! Claim your reward"
      → Student clicks "Claim USDC" button
      → Backend calls RewardDistributor.sol contract on Arc L1
      → Contract sends USDC from platform treasury → Student wallet
      → Backend logs tx_hash in Supabase rewards_log table
  → IF score < 75%:
      → Results screen shows: "You did not pass. Try again."
      → No reward sent. Retry button shown.
```

### Build Challenge Bounty
```
Admin locks $20 USDC into ChallengeEscrow.sol (on-chain)
  → Student submits GitHub URL + Live Demo URL
  → Reviewer inspects and approves on Admin Portal
  → Backend calls ChallengeEscrow.sol contract
  → Contract releases $20 USDC → Student's Arc L1 wallet
  → Supabase updates submission status to "approved"
```

---

## Smart Contracts (Arc L1 — Solidity)

### `RewardDistributor.sol`
- **Purpose**: Distributes USDC micropayments to students after quiz completion
- **Called by**: Backend (Express.js) after grading a quiz
- **Phase**: Built in Phase 3

### `ChallengeEscrow.sol`
- **Purpose**: Locks challenge bounty USDC on-chain. Only releases when reviewer approves
- **Called by**: Backend (Express.js) when reviewer clicks "Approve"
- **Phase**: Built in Phase 3

> **Note**: Arc L1 is EVM-compatible (same as Ethereum), so contracts are written in Solidity — the standard language for Ethereum smart contracts.

## Admin Dashboard (Reviewer & Admin Operations)

The admin portal is a protected area (only users with role `admin` or `reviewer` can access). It provides:

- **Review Queue** – list of all pending build‑challenge submissions.
- **Treasury View** – total USDC locked in escrow contracts.
- **Challenge Management** – create, edit or close challenges and lock the bounty amount on‑chain.
- **User Management** – list of all users, ability to assign `reviewer` role.
- **Rewards Log** – searchable table of every USDC payout (quiz reward or challenge bounty) with transaction hash.

### Review Queue Flow
1. Student submits a challenge → entry appears in the queue with status **Pending**.
2. Reviewer opens the submission, checks the GitHub repo, live demo and the on‑chain wallet address.
3. Reviewer fills out a short feedback form and chooses **Approve** or **Request Revision**.
   - **Approve** → backend calls `ChallengeEscrow.sol` to release the locked USDC to the student’s wallet, updates the submission status to `approved`, and writes a record to `rewards_log`.
   - **Request Revision** → status set to `needs_improvement`; no funds are moved; student receives the reviewer’s comments.

### Security Controls
- All admin endpoints are behind `authMiddleware` and check `req.user.role`.
- The backend only allows contract calls from the platform treasury wallet (private key stored in `backend/.env`).
- Supabase Row‑Level Security policies restrict reviewers to read all submissions but only admins can edit challenge definitions or treasury settings.


---

## Database Tables (Supabase)

| Table | What it stores |
| :--- | :--- |
| `profiles` | User accounts — wallet address, XP points, role (student / reviewer / admin) |
| `user_progress` | Which lessons each student completed and their quiz scores |
| `submissions` | Build challenge submissions — GitHub URL, status (pending / approved / needs improvement) |
| `rewards_log` | Every USDC payout — amount, type (quiz_reward / challenge_bounty), on-chain tx_hash |

---

## Build Phases

---

### ✅ Phase 0 — Planning & Architecture (DONE)
> Foundation work before writing any real code.

- [x] Analyze ARCademy project requirements from `Arc project.docx`
- [x] Define tech stack (React, Express, Supabase, Privy, Solidity)
- [x] Design all 8 Phase 1 UI screens as mockups
- [x] Create project folder structure (`frontend/`, `backend/`, `contracts/`, `database/`)
- [x] Write database schema (`schema.sql`) for all 4 Supabase tables
- [x] Document folder structure (`FOLDER_STRUCTURE.md`)
- [x] Document implementation plan (`IMPLEMENTATION_PLAN.md`)

---

### 🔲 Phase 1 — Authentication & Wallet Setup
> Goal: A user can log in with Gmail (gets an Arc L1 wallet automatically) or connect an external wallet. Their profile is created in Supabase.

#### Frontend Tasks
- [ ] Initialize Vite + React + TypeScript project in `frontend/`
- [ ] Install Privy SDK (`@privy-io/react-auth`)
- [ ] Configure `<PrivyProvider>` with Arc L1 custom chain (Chain ID, RPC URL)
- [ ] Build `LoginPage.tsx` — Gmail login button + Connect Wallet button
- [ ] Build `AuthContext.tsx` — global user/wallet state
- [ ] Build `WalletBadge.tsx` — shows wallet address + USDC balance in UI

#### Backend Tasks
- [ ] Set up Express server (`index.js`) with CORS and JSON middleware
- [ ] Configure Supabase client in `db/supabaseClient.js`
- [ ] Write `userModel.js` — create or fetch user profile from Supabase
- [ ] Write `authController.js` — syncs Privy user data into Supabase `profiles` table
- [ ] Write `authRoutes.js` — `POST /api/auth/sync`
- [ ] Write `authMiddleware.js` — verifies Privy JWT token on protected routes

#### Database Tasks
- [ ] Create Supabase project
- [ ] Run `schema.sql` in Supabase SQL editor to create all 4 tables
- [ ] Configure Row Level Security (RLS) policies

#### Verification
- [ ] Gmail login → Privy creates Arc L1 embedded wallet → profile created in Supabase
- [ ] External wallet connect → maps to Supabase profile
- [ ] Protected routes return 401 without valid Privy token

---

### 🔲 Phase 2 — Learning Center & Quiz Engine
> Goal: Students can browse lessons, read content, take quizzes, and earn USDC micropayments on pass.

#### Frontend Tasks
- [ ] Build `LearnPage.tsx` — learning path overview with lesson list
- [ ] Build `LessonView.tsx` — lesson content (text + code syntax blocks)
- [ ] Build `QuizModal.tsx` — multiple choice card (reward amount hidden throughout quiz)
- [ ] Build `QuizResultsScreen.tsx` — shows score + "Claim USDC" button only if passed
- [ ] Build `LessonCard.tsx` — progress state per lesson (locked / active / completed)
- [ ] Connect quiz submission to backend `POST /api/quiz/grade` (only fires after ALL questions answered)

#### Backend Tasks
- [ ] Write `progressModel.js` — read/write `user_progress` table
- [ ] Write `rewardsModel.js` — insert payout record into `rewards_log` table
- [ ] Write `quizController.js` — grade answers, check 75% threshold, trigger reward
- [ ] Write `quizRoutes.js` — `POST /api/quiz/grade`

#### Contract Tasks (Scaffolding only)
- [ ] Initialize Hardhat in `contracts/`
- [ ] Write `RewardDistributor.sol` — basic USDC transfer function
- [ ] Write unit test for `RewardDistributor.sol`
- [ ] Deploy to Arc L1 testnet

#### Verification
- [ ] Pass quiz → USDC reward hits student wallet → reward logged in Supabase
- [ ] Fail quiz → no reward sent, retry available
- [ ] Completed lesson unlocks next lesson in path

---

### 🔲 Phase 3 — Build Challenges & Escrow Payments
> Goal: Students can view challenges, submit projects, and earn USDC bounties locked in smart contract escrow.

#### Frontend Tasks
- [ ] Build `BuildPage.tsx` — active challenges list with objectives and reward badge
- [ ] Build `SubmissionForm.tsx` — GitHub URL + live demo URL + wallet address form
- [ ] Add submission status tracker (Pending / Approved / Needs Improvement)

#### Backend Tasks
- [ ] Write `submissionModel.js` — CRUD for `submissions` table
- [ ] Write `submissionController.js` — create submission, trigger escrow on approval
- [ ] Write `submissionRoutes.js` — `POST /api/submissions/create`, `PATCH /api/submissions/:id/review`

#### Contract Tasks
- [ ] Write `ChallengeEscrow.sol` — lock USDC, release on approval
- [ ] Write unit test for `ChallengeEscrow.sol`
- [ ] Deploy to Arc L1 testnet

#### Admin Portal Tasks
- [ ] Build `AdminPortal.tsx` — protected review queue, treasury view, challenge management, user role assignment, rewards log UI
- [ ] Implement backend admin routes (`/api/admin/*`) with role checks for reviewer and admin
- [ ] Add approve/reject buttons that call `/api/submissions/:id/review` and trigger escrow payout when approved
- [ ] Write unit tests for admin API endpoints and role enforcement

#### Verification
- [ ] Admin locks $20 USDC into escrow contract
- [ ] Student submits project → appears in admin review queue
- [ ] Reviewer approves → USDC released from contract → student wallet
- [ ] Reviewer requests revision → student notified, can resubmit

---

### 🔲 Phase 4 — Portfolio, Certificates & Public Profile
> Goal: Students have a verified public developer profile with skills, earnings, and certificates.

#### Frontend Tasks
- [ ] Build `PortfolioPage.tsx` — public profile, skill badges, project history
- [ ] Build `CertificatePage.tsx` — certificate of completion + USDC earnings audit log
- [ ] Add "Share on LinkedIn / Twitter" + "Download PDF" for certificates

#### Backend Tasks
- [ ] Certificate generation endpoint (on lesson path completion)
- [ ] Public portfolio endpoint (readable without login)

#### Verification
- [ ] Complete all lessons → certificate generated with on-chain hash
- [ ] Public portfolio URL accessible without login

---

### 🔲 Phase 5 — Testing, Security & Deployment
> Goal: Platform is production-ready and deployed.

- [ ] Smart contract audit (ChallengeEscrow.sol + RewardDistributor.sol)
- [ ] Backend API rate limiting and input sanitization
- [ ] Frontend performance optimization (code splitting, lazy loading)
- [ ] Deploy frontend to **Vercel**
- [ ] Deploy backend to **Railway** or **Render**
- [ ] Deploy contracts to **Arc L1 mainnet**
- [ ] Configure production environment variables
- [ ] End-to-end user flow testing

---

## How All Layers Connect

```
User (Browser)
      ↕
  frontend/              ← React UI — login, view lessons, submit quiz, view wallet
      ↕
  backend/               ← Express API — grade quiz, sync user, trigger contract call
      ↕           ↘
  database/          contracts/     ← Supabase records events; Contract moves USDC on-chain
                          ↕
                    Arc L1 Blockchain    ← Final settlement — USDC transferred here
```

---

## Current Build Status

| Layer | Status |
| :--- | :--- |
| Planning & Architecture | ✅ Complete |
| Database Schema | ✅ Complete |
| Folder Structure | ✅ Complete |
| UI Mockups (8 screens) | ✅ Complete |
| Phase 1 — Auth & Wallet | 🔲 Not Started |
| Phase 2 — Learning & Quiz | 🔲 Not Started |
| Phase 3 — Build & Escrow | 🔲 Not Started |
| Phase 4 — Portfolio & Certs | 🔲 Not Started |
| Phase 5 — Deploy & Launch | 🔲 Not Started |

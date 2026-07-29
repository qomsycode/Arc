# Build Plan for ARCademy Platform

> **Goal**: Turn the implementation plan into concrete, executable steps.  The plan is ordered by dependencies so you can start coding immediately.

---

## 📅 Timeline (rough)
| Week | Focus |
|------|-------|
| **0** | Project setup – repo, CI, local dev env |
| **1‑2** | Phase 1 – Auth & Wallet (frontend + backend) |
| **3‑4** | Phase 2 – Learning center & Quiz (frontend + backend + contract scaffold) |
| **5‑6** | Phase 3 – Build challenges, escrow contracts, admin portal |
| **7** | Phase 4 – Portfolio & Certificates |
| **8** | Phase 5 – Testing, security hardening, deployment |

---

## 🎯 Phase 0 – Project Bootstrap (Done)
- [x] Initialise git repo, add `.gitignore` files, create `README.md`.
- [x] Add root `FOLDER_STRUCTURE.md` and `IMPLEMENTATION_PLAN.md`.
- [x] Install **Node.js** LTS, **pnpm** (or npm) globally.
- [x] Commit initial scaffold.

---

## 🔐 Phase 1 – Auth & Wallet Setup
### Frontend (`frontend/`)
1. Run `npm create vite@latest . -- --template react-ts` (already scaffolded).
2. Install dependencies:
   ```bash
   npm i @privy-io/react-auth axios @headlessui/react @heroicons/react
   ```
3. Create `src/contexts/AuthContext.tsx` – wraps `<PrivyProvider>` with custom Arc L1 chain config (from `.env.example`).
4. Build `src/views/LoginPage.tsx` – Gmail sign‑in button + **Connect Wallet** button.
5. Add `src/components/WalletBadge.tsx` – displays wallet address and USDC balance (fetch via backend).
6. Wire routes in `src/App.tsx` (`/login`, `/dashboard`).

### Backend (`backend/`)
1. Install dependencies:
   ```bash
   npm i express cors dotenv @supabase/supabase-js jsonwebtoken
   ```
2. Create `.env` (copy from `.env.example`) – add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PRIVY_APP_SECRET`, `PLATFORM_WALLET_PRIVATE_KEY`.
3. Implement `authMiddleware.js` – verifies Privy JWT and injects `req.user`.
4. Implement `authController.js`:
   - `POST /api/auth/sync` – receives Privy user payload, creates/updates profile in Supabase.
5. Add route file `authRoutes.js` and register in `index.js`.
6. Test with Postman: login → receive JWT → call protected route.

### Verification
- ✅ Gmail login creates an **embedded Arc L1 wallet** and stores it in Supabase.
- ✅ External wallet connect works and updates the same profile.
- ✅ Protected routes reject missing/invalid JWT.

---

## 📚 Phase 2 – Learning Center & Quiz Engine
### Frontend
1. Create lesson data JSON (`src/data/lessons.json`).
2. Build `LearnPage.tsx` – list of lessons, locked/unlocked UI.
3. Build `LessonView.tsx` – displays lesson markdown (use `react-markdown`).
4. Build `QuizModal.tsx` – multiple‑choice UI **without showing any reward amount** (per collaborator feedback).
5. Build `QuizResultsScreen.tsx` – shows pass/fail and **"Claim USDC"** button only after all questions answered.
6. Connect the quiz flow to backend endpoint `/api/quiz/grade`.

### Backend
1. Add `quizController.js`:
   - Accept array of answers, grade against correct answers stored in Supabase.
   - If `score >= 75` respond `{passed:true}`; else `{passed:false}`.
2. Add `quizRoutes.js` (`POST /api/quiz/grade`).
3. Extend `rewardsModel.js` – `createReward({userId, amount, type, txHash})`.
4. Add role check – only authenticated users can submit.

### Contracts (Scaffold only for now)
1. Initialise Hardhat in `contracts/` (`npx hardhat`).
2. Install OpenZeppelin ERC20: `npm i @openzeppelin/contracts`.
3. Create `RewardDistributor.sol` with a `distribute(address to, uint256 amount)` function restricted to `onlyBackend` (owner).
4. Write a minimal test that a mock backend can call the function.
5. **Do not deploy yet** – just keep compiled artifacts.

### Verification
- ✅ Student can complete all quiz questions, see final pass/fail screen.
- ✅ On pass, clicking **Claim USDC** triggers backend call to `RewardDistributor.sol` (mocked for now).
- ✅ Reward transaction hash stored in `rewards_log`.

---

## 🛠️ Phase 3 – Build Challenges, Escrow & Admin Portal
### Frontend
1. `BuildPage.tsx` – list of active challenges with reward badge.
2. `SubmissionForm.tsx` – fields for GitHub URL, live demo URL, wallet address.
3. `AdminPortal.tsx` – **protected** UI (role check) containing:
   - Review Queue (list of pending submissions)
   - Treasury view (total USDC locked)
   - Challenge creation form (reward amount, description)
   - User management table (assign reviewer role)
   - Rewards Log table (searchable, link to Tx explorer)
4. Add approve/reject buttons that call backend `/api/submissions/:id/review`.

### Backend
1. `submissionModel.js` – CRUD for `submissions` table.
2. `submissionController.js` – `createSubmission`, `reviewSubmission` (approve/reject).
3. `submissionRoutes.js` – `POST /api/submissions/create`, `PATCH /api/submissions/:id/review`.
4. Extend `authMiddleware` to expose `req.user.role` for admin checks.
5. Implement **admin route guard** (`adminMiddleware.js`).

### Contracts
1. Write `ChallengeEscrow.sol`:
   - `lock(address challenger, uint256 amount)` – called by backend when a challenge is created (locks USDC from treasury).
   - `release(address winner, uint256 amount)` – only callable by backend after reviewer approval.
2. Add unit tests for lock/release flow.
3. Deploy to Arc L1 **testnet** (use Hardhat script `scripts/deploy.js`).

### Verification
- ✅ Admin can **create a challenge** → contract locks USDC.
- ✅ Student submission appears in admin review queue.
- ✅ Approve → escrow contract releases USDC to student; `rewards_log` updated.
- ✅ Request revision → status changes, no funds moved.

---

## 📂 Phase 4 – Portfolio, Certificates & Public Profile
### Frontend
1. `PortfolioPage.tsx` – public profile view (no auth required). Shows completed lessons, earned USDC, and links to GitHub projects.
2. `CertificatePage.tsx` – renders a stylized certificate (use `html2pdf.js` to allow download). Includes on‑chain transaction hash for audit.
3. Add social‑share buttons (LinkedIn, Twitter).

### Backend
1. `certificateController.js` – generate certificate payload when a user completes *all* lessons (or a major milestone).
2. Public endpoint `/api/public/portfolio/:wallet` – returns user’s public data (no auth).

### Verification
- ✅ Completed student can view a downloadable certificate with a verified on‑chain hash.
- ✅ Public URLs (`/portfolio/:wallet`) are accessible without login.

---

## 🚀 Phase 5 – Testing, Security & Deployment
1. **Smart‑contract audit** – run `openzeppelin-contracts` static analysis, consider a third‑party audit.
2. **Backend security** – rate limiting (`express-rate-limit`), input sanitisation, CORS whitelist.
3. **Frontend performance** – code‑splitting, lazy‑load lesson content, enable HTTP/2.
4. **CI/CD** – GitHub Actions:
   - Lint (`eslint`), type‑check (`tsc --noEmit`), run unit tests.
   - Deploy contracts to testnet on push to `dev` branch.
   - Deploy frontend to Vercel (automatic on merge to `main`).
   - Deploy backend to Railway/Render (Dockerfile).
5. **Production rollout**:
   - Switch `.env` to production values (Arc L1 mainnet RPC, real treasury wallet).
   - Enable monitoring (Sentry for frontend, Logflare for backend).
   - Run end‑to‑end user‑flow tests (Cypress) covering login → lesson → quiz → claim → challenge → payout.

---

## 📦 Deliverables per Phase
| Phase | Deliverable | Owner |
|------|-------------|-------|
| 0 | Repo, docs, folder structure | All |
| 1 | Auth UI, backend sync, JWT middleware | Frontend & Backend |
| 2 | Lesson pages, quiz UI, reward contract stub | Frontend, Backend, Contracts |
| 3 | Challenge UI, admin portal, escrow contract | Frontend, Backend, Contracts |
| 4 | Portfolio page, certificate generator | Frontend & Backend |
| 5 | Full test suite, security hardening, production deployment | All |

---

### Next Immediate Action
**Start Phase 1**:
1. `cd frontend && npm install` – install Vite + Privy deps.
2. Create `.env` from `.env.example` and add the Privy App ID.
3. Implement `AuthContext.tsx` and `LoginPage.tsx` (follow the component checklist).
4. In parallel, spin up the Express backend, add `.env`, and implement the `auth` endpoint.
5. Verify the end‑to‑end login flow before moving to Phase 2.

That gives you a concrete, step‑by‑step roadmap to turn the plan into working code.

---

*Feel free to let me know if you’d like any of these tasks fleshed out further, or if you want me to scaffold a specific file now.*

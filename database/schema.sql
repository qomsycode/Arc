-- ARCademy Database Schema for Supabase (PostgreSQL)
-- Fixed: id column is TEXT to support Privy DIDs (did:privy:...)
-- Fixed: wallet_address is nullable (wallet may not be ready on first login)

-- Drop tables if they exist (clean reset)
DROP TABLE IF EXISTS public.rewards_log;
DROP TABLE IF EXISTS public.user_progress;
DROP TABLE IF EXISTS public.submissions;
DROP TABLE IF EXISTS public.profiles;

-- 1. PROFILES TABLE (Users & Wallets)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,                          -- Privy DID e.g. did:privy:xxx
    email VARCHAR(255) UNIQUE,
    wallet_address VARCHAR(255),                  -- Nullable: wallet created after login
    wallet_type VARCHAR(50) DEFAULT 'embedded',  -- 'embedded' or 'external'
    xp_points INT DEFAULT 0,
    role VARCHAR(50) DEFAULT 'student',          -- 'student', 'reviewer', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USER PROGRESS TABLE (Lesson Gatekeeping)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',      -- 'started', 'completed'
    score INT DEFAULT 100,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 3. SUBMISSIONS TABLE (Build Challenges)
CREATE TABLE IF NOT EXISTS public.submissions (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id INT NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    live_url VARCHAR(500),
    wallet_address VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',        -- 'pending', 'approved', 'needs_improvement'
    reviewer_feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 4. REWARDS LOG TABLE (USDC Transactions on Arc L1)
CREATE TABLE IF NOT EXISTS public.rewards_log (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,              -- e.g. 0.05 or 20.00
    reward_type VARCHAR(50) NOT NULL,            -- 'quiz_reward', 'challenge_bounty'
    tx_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

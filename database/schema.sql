-- ARCademy Database Schema for Supabase (PostgreSQL)

-- 1. PROFILES TABLE (Users & Wallets)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Matches Privy DID / Supabase Auth ID
    email VARCHAR(255) UNIQUE,
    wallet_address VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(50) DEFAULT 'embedded', -- 'embedded' or 'external'
    xp_points INT DEFAULT 0,
    role VARCHAR(50) DEFAULT 'student', -- 'student', 'reviewer', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USER PROGRESS TABLE (Lesson Gatekeeping)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- 'started', 'completed'
    score INT DEFAULT 100,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 3. SUBMISSIONS TABLE (Build Challenges)
CREATE TABLE IF NOT EXISTS public.submissions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id INT NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    live_url VARCHAR(500),
    wallet_address VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'needs_improvement'
    reviewer_feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 4. REWARDS LOG TABLE (USDC Transactions on Arc L1)
CREATE TABLE IF NOT EXISTS public.rewards_log (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL, -- e.g. 0.05 or 20.00
    reward_type VARCHAR(50) NOT NULL, -- 'quiz_reward', 'challenge_bounty'
    tx_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

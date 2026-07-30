const supabase = require('../db/supabaseClient');

const createSubmission = async (userId, challengeId, githubUrl, liveUrl, walletAddress) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([{
      user_id: userId,
      challenge_id: challengeId,
      github_url: githubUrl,
      live_url: liveUrl || null,
      wallet_address: walletAddress || null,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getUserSubmissions = async (userId) => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data;
};

const getAllSubmissions = async () => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data;
};

const updateSubmissionStatus = async (submissionId, status, feedback) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      status: status,
      reviewer_feedback: feedback,
      reviewed_at: new Date()
    })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  createSubmission,
  getUserSubmissions,
  getAllSubmissions,
  updateSubmissionStatus
};

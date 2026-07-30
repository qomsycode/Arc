const supabase = require('../db/supabaseClient');

const getUserProgress = async (userId) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

const markLessonComplete = async (userId, lessonId, score) => {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      status: 'completed',
      score: score,
      completed_at: new Date()
    }, { onConflict: 'user_id,lesson_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

const addXP = async (userId, amount) => {
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('xp_points')
    .eq('id', userId)
    .single();

  if (fetchError) throw fetchError;

  const newXp = (profile.xp_points || 0) + amount;

  const { data, error } = await supabase
    .from('profiles')
    .update({ xp_points: newXp })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  getUserProgress,
  markLessonComplete,
  addXP
};

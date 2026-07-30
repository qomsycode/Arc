const supabase = require('../db/supabaseClient');

const logReward = async (userId, amount, rewardType, txHash) => {
  const { data, error } = await supabase
    .from('rewards_log')
    .insert([{
      user_id: userId,
      amount: amount,
      reward_type: rewardType,
      tx_hash: txHash
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  logReward
};

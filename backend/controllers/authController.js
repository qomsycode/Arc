const supabase = require('../db/supabaseClient');

const syncUser = async (req, res) => {
  // req.user.id comes from the Privy JWT decoded in authMiddleware
  const privyUserId = req.user.id;
  const { wallet_address, email } = req.body;

  try {
    // Check if user already exists in Supabase
    let { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', privyUserId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected for a new user
      throw fetchError;
    }

    if (!profile) {
      // Create new user profile in Supabase
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: privyUserId,
            wallet_address: wallet_address || null,
            email: email || null,
            role: 'student',
            xp_points: 0
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      profile = newProfile;
    } else if (wallet_address && profile.wallet_address !== wallet_address) {
      // Update wallet if it changed (e.g. they connected an external one later)
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_address })
        .eq('id', privyUserId)
        .select()
        .single();
        
      if (updateError) throw updateError;
      profile = updatedProfile;
    }

    res.status(200).json({ message: 'User synced successfully', profile });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user profile' });
  }
};

const getProfile = async (req, res) => {
  const privyUserId = req.user.id;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', privyUserId)
      .single();

    if (error) throw error;
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

module.exports = { syncUser, getProfile };

const supabase = require('../db/supabaseClient');

/**
 * Middleware that checks if the authenticated user has the required role.
 * Must be used AFTER authMiddleware (which sets req.user.id).
 * 
 * Usage: router.post('/admin/review/:id', authMiddleware, requireRole('admin', 'reviewer'), handler);
 */
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: No user identity' });
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return res.status(403).json({ error: 'Forbidden: User profile not found' });
      }

      if (!allowedRoles.includes(profile.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      // Attach role to request for downstream use
      req.user.role = profile.role;
      next();
    } catch (err) {
      console.error('Role check error:', err);
      return res.status(500).json({ error: 'Server error checking permissions' });
    }
  };
};

module.exports = requireRole;

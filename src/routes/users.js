import { Router } from 'express';
import { getUserByUsername, getUserById, getPostsByUserId, followUser, unfollowUser, isFollowing, toPublicUser } from '../db.js';
import { avatarUrlForUuid } from '../utils/minecraft.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

router.get('/:username', async (req, res) => {
  const profile = await getUserByUsername(req.params.username);
  if (!profile) return res.status(404).render('404');
  const posts = await getPostsByUserId(profile.id);
  const following = req.session.user
    ? await isFollowing(req.session.user.id, profile.id)
    : false;
  res.render('profile', {
    profile: toPublicUser(profile),
    posts,
    following,
    avatarUrl: profile.mc ? avatarUrlForUuid(profile.mc.uuid, 64) : null,
  });
});

router.post('/:username/follow', requireAuth, async (req, res) => {
  const target = await getUserByUsername(req.params.username);
  if (target) await followUser(req.session.user.id, target.id);
  res.redirect('back');
});

router.post('/:username/unfollow', requireAuth, async (req, res) => {
  const target = await getUserByUsername(req.params.username);
  if (target) await unfollowUser(req.session.user.id, target.id);
  res.redirect('back');
});

export default router;

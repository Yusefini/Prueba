import { Router } from 'express';
import { getFeedForUserId, getGlobalFeed, getUserById } from '../db.js';
import { avatarUrlForUuid } from '../utils/minecraft.js';

const router = Router();

router.get('/', async (req, res) => {
  let posts = [];
  if (req.session.user) {
    posts = await getFeedForUserId(req.session.user.id, 50);
  } else {
    posts = await getGlobalFeed(50);
  }
  // Enrich posts minimally for rendering (username + avatar)
  const usersMap = new Map();
  for (const post of posts) {
    if (!usersMap.has(post.userId)) {
      const u = await getUserById(post.userId);
      usersMap.set(post.userId, u);
    }
  }
  const enriched = posts.map(p => {
    const u = usersMap.get(p.userId);
    return {
      ...p,
      username: u ? u.username : 'unknown',
      avatarUrl: u && u.mc ? avatarUrlForUuid(u.mc.uuid, 32) : null,
    };
  });
  res.render('index', { posts: enriched });
});

export default router;

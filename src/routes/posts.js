import { Router } from 'express';
import { addPost } from '../db.js';

const router = Router();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

router.post('/', requireAuth, async (req, res) => {
  try {
    await addPost(req.session.user.id, req.body.content);
    res.redirect('back');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;

import { Router } from 'express';
import { createUser, verifyUserPassword, toPublicUser } from '../db.js';
import { lookupMinecraftProfile } from '../utils/minecraft.js';

const router = Router();

router.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password, minecraftUsername } = req.body;
    if (!username || !password) throw new Error('Missing credentials');
    let mcProfile = null;
    if (minecraftUsername) {
      mcProfile = await lookupMinecraftProfile(minecraftUsername);
      if (!mcProfile) throw new Error('Minecraft username not found');
    }
    const user = await createUser({ username: username.trim(), password, mcProfile });
    req.session.user = toPublicUser(user);
    res.redirect('/');
  } catch (e) {
    res.status(400).render('signup', { error: e.message });
  }
});

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await verifyUserPassword(username, password);
  if (!user) return res.status(401).render('login', { error: 'Invalid credentials' });
  req.session.user = toPublicUser(user);
  res.redirect('/');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

export default router;

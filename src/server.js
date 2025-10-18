import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import feedRouter from './routes/feed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
  })
);

// Expose session user to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', feedRouter);
app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use((req, res) => res.status(404).render('404'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'db.json');

async function ensureDb() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dbPath);
  } catch (_) {
    const seed = { users: [], posts: [], follows: [] };
    await fs.writeFile(dbPath, JSON.stringify(seed, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw || '{"users":[],"posts":[],"follows":[]}');
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function getUserByUsername(username) {
  const db = await readDb();
  const uname = String(username).trim();
  return db.users.find(u => u.username.toLowerCase() === uname.toLowerCase()) || null;
}

export async function getUserById(userId) {
  const db = await readDb();
  return db.users.find(u => u.id === userId) || null;
}

export async function createUser({ username, password, mcProfile }) {
  const db = await readDb();
  const existing = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existing) throw new Error('Username already taken');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    username,
    passwordHash,
    mc: mcProfile ? { username: mcProfile.username, uuid: mcProfile.uuid } : null,
    createdAt: Date.now(),
  };
  db.users.push(user);
  await writeDb(db);
  return user;
}

export async function verifyUserPassword(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function addPost(userId, content) {
  const db = await readDb();
  const trimmed = String(content || '').trim();
  if (!trimmed) throw new Error('Empty post');
  if (trimmed.length > 500) throw new Error('Post too long');
  const post = { id: uuidv4(), userId, content: trimmed, createdAt: Date.now() };
  db.posts.push(post);
  await writeDb(db);
  return post;
}

export async function getPostsByUserId(userId) {
  const db = await readDb();
  return db.posts.filter(p => p.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getGlobalFeed(limit = 50) {
  const db = await readDb();
  return db.posts
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export async function getFeedForUserId(userId, limit = 50) {
  const db = await readDb();
  const followingIds = new Set(
    db.follows.filter(f => f.followerId === userId).map(f => f.followingId)
  );
  followingIds.add(userId);
  const posts = db.posts
    .filter(p => followingIds.has(p.userId))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
  return posts;
}

export async function followUser(followerId, followingId) {
  if (followerId === followingId) return;
  const db = await readDb();
  const exists = db.follows.find(
    f => f.followerId === followerId && f.followingId === followingId
  );
  if (!exists) {
    db.follows.push({ followerId, followingId, createdAt: Date.now() });
    await writeDb(db);
  }
}

export async function unfollowUser(followerId, followingId) {
  const db = await readDb();
  const before = db.follows.length;
  db.follows = db.follows.filter(
    f => !(f.followerId === followerId && f.followingId === followingId)
  );
  if (db.follows.length !== before) {
    await writeDb(db);
  }
}

export async function isFollowing(followerId, followingId) {
  const db = await readDb();
  return !!db.follows.find(
    f => f.followerId === followerId && f.followingId === followingId
  );
}

export function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    mc: user.mc || null,
    createdAt: user.createdAt,
  };
}

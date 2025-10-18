import fetch from 'node-fetch';

export async function lookupMinecraftProfile(username) {
  const uname = String(username || '').trim();
  if (!uname) return null;

  // Try PlayerDB first (case-insensitive and stable)
  try {
    const r = await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(uname)}`);
    if (r.ok) {
      const j = await r.json();
      if (j && j.code === 'player.found' && j.data && j.data.player) {
        return { uuid: j.data.player.id, username: j.data.player.username };
      }
    }
  } catch (_) {}

  // Fallback to Mojang API
  try {
    const r = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(uname)}`);
    if (r.ok) {
      const j = await r.json();
      if (j && j.id) {
        return { uuid: j.id, username: j.name };
      }
    }
  } catch (_) {}

  return null;
}

export function avatarUrlForUuid(uuid, size = 64) {
  const s = Math.max(16, Math.min(Number(size) || 64, 256));
  return `https://crafatar.com/avatars/${uuid}?size=${s}&overlay`; // overlay shows hat layer
}

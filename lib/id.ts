// Ambiguous characters (0/O, 1/I) removed so codes are easy to read + text.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generate a short, human-textable check-in code, e.g. "AL-7K9Q".
 * Vendors text this code to the check-in number to place themselves on the map.
 *
 * NOTE: uniqueness is not guaranteed here — the real backend (Supabase) will
 * enforce a unique constraint and regenerate on collision.
 */
export function generateCheckInId(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `AL-${code}`;
}

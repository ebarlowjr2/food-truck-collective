import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Validate an inbound Twilio webhook request via the `X-Twilio-Signature`
 * header, so only genuine Twilio traffic is trusted.
 *
 * Algorithm (per Twilio): take the exact webhook URL, append each POST param as
 * `key + value` in alphabetical order by key, HMAC-SHA1 with the account's Auth
 * Token, base64-encode, and compare to the header in constant time.
 *
 * https://www.twilio.com/docs/usage/security#validating-requests
 */
export function verifyTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string | null,
  authToken: string
): boolean {
  if (!signature) return false;

  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);

  const expected = createHmac("sha1", authToken)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Reconstruct the public URL Twilio used to call this route. Behind Vercel the
 * request URL is internal, so prefer the forwarded host/proto. An explicit
 * `TWILIO_WEBHOOK_URL` env var overrides everything (most reliable — set it to
 * the exact URL configured in the Twilio console).
 */
export function twilioWebhookUrl(req: Request): string {
  const override = process.env.TWILIO_WEBHOOK_URL;
  if (override) return override;

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const { pathname, search } = new URL(req.url);
  return `${proto}://${host}${pathname}${search}`;
}

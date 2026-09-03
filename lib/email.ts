/**
 * Minimal transactional email via Resend's HTTP API (no SDK dependency).
 *
 * Inert until configured: if RESEND_API_KEY is unset, sends are skipped and
 * logged, so nothing breaks before you connect Resend. Set in the environment:
 *   RESEND_API_KEY  — your Resend API key (server-only secret)
 *   EMAIL_FROM      — e.g. "OnTheCurb <hello@onthecurb.app>" (verified domain)
 */
export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(
  input: SendEmailInput
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "OnTheCurb <hello@onthecurb.app>";

  if (!apiKey) {
    console.warn("email: RESEND_API_KEY not set — skipping send", {
      to: input.to,
      subject: input.subject,
    });
    return { ok: false, skipped: true, error: "email not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("email: send failed", res.status, body);
      return { ok: false, error: `send failed (${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    console.error("email: send threw", err);
    return { ok: false, error: "send error" };
  }
}

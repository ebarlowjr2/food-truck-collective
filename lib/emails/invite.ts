interface InviteEmailInput {
  siteUrl: string;
  /** CAN-SPAM: a working unsubscribe link (Resend Broadcasts can inject one). */
  unsubscribeUrl?: string;
  /** CAN-SPAM: a real physical mailing address. */
  mailingAddress?: string;
}

const BENEFITS: { emoji: string; title: string; body: string }[] = [
  {
    emoji: "🗺️",
    title: "Show up in real time",
    body: "Drop your pin when you park and customers see exactly where you are right now — no more “where are they today?”",
  },
  {
    emoji: "📈",
    title: "Reach customers you’re missing",
    body: "OnTheCurb is part of a growing ecosystem of apps that expands day by day. Traffic that would normally never reach you now gets pointed straight to your truck.",
  },
  {
    emoji: "⚡",
    title: "Free to join, live in minutes",
    body: "Sign up, get your private check-in code, and put yourself on the map from your phone in seconds.",
  },
  {
    emoji: "🎛️",
    title: "You stay in control",
    body: "Update your location, menu, and hours anytime. Roll to a new spot? Move your pin and you’re found again.",
  },
  {
    emoji: "🎉",
    title: "Get booked",
    body: "Customers and event organizers can find and request your truck for parties, office lunches, and community gatherings.",
  },
];

/**
 * Vendor-invitation (outreach) email. Inline styles only. If you send this as
 * bulk/cold email, CAN-SPAM requires a working unsubscribe link and a physical
 * mailing address — pass real values (Resend Broadcasts can handle unsubscribe).
 */
export function inviteEmail({
  siteUrl,
  unsubscribeUrl = "{{unsubscribe}}",
  mailingAddress = "[Add your business mailing address]",
}: InviteEmailInput): { subject: string; html: string } {
  const joinUrl = `${siteUrl}/vendors/join`;

  const benefitRows = BENEFITS.map(
    (b) => `
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:34px;font-size:20px;line-height:1.3;">${b.emoji}</td>
        <td style="padding:10px 0 10px 10px;vertical-align:top;">
          <div style="font-size:15px;font-weight:700;color:#1c1a19;">${b.title}</div>
          <div style="margin-top:3px;font-size:14px;line-height:1.55;color:rgba(28,26,25,0.7);">${b.body}</div>
        </td>
      </tr>`
  ).join("");

  const subject = "Central Alabama is looking for your food truck";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#fff7ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1a19;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Get found the moment you park — free to join OnTheCurb.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ef;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid rgba(0,0,0,0.06);">
                <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;background:#e4572e;border-radius:9px;font-size:18px;vertical-align:middle;">🚚</span>
                <span style="font-weight:800;font-size:16px;letter-spacing:-0.2px;vertical-align:middle;margin-left:8px;">OnTheCurb</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 10px;font-size:23px;font-weight:800;letter-spacing:-0.4px;line-height:1.2;">Central Alabama is looking for your food truck</h1>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:rgba(28,26,25,0.72);">
                  If you run a food truck, your hardest problem usually isn&rsquo;t the food &mdash; it&rsquo;s making sure hungry people know where to find you <em>today</em>. That&rsquo;s exactly what OnTheCurb fixes. Here&rsquo;s what you get:
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${benefitRows}
                </table>

                <div style="margin-top:22px;background:#fff7ef;border:1px solid rgba(228,87,46,0.2);border-radius:14px;padding:16px 18px;font-size:14px;line-height:1.6;color:rgba(28,26,25,0.78);">
                  Our ecosystem is growing <strong>every single day</strong>, and every new app in it funnels more people toward the trucks on OnTheCurb. The trucks that get on the map early are the ones that ride that wave.
                </div>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr>
                    <td style="border-radius:999px;background:#e4572e;">
                      <a href="${joinUrl}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">List your truck &mdash; it&rsquo;s free &rarr;</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:rgba(28,26,25,0.6);">
                  See you on the curb,<br /><strong>The OnTheCurb team</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;border-top:1px solid rgba(0,0,0,0.06);font-size:12px;line-height:1.6;color:rgba(28,26,25,0.45);">
                You received this invitation because you operate a food truck in our area.<br />
                ${mailingAddress}<br />
                <a href="${unsubscribeUrl}" style="color:#e4572e;text-decoration:none;">Unsubscribe</a> &middot;
                <a href="${siteUrl}/terms" style="color:#e4572e;text-decoration:none;">Terms</a> &middot;
                <a href="${siteUrl}/privacy" style="color:#e4572e;text-decoration:none;">Privacy</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}

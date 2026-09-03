interface WelcomeEmailInput {
  businessName: string;
  code: string;
  siteUrl: string;
}

/**
 * Branded welcome email sent right after a vendor signs up. Hands them their
 * check-in code and a one-tap link to go live. Inline styles only (email
 * clients strip <style> and external CSS).
 */
export function welcomeEmail({ businessName, code, siteUrl }: WelcomeEmailInput): {
  subject: string;
  html: string;
} {
  const checkInUrl = `${siteUrl}/checkin?code=${encodeURIComponent(code)}`;
  const name = businessName || "your truck";

  const subject = `Welcome to OnTheCurb — your check-in code is ${code}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#fff7ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1a19;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your OnTheCurb check-in code + how to put your truck on the map.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ef;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid rgba(0,0,0,0.06);">
                <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;background:#e4572e;border-radius:9px;font-size:18px;vertical-align:middle;">🚚</span>
                <span style="font-weight:800;font-size:16px;letter-spacing:-0.2px;vertical-align:middle;margin-left:8px;">OnTheCurb</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;letter-spacing:-0.4px;">Welcome, ${escapeHtml(name)}! 🎉</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:rgba(28,26,25,0.72);">
                  You&rsquo;re listed on OnTheCurb &mdash; central Alabama&rsquo;s live food-truck map. Here&rsquo;s everything you need to go live.
                </p>

                <div style="background:#fff7ef;border:1px solid rgba(228,87,46,0.2);border-radius:14px;padding:20px;text-align:center;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#e4572e;">Your check-in code</div>
                  <div style="margin-top:6px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:30px;font-weight:800;letter-spacing:2px;">${escapeHtml(code)}</div>
                  <div style="margin-top:8px;font-size:12px;color:rgba(28,26,25,0.55);">🔒 Keep it private &mdash; anyone with this code can set your truck&rsquo;s spot.</div>
                </div>

                <p style="margin:24px 0 12px;font-size:15px;line-height:1.6;color:rgba(28,26,25,0.72);">
                  Ready to go live? Tell customers where you&rsquo;re parked:
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background:#e4572e;">
                      <a href="${checkInUrl}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">Put myself on the map &rarr;</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:rgba(28,26,25,0.6);">
                  Every time you park somewhere new, check in again to move your pin. If you haven&rsquo;t confirmed your email yet, click the confirmation link we sent so you can sign in and manage your listing.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;border-top:1px solid rgba(0,0,0,0.06);font-size:12px;color:rgba(28,26,25,0.45);">
                You&rsquo;re receiving this because you listed your truck on OnTheCurb.<br />
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

function escapeHtml(input: string): string {
  return input.replace(
    /[<>&"']/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c] ?? c
  );
}

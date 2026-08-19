/**
 * Public-facing check-in phone number (the Twilio number vendors text).
 *
 * Set these in the environment so the real number can change without a code
 * edit. They're NEXT_PUBLIC because the number is shown on the site:
 *   NEXT_PUBLIC_CHECKIN_PHONE       — display form, e.g. "(205) 555-0142"
 *   NEXT_PUBLIC_CHECKIN_PHONE_E164  — E.164 form, e.g. "+12055550142"
 * Point that number's inbound-SMS webhook at `/api/checkin`.
 */
export const CHECKIN_PHONE = process.env.NEXT_PUBLIC_CHECKIN_PHONE ?? "(205) 555-6272";
export const CHECKIN_PHONE_E164 =
  process.env.NEXT_PUBLIC_CHECKIN_PHONE_E164 ?? "+12055556272";

/** Suggested SMS format shown to vendors. */
export const CHECKIN_FORMAT = "<YourID> <address>; <day & time>";
export const CHECKIN_EXAMPLE = "AL-7K9Q 1728 1st Ave N, Birmingham; Sat 11am-2pm";

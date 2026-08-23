import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — OnTheCurb",
  description: "How OnTheCurb collects, uses, and shares information.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" updated={LEGAL.lastUpdated}>
      <p>
        This Privacy Policy explains how {LEGAL.operator} (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) collects, uses, and shares information when you use {LEGAL.brand} (the
        &quot;Service&quot;). By using the Service, you agree to this Policy.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information vendors provide</h3>
      <ul>
        <li>
          <strong>Account &amp; business details:</strong> owner name, email address, phone number,
          business name, vendor type, cuisine, description, website, and social links.
        </li>
        <li>
          <strong>Menu uploads</strong> and other content you choose to add to your listing.
        </li>
        <li>
          <strong>Check-ins:</strong> the address/location you report, an optional time window, and the
          time of the check-in. If you check in by text message, we also receive the phone number you
          text from.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          Basic technical data from your device and browser (such as IP address and request logs) that
          our hosting and infrastructure providers generate to operate and secure the Service.
        </li>
      </ul>
      <p>
        Members of the public can browse the map without creating an account, and we do not require the
        public to provide personal information to view listings.
      </p>

      <h2>2. How we use information</h2>
      <ul>
        <li>operate the live map and display vendor listings and locations;</li>
        <li>create and authenticate vendor accounts;</li>
        <li>process and geocode check-ins so vendors appear on the map;</li>
        <li>respond to inquiries and communicate about the Service; and</li>
        <li>maintain security, prevent abuse, and comply with legal obligations.</li>
      </ul>

      <h2>3. Information that is public</h2>
      <p>
        {LEGAL.brand} is a public directory. Your <strong>business name, vendor type, cuisine,
        description, menu, contact details you choose to publish, and your check-in locations are
        displayed publicly</strong> on the map and listings. Do not submit anything you don&apos;t want
        shown publicly. Your account email and owner name are not intended to be shown publicly as part
        of your listing.
      </p>

      <h2>4. How we share information</h2>
      <p>We do not sell your personal information. We share information only:</p>
      <ul>
        <li>
          <strong>with service providers</strong> that help us run the Service — for example, our
          database and authentication provider (Supabase), hosting (Vercel), SMS messaging (Twilio),
          and mapping/geocoding (OpenStreetMap / Nominatim) — who process data on our behalf;
        </li>
        <li>
          <strong>publicly</strong>, for the listing information described in Section 3;
        </li>
        <li>
          <strong>for legal reasons</strong>, if required by law or to protect rights, safety, and the
          integrity of the Service; and
        </li>
        <li>
          <strong>in a business transfer</strong>, such as a merger, acquisition, or sale of assets.
        </li>
      </ul>
      <p>
        When you enter an address to check in, that address is sent to our geocoding provider to convert
        it into map coordinates.
      </p>

      <h2>5. Data retention</h2>
      <p>
        We keep information for as long as your listing is active and as needed to operate the Service,
        resolve disputes, and meet legal obligations. You can ask us to delete your account and listing
        (see Section 7).
      </p>

      <h2>6. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect information, including
        access controls on our database. No method of transmission or storage is completely secure, and
        we cannot guarantee absolute security.
      </p>

      <h2>7. Your choices and rights</h2>
      <p>
        You can review and update your listing after signing in. To request access to, correction of, or
        deletion of your personal information, email us at{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. Depending on where you live,
        you may have additional rights under applicable privacy laws; we will honor those rights as
        required by law.
      </p>

      <h2>8. Children&apos;s privacy</h2>
      <p>
        The Service is not directed to children under 13, and we do not knowingly collect personal
        information from them. If you believe a child has provided us information, contact us and we will
        delete it.
      </p>

      <h2>9. Changes to this Policy</h2>
      <p>
        We may update this Policy from time to time. Changes are effective when posted, and the
        &quot;Last updated&quot; date above will change. Your continued use of the Service means you
        accept the revised Policy.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about privacy? Reach us at{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
      </p>
    </LegalDoc>
  );
}

import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service — OnTheCurb",
  description: "The terms that govern your use of OnTheCurb.",
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" updated={LEGAL.lastUpdated}>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of {LEGAL.brand}
        {" "}(the &quot;Service&quot;), operated by {LEGAL.operator} (&quot;we,&quot; &quot;us,&quot;
        or &quot;our&quot;). By accessing the Service, listing a food truck, checking in a location,
        or otherwise using {LEGAL.brand}, you agree to these Terms. If you do not agree, do not use
        the Service.
      </p>

      <h2>1. What OnTheCurb is</h2>
      <p>
        {LEGAL.brand} is an online directory and map that helps the public discover food-truck and
        mobile-food vendors and see vendor-reported locations. <strong>We are not a food seller,
        restaurant, caterer, or party to any transaction between you and a vendor.</strong> We do not
        prepare, handle, inspect, or deliver food, and we do not employ or control any vendor. Vendor
        listings, menus, prices, hours, and locations are provided by vendors, not by us.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old (or the age of majority where you live) and able to form a
        binding contract to use the Service. By using {LEGAL.brand} you represent that you meet these
        requirements.
      </p>

      <h2>3. Vendor accounts and check-in codes</h2>
      <p>
        If you list a truck, you receive a private check-in code. <strong>You are responsible for
        keeping your code and account credentials confidential and for all activity, listings, and
        check-ins made using them.</strong> Anyone with your code can set your location on the map, so
        do not share it. Notify us promptly at{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> if you believe your code or
        account has been compromised.
      </p>

      <h2>4. Vendor responsibilities</h2>
      <p>As a vendor, you are solely responsible for:</p>
      <ul>
        <li>
          the accuracy of your listing, menu, pricing, hours, and check-in locations, and for keeping
          them current;
        </li>
        <li>
          <strong>food safety and quality</strong>, allergen and ingredient disclosures, and all food
          handling, preparation, and service;
        </li>
        <li>
          obtaining and maintaining every required license, permit, health inspection, insurance, and
          registration, and complying with all applicable laws and regulations; and
        </li>
        <li>
          all interactions and transactions with customers, including orders, payments, refunds, and
          disputes.
        </li>
      </ul>
      <p>
        You grant us a non-exclusive, royalty-free license to display the content you submit (business
        name, description, menu, and location data) in connection with operating and promoting the
        Service.
      </p>

      <h2>5. Location and content accuracy</h2>
      <p>
        Locations, hours, and other information shown on the Service are <strong>self-reported by
        vendors and may be inaccurate, incomplete, or out of date.</strong> A truck may not be where
        the map indicates, may have moved, sold out, or closed. We do not verify, endorse, or guarantee
        any vendor, listing, menu, location, or the availability, quality, or safety of any food. You
        rely on this information at your own risk and should confirm details directly with the vendor.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>submit false, misleading, or fraudulent information, or check in a location you are not at;</li>
        <li>use another vendor&apos;s code or impersonate any person or business;</li>
        <li>
          scrape, harvest, overload, disrupt, or attempt to gain unauthorized access to the Service or
          its systems;
        </li>
        <li>upload unlawful, infringing, harmful, or offensive content; or</li>
        <li>use the Service for any unlawful purpose or in violation of these Terms.</li>
      </ul>
      <p>We may remove content or suspend or terminate access at any time, with or without notice.</p>

      <h2>7. Third-party services and links</h2>
      <p>
        The Service relies on and may link to third-party services (for example, mapping and geocoding,
        hosting, messaging, and authentication providers). We are not responsible for third-party
        services, their content, or their availability, and your use of them may be subject to their own
        terms.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        THE SERVICE AND ALL CONTENT ARE PROVIDED <strong>&quot;AS IS&quot; AND &quot;AS
        AVAILABLE&quot;</strong> WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
        INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
        NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
        SECURE, OR THAT ANY VENDOR, FOOD, LISTING, OR LOCATION INFORMATION IS ACCURATE, SAFE, OR
        RELIABLE.
      </p>

      <h2>9. Assumption of risk</h2>
      <p>
        You understand that decisions about which vendors to visit and what food to purchase and consume
        are yours alone. You assume all risks associated with locating, visiting, ordering from, and
        consuming food from any vendor found through the Service.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, {LEGAL.operator.toUpperCase()} AND ITS OWNERS,
        EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
        EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, DATA, GOODWILL, OR FOR ANY
        PERSONAL INJURY, ILLNESS, OR PROPERTY DAMAGE ARISING FROM OR RELATED TO THE SERVICE, ANY VENDOR,
        OR ANY FOOD. OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE WILL NOT EXCEED ONE
        HUNDRED U.S. DOLLARS ($100). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO SOME OF THE
        ABOVE MAY NOT APPLY TO YOU.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless {LEGAL.operator} and its owners, employees,
        and agents from any claims, damages, losses, liabilities, and expenses (including reasonable
        attorneys&apos; fees) arising from your use of the Service, your content or listings, your
        food or business (for vendors), or your violation of these Terms or any law or rights of a
        third party.
      </p>

      <h2>12. Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate your access at any time
        for any reason, including violation of these Terms. Sections that by their nature should survive
        termination (including Disclaimers, Limitation of Liability, and Indemnification) will survive.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Changes are effective when posted, and the
        &quot;Last updated&quot; date above will change. Your continued use of the Service after changes
        take effect means you accept the revised Terms.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of {LEGAL.governingState}, without regard to
        its conflict-of-laws rules. You agree that the state and federal courts located in
        {" "}{LEGAL.governingState} will have exclusive jurisdiction over any dispute arising from these
        Terms or the Service, to the extent permitted by law.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms? Reach us at{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </p>
    </LegalDoc>
  );
}

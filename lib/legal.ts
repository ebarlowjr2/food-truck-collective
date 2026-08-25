/**
 * Shared constants for the Terms of Service and Privacy Policy pages.
 *
 * ⚠️ CONFIRM THESE before launch, and have an attorney review the policy text.
 * The operator name was inferred from the account; verify it's the entity that
 * actually runs OnTheCurb, and set up the contact inboxes.
 */
export const LEGAL = {
  brand: "OnTheCurb",
  /** Legal entity that operates the service. CONFIRM. */
  operator: "One Circle Solutions, LLC",
  /** State whose law governs the Terms. CONFIRM. */
  governingState: "Alabama",
  /** Contact inboxes — set these up (or change to a real address). */
  contactEmail: "hello@onthecurb.app",
  privacyEmail: "privacy@onthecurb.app",
  /** Bump when the documents change. */
  lastUpdated: "August 23, 2026",
} as const;

// Shared disclaimer footer for upsell pages — replicates the Strativa reference
// (Disclaimers / Policies / Support columns, copyright + Explodely paragraph).
const SUPPORT_EMAIL = "americansystemusa@gmail.com";
const EARNINGS_DISCLAIMER = "https://greentracker.online/avisos/earningsDisclaimer.html";
const FTC_COMPLIANCE = "https://greentracker.online/avisos/FTCcompany.html";
const EXPLODELY_REFUND = "https://greentracker.online/avisos/explodelyRefunds.html";
const BILLING_SUPPORT = "https://help.explodely.com/support/tickets/new";
const EXPLODELY_HOME = "http://explodely.com/";

export function UpsellFooter() {
  return (
    <footer
      className="mt-auto w-full bg-black text-white"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Disclaimers */}
          <div>
            <h3 className="text-base font-bold sm:text-lg">Disclaimers</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={EXPLODELY_HOME}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-white/80"
                >
                  Earnings Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-base font-bold sm:text-lg">Policies</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={EXPLODELY_REFUND}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-white/80"
                >
                  Explodely Refund Policy
                </a>
              </li>
              <li>
                <a
                  href={EXPLODELY_HOME}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-white/80"
                >
                  FTC Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-bold sm:text-lg">Support</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <div className="text-white/90">Product Support:</div>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="underline underline-offset-4 hover:text-white/80 break-all"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Billing%20Support`}
                  className="underline underline-offset-4 hover:text-white/80"
                >
                  Billing Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-sm sm:text-base">
          © {new Date().getFullYear()} American System. All rights reserved.
        </p>

        <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-white/80 sm:text-sm">
          Explodely.com is the trusted gateway for equipevgemp.tech. Explodely is a
          trademark of Explodely LLC, a US Corporation located at 1317 Edgewater
          Drive Suite #4648, Orlando FL, 32804, United States and used by permission.
          Explodely's role as a gateway provider does not constitute an endorsement,
          approval or review of this product(s) or any claim, statement or opinion
          used in promotion of this product(s). If you aren't completely satisfied
          with your purchase, or need order support, please contact Explodely here:{" "}
          <a
            href={EXPLODELY_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-white"
          >
            {EXPLODELY_HOME}
          </a>
        </p>
      </div>
    </footer>
  );
}

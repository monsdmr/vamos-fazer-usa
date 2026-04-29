import { createFileRoute } from "@tanstack/react-router";
import { DisclaimerReturnButton } from "@/components/DisclaimerReturnButton";

export const Route = createFileRoute("/disclaimers/refund")({
  head: () => ({
    meta: [
      { title: "Return and Refund Policy" },
      { name: "description", content: "Explodely Refund Policy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <DisclaimerReturnButton />
      <div className="flex-1 mb-8">
        <div className="max-w-4xl mx-auto mt-10 px-6 sm:px-10 space-y-4">
          <h1 className="text-2xl font-bold">Return and Refund Policy</h1>
          <p>
            Last updated: 2025/19/09 Thank you for shopping at My Site. If, for
            any reason, You are not completely satisfied with a purchase We invite
            you to review our policy on refunds and returns. The following terms
            are applicable for any product/service that You purchased with Us.
          </p>
          <p>
            <strong>Interpretation and Definitions</strong>
            <br />
            Interpretation
            <br />
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in the plural.
          </p>
          <p>
            <strong>Definitions</strong>
            <br />
          </p>
          <p>For the purposes of this Return and Refund Policy:</p>
          <ul className="list-disc list-inside">
            <li>
              Company (referred to as either "the Company", "We", "Us" or "Our"
              in this Agreement) refers to VG EMPREENDIMENTOS LLC, 1 Cupertino,
              CA 95014.
            </li>
            <li>Goods refer to the items offered for sale on the Service.</li>
            <li>Orders mean a request by You to purchase Goods from Us.</li>
            <li>Service refers to the Website.</li>
            <li>
              Website refers to My Site, accessible from
              [https://greentracker.online]
            </li>
            <li>
              You means the individual accessing or using the Service, or the
              company, or other legal entity on behalf of which such individual
              is accessing or using the Service, as applicable.
            </li>
          </ul>

          <p>
            <strong>Your Order Cancellation Rights</strong>
            <br />
          </p>
          <p>
            You are entitled to cancel Your Order within 60 days without giving
            any reason for doing so.
            <br />
            The deadline for cancelling an Order is 60 days from the date on
            which You received the Goods/Service.
            <br />
            Explodely.com is the trusted gateway for [http://www.mycompany.com].
            You can request a refund:
            <br />
          </p>
          <ul className="list-disc list-inside">
            <li>Via email: support@explodely.com</li>
            <li>
              By visiting this page on our website:{" "}
              <a
                href="https://explodely.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://explodely.com/contact/
              </a>
            </li>
            <li>By phone number: +1 (833) EXP-LDLY or +1 (833) 397-5359</li>
          </ul>

          <p>
            <strong>Conditions for Return</strong>
            <br />
          </p>
          <p>
            In order for the Goods to be eligible for a return, please make sure
            that:
            <br />
            - The Goods were purchased in the last 60 days
          </p>

          <p>
            <strong>Contact Us</strong>
            <br />
          </p>
          <p>
            If you have any questions about our Goods, please contact us:
            <br />
            - By email: [ americansystemusa@gmail.com ]
            <br />
            - By visiting this page on our website: [equipevgemp.tech]
            <br />
            - By phone number: [557399196338]
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimers/ftc")({
  head: () => ({
    meta: [
      { title: "FTC Compliance" },
      { name: "description", content: "FTC Compliance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FTCCompliancePage,
});

function FTCCompliancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <div className="flex-1 mb-8">
        <div className="max-w-4xl mx-auto mt-10 px-6 sm:px-10 space-y-4">
          <h1 className="text-2xl font-bold">FTC Compliance</h1>
          <p>
            [VG EMPREENDIMENTOS] ("us", "we", or "our") operates the
            [equipevgemp.tech] website (the "Service").
          </p>
          <p>
            We make every effort at candor regarding any products or services we
            use, recommend, or otherwise make mention of at [equipevgemp.tech]. We
            strive to clearly differentiate between our own products or services
            versus those of third parties, to facilitate inquiries, support, and
            customer care. Likewise, just as we (and any other legitimate
            business) may profit from the sale of our own products or services, we
            may also profit from the sale of others' products or services (like
            any retailer) at [equipevgemp.tech]. Additionally, wherever products
            or services may give rise to income generation, we endeavour to
            provide realistic and factual data, but highlight the fact that the
            variables impacting results are so numerous and uncontrollable that no
            guarantees are in any way made. It is our goal to embrace the
            guidelines and requirements of the Federal Trade Commission (FTC) for
            the benefit of all, and with that in mind provide the following
            disclosures regarding compensation and disclaimer regarding earnings &amp;
            income.
          </p>
          <p>
            Note that material connections may not be made known at every single
            advertisement or affiliate link. Thus, to be safe, you should simply
            assume there is a material connection and that we may receive
            compensation in money or otherwise for anything you purchase as a
            result of visiting this website, and also that we may be paid merely
            by you clicking any link.
          </p>
          <p>
            <strong>Compensation</strong>
            <br />
            You should assume that we may be compensated for purchases of products
            or services mentioned on this [equipevgemp.tech] website that are not
            created, owned, licensed, or otherwise materially controlled by us.
            Stated differently, while most people obviously understand that
            individuals make a living by way of the profit that remains after the
            costs associated with providing their product or service are covered,
            at least theoretically there may be someone out there who does not
            understand that a third party can "affiliate" someone else's products
            or services and be compensated by the product or service creator/owner
            for helping spread the word about their offering. Just compare it to
            retailers. They seldom produce anything, but rather make their money
            connecting product and service creators with end users.
          </p>
          <p>
            <strong>Testimonials</strong>
            <br />
            Testimonials regarding the outcome or performance of using any product
            or service are provided to embellish your understanding of the
            offering. While great effort is made to ensure that they are factually
            honest, we at [equipevgemp.tech] are not liable for errors and
            omissions. Aside from human error, some information may be provided by
            third parties, such as customers or product/service providers. The
            best results are not uncommonly correlated with the best efforts,
            discipline, diligence, and so on, and thus the results depicted
            cannot, in any way, be construed as common, typical, expected, normal,
            or associated with the average user's experience with any given
            product or service. Exceptional results may be depicted by our website
            as highlights, but you are responsible for understanding that atypical
            outcomes may not reflect your experience. Aside from market
            conditions, products and services change over time. Older products may
            lose effectiveness. Newer products may not have a reliable track
            record.
            <br />
            Where products or services might pertain to earning money, the same
            safeguards about use of testimonials apply. Additionally, note that
            any related income figures are highly specific to the individual or
            entity that produced those results, and there can be no assurance that
            you will be able to leverage the same, or similar, products or
            services to achieve comparable results. The results, though real, may
            be the result of the conflation of a number of favorable circumstances
            that would be difficult to replicate, and so you must proceed with the
            knowledge that your outcome can differ from any shared on our website.
          </p>
          <p>
            <strong>Professional Consultation</strong>
            <br />
            Many products and services are designed to solve problems. Common
            problem areas include legal, financial, and medical. We are in no way
            purporting to counsel you on issues related law, finances, or health.
            If you require guidance in these arenas, you should consider securing
            your own counsel from lawyers, accountants, tax professionals,
            investment advisors, or medical professionals before taking any
            action. Nothing we may ever communicate at [equipevgemp.tech], in
            print or spoken word, will ever be intended to constitute any such
            counsel, as we do not claim to be professionals in any of those
            disciplines. You assume all risk for actions taken, losses incurred,
            damages sustained, or other issues stemming from your use of any
            product or service in any way connected with or mentioned on this
            website. Indeed, such decision is solely your own, or else determined
            in conjunction with the professional guidance of the advisor of your
            choosing.
          </p>
          <p>
            <strong>Use Of Products &amp; Services</strong>
            <br />
            The following are facts you should be advised of if you intend to take
            advantage of any products or services.
            <br />
            The price paid for products and services change over time. Even the
            prices of staples and basic commodities change, and there are many
            factors such as supply and demand, sales and other customer
            acquisition incentives, and more. Price, and value, can be quite
            relative. Technology, innovations, product improvements, market
            penetration, and numerous other factors all weigh in. It is impossible
            to define the "right" price for any product and service. Willing
            buyers and willing sellers determine price at any given time. You
            accept the fact that your purchase reflects your own attribution of
            value at the time of purchase, and that the price may increase or
            decrease in the future.
            <br />
            The outcome you experience is dependent upon many factors. Aptitude
            and attitude go a long way towards success with products and services
            in virtually any niche, whether fitness or making money.
            Circumstances, experience, innate abilities, personality, education,
            time commitments, and perseverance are just a few factors. Given the
            smorgasbord of interrelated variables, there is no way to reasonably
            predict your specific outcome with any degree of reliability or
            certainty.
          </p>
          <p>
            <strong>Income-Producing Products &amp; Services</strong>
            <br />
            Income-producing products &amp; services are likewise subject to the above
            cautions. In addition, however, there are additional factors we like
            to point out at [equipevgemp.tech]. Unlike weight loss products or
            self-help materials, income-producing methods are influenced by the
            overall health of the economy in which one operates. In times of
            liquidity, money flows freely and commerce is easier. In times of
            perceived scarcity, fear, recession, depression, or otherwise,
            commerce is stymied. Results can be influenced by market sentiment,
            just as the stock market indices around the world are swayed heavily
            on news.
            <br />
            Income-producing products &amp; services purchased should be viewed as
            just that – purchases. Though they can be investments in one's
            business, it is not unreasonable to expect that there may not be an
            express return on that investment, per se. Often, business success is
            the convergence of a number of factors, methods, strategies, and so
            on. It can be hard to peg success to one method or machination. This
            does not necessarily undermine value of any given product or service,
            as it can have an additive effect. Or, it may have no effect. Since it
            can be difficult to tell, you should operate on the assumption that
            your outcome could be zero. We make no guarantees and you should only
            risk what you can afford to lose on any purchases on or through [YOUR
            URL]
          </p>
          <p>
            <strong>Earnings &amp; Income</strong>
            <br />
            In light of all of the factors above, impinging on the very nature of
            income-producing products and services, there is no way to guarantee
            results of any kind whatsoever. Accordingly, we affirmatively declare
            that we make no guarantees as to your earnings &amp; income of any kind,
            at any time.
            <br />
            As with any business endeavour or investment, past performance is no
            guarantee or predictor of future performance. Any testimonials or
            other representations of results are for illustrative purposes only
            and, though every effort is made to ensure they're factually honest,
            they are not intended to imply or insinuate what is likely to happen
            with you. Your reliance on them as such is not advised.
            <br />
            It should be noted that "earnings &amp; income" is so phrased with
            specific intent. While income may typify the earnings most either seek
            or are accustomed to, earnings can come in non-monetary forms. These
            include some forms that are abstract or intangible, and thus not even
            readily converted to currency or a common medium of exchange. Thus,
            note that all manner of compensation, including earnings of a
            non-income yet nevertheless beneficial form, are covered by these
            provisions.
          </p>
          <p>
            <strong>Affiliates &amp; Other Third Parties</strong>
            <br />
            It should also be noted that we only have control over, and thus only
            accept responsibility for, the content of this [equipevgemp.tech]
            website authored by us. Any representations made by others should be
            considered prima facie unauthorized.
            <br />
            You may also read, hear, or otherwise come into contact with
            commentary about any of our products &amp; services or offerings, and
            should assume those have likewise not been authorized. While
            information, in any form, can arise, at any time, regarding our
            products &amp; services, there may be times when this results from an
            affiliate relationship.
            <br />
            In other words, we may permit our products &amp; services to be marketed
            through other individuals, businesses, websites, and otherwise, just
            as providers of goods and services use retailers and other vendors to
            make available what they offer. You should not construe a third-party
            offer as an endorsement by that third party of any product or service.
            <br />
            You should, more conservatively, view it as an offer to buy something.
            Likewise, as alluded to previously, note that we cannot fully control
            all marketing practices by all parties. With the use of "mirror"
            sites, indirect or unauthorized affiliates, "tiered" affiliate
            structures, and so on, policing the world wide web with any modicum of
            thoroughness is unlikely. We make reasonable efforts to ensure our
            affiliates comply with our policies and represent our products &amp;
            services consistent with our guidelines. However, at
            [equipevgemp.tech] we cannot always guarantee they will do so. You are
            always free to report concerns or abuses via our Contact information.
          </p>
          <p>
            <strong>Customer Care</strong>
            <br />
            Last, but not least, please note that our role in briefing you on
            products and services other than our own is simply as a "matchmaker."
            We do not provide any support or customer service for those items and
            you should always contact the owner or provider of those products or
            services to have any and all questions answered to your satisfaction
            before purchasing.
          </p>
          <p>
            <strong>CHANGE NOTICE</strong>
            <br />
            As with any of our administrative and legal notice pages, the contents
            of this page can and will change over time. Accordingly, this page
            could read differently as of your very next visit. These changes are
            necessitated, and carried out by [equipevgemp.tech], in order to
            protect you and our [equipevgemp.tech] website. If this page is
            important to you, you should check back frequently as no other notice
            of changed content will be provided either before or after the change
            takes effect.
          </p>
        </div>
      </div>
    </div>
  );
}

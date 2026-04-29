interface UpsellPriceBlockProps {
  price: string; // e.g. "$47.00"
  recurring?: string; // e.g. "$47.00 every 30 days, until canceled!"
}

export function UpsellPriceBlock({ price, recurring }: UpsellPriceBlockProps) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-slate-50 border border-slate-200 px-6 py-7 sm:py-8 text-center shadow-sm">
      <p className="text-slate-500 font-semibold text-sm sm:text-base">
        Add directly to my order
      </p>
      <p className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900">
        Price: {price}
      </p>
      {recurring && (
        <p className="mt-1 text-base sm:text-lg font-bold text-slate-900">
          {recurring}
        </p>
      )}
      <h3 className="mt-5 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
        60-Day Money Back Guarantee
      </h3>
    </div>
  );
}

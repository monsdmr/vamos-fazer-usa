import { useRouter } from "@tanstack/react-router";

// Sticky "Return" button for disclaimer pages so users can navigate back
// to the upsell page they came from without opening a new tab.
export function DisclaimerReturnButton() {
  const router = useRouter();

  const handleReturn = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-3">
        <button
          type="button"
          onClick={handleReturn}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
        >
          <span aria-hidden>←</span> Return
        </button>
      </div>
    </div>
  );
}

export const TailwindIndicator: React.FC = () => {
  return (
    <div className="pointer-events-none fixed bottom-2 left-0 z-9999 font-mono text-xs text-white">
      {/* Mobile first — default shows 'sm' */}
      <div className="px-2 py-1 rounded bg-blue-600/80 sm:hidden">sm</div>

      {/* Visible from sm and up */}
      <div className="hidden px-2 py-1 rounded sm:block md:hidden bg-green-600/80">
        md
      </div>

      {/* Visible from md and up */}
      <div className="hidden px-2 py-1 rounded md:block lg:hidden bg-yellow-600/80">
        lg
      </div>

      {/* Visible from lg and up */}
      <div className="hidden px-2 py-1 rounded lg:block xl:hidden bg-orange-600/80">
        xl
      </div>

      {/* Visible from xl and up */}
      <div className="hidden px-2 py-1 rounded xl:block bg-red-600/80">2xl</div>
    </div>
  );
};

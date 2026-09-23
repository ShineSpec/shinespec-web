const ReferEarnContent = ({ handleCopy, copied }) => (
  <div className="w-full">
    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Refer & Earn</h2>
    <p className="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">
      Invite friends and earn rewards when they book services.
    </p>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <span className="font-bold text-lg lg:text-xl text-gray-900 px-4 py-2 bg-gray-50 rounded-lg text-center sm:text-left">LC3QT9</span>
      <button
        onClick={handleCopy}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm lg:text-base"
      >
        {copied ? "Copied!" : "Copy Code"}
      </button>
    </div>
  </div>
);

export default ReferEarnContent;

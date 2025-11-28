const ReferEarnContent = ({ handleCopy, copied }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Refer & Earn</h2>
    <p className="text-gray-600 mb-3">
      Invite friends and earn rewards when they book services.
    </p>
    <div className="flex items-center gap-3">
      <span className="font-bold text-xl text-gray-900">LC3QT9</span>
      <button
        onClick={handleCopy}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        {copied ? "Copied!" : "Copy Code"}
      </button>
    </div>
  </div>
);

export default ReferEarnContent;

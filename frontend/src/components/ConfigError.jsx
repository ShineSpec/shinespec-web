import { AlertTriangle } from 'lucide-react';

const ConfigError = ({ variable }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
      <AlertTriangle className="w-10 h-10 text-pink-600 mx-auto mb-4" />
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Shine Spec is temporarily unavailable
      </h1>
      <p className="text-gray-600 mb-6">
        The site is missing a configuration value it needs to start up, so sign in
        and booking are offline. Our team has been alerted — please try again shortly.
      </p>
      <a
        href="mailto:support@shinespec.com"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors"
      >
        Contact support
      </a>
      {variable && (
        <p className="mt-6 text-xs text-gray-400">
          Missing build variable: <code>{variable}</code>
        </p>
      )}
    </div>
  </div>
);

export default ConfigError;

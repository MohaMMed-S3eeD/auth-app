import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            SecureAuth
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Simple & Secure Authentication
          </p>
        </div>

        {/* Description */}
        <div className="max-w-lg mx-auto">
          <p className="text-gray-500 leading-relaxed">
            A clean and modern authentication platform that prioritizes
            simplicity and security. Get started in seconds with our streamlined
            interface.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Simple Features */}
        <div className="grid sm:grid-cols-3 gap-6 pt-8">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔒</span>
            </div>
            <h3 className="font-medium text-gray-900">Secure</h3>
            <p className="text-sm text-gray-500">Protected & encrypted</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="font-medium text-gray-900">Fast</h3>
            <p className="text-sm text-gray-500">Lightning quick setup</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <h3 className="font-medium text-gray-900">Simple</h3>
            <p className="text-sm text-gray-500">Easy to use interface</p>
          </div>
        </div>
      </div>
    </div>
  );
}

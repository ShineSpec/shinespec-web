import { SignIn } from "@clerk/clerk-react";

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8 sm:px-6 sm:py-12 lg:mt-12">
    <div className="w-full max-w-[400px] sm:max-w-[440px] md:max-w-[460px]">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full mx-auto",
            card: "w-full shadow-xl rounded-2xl px-4 py-6 sm:px-8 sm:py-8",
            headerTitle: "text-lg sm:text-xl md:text-2xl font-bold",
            headerSubtitle: "text-xs sm:text-sm",
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2.5 sm:py-3",
            formFieldInput: "text-sm sm:text-base py-2.5 sm:py-3",
            formFieldLabel: "text-xs sm:text-sm",
            socialButtonsBlockButton: "text-sm sm:text-base py-2.5 sm:py-3",
            socialButtonsBlockButtonText: "text-xs sm:text-sm",
            footerActionText: "text-xs sm:text-sm",
            footerActionLink: "text-xs sm:text-sm",
            dividerText: "text-xs sm:text-sm",
            identityPreviewText: "text-xs sm:text-sm",
            formFieldInputShowPasswordButton: "text-xs sm:text-sm",
          },
          layout: {
            socialButtonsPlacement: "top",
          },
        }}
      />
    </div>
  </div>
);

export default Login;
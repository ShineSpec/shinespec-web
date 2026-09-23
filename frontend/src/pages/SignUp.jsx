import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/login"
      afterSignUpUrl="/dashboard"
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-xl rounded-2xl",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
        },
      }}
    />
  </div>
);

export default SignUpPage;
import { SignIn } from "@clerk/clerk-react";

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
    <SignIn
      path="/login"
      routing="path"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
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

export default Login;
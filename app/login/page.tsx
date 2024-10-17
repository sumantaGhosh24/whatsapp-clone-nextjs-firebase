import Link from "next/link";

import LoginForm from "@/components/login-form";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-4/6 rounded-md p-8 shadow-md">
        <h1 className="mb-4 text-3xl font-semibold">Login User</h1>
        <LoginForm />
        <p className="mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-green-500 underline">
            register
          </Link>
        </p>
      </div>
    </div>
  );
}

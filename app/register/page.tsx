import Link from "next/link";

import RegisterForm from "@/components/register-form";

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-4/6 rounded-md p-8 shadow-md">
        <h1 className="mb-4 text-3xl font-semibold">Register User</h1>
        <RegisterForm />
        <p className="mt-5">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-green-500 underline">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}

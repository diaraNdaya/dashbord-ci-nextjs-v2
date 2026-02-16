import { Logo } from "@/components/common/Logo";
import { LoginForm } from "@/components/organisms/login-form";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex items-center py-1 px-3 rounded-md">
            <Logo className="h-6 w-6" />
          </div>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}

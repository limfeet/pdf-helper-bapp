// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | PDF Helper",
  description: "Google 계정으로 PDF Helper에 로그인하세요",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
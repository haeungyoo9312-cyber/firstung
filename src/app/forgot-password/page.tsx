import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: '비밀번호 재설정 - Firebase App Hosting',
  description: '비밀번호를 재설정하세요.',
};

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <ForgotPasswordForm />
    </main>
  );
}

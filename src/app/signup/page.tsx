import { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 - Firebase App Hosting',
  description: '새 계정을 만들어 서비스를 시작하세요.',
};

export default function SignupPage() {
  return (
    <main className="auth-page">
      <SignupForm />
    </main>
  );
}

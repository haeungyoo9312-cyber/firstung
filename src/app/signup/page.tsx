import { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 - 모바일 게임 시세 확인',
  description: '새 계정을 만들어 게임 시세 서비스를 이용하세요.',
};

export default function SignupPage() {
  return (
    <main className="auth-page">
      <SignupForm />
    </main>
  );
}

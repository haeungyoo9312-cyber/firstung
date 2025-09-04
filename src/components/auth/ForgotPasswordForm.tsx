'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/auth';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(getErrorMessage(error));
      } else {
        setMessage('비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인해주세요.');
      }
    } catch (err) {
      setError('이메일 발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="auth-title">비밀번호 재설정</h1>
        
        <p className="auth-description">
          가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? '발송 중...' : '재설정 이메일 발송'}
        </button>

        <div className="auth-links">
          <Link href="/login" className="auth-link">
            로그인으로 돌아가기
          </Link>
        </div>
      </form>
    </div>
  );
}

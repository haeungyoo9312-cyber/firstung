'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProfileContent() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) return;

    setLoading(true);
    setMessage('');

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      
      setMessage('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
    } catch (error) {
      setMessage('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-content">
      <div className="profile-header">
        <h1 className="profile-title">프로필</h1>
      </div>

      <div className="profile-card">
        {message && (
          <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-info">
          <div className="profile-avatar">
            {user?.displayName ? user.displayName[0].toUpperCase() : '👤'}
          </div>

          {!isEditing ? (
            <div className="profile-details">
              <h2>{user?.displayName || '이름 없음'}</h2>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-uid">UID: {user?.uid}</p>
              
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                프로필 수정
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="displayName">이름</label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="disabled-input"
                />
                <small>이메일은 변경할 수 없습니다.</small>
              </div>

              <div className="profile-actions">
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? '저장 중...' : '저장'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(user?.displayName || '');
                    setMessage('');
                  }}
                  className="cancel-button"
                  disabled={loading}
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

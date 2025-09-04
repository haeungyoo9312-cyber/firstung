'use client';

import { useState } from 'react';
import { UserBasicInfo } from '@/types/profile';
import { validateNickname, checkNicknameAvailable } from '@/lib/profile';

interface BasicInfoFormProps {
  initialData?: Partial<UserBasicInfo>;
  onSave: (data: Partial<UserBasicInfo>) => Promise<void>;
  isLoading?: boolean;
  userId?: string;
}

export default function BasicInfoForm({ 
  initialData, 
  onSave, 
  isLoading = false,
  userId 
}: BasicInfoFormProps) {
  const [formData, setFormData] = useState({
    nickname: initialData?.nickname || '',
    platform: initialData?.platform || 'PC+모바일' as const,
    activeTimeZone: initialData?.activeTimeZone || 'allday' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nicknameChecking, setNicknameChecking] = useState(false);

  // 닉네임 중복 확인
  const checkNickname = async (nickname: string) => {
    if (!nickname || nickname === initialData?.nickname) return;

    setNicknameChecking(true);
    try {
      const isAvailable = await checkNicknameAvailable(nickname, userId);
      if (!isAvailable) {
        setErrors(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다.' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.nickname;
          return newErrors;
        });
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, nickname: '닉네임 확인 중 오류가 발생했습니다.' }));
    } finally {
      setNicknameChecking(false);
    }
  };

  // 닉네임 유효성 검증
  const handleNicknameChange = (value: string) => {
    setFormData(prev => ({ ...prev, nickname: value }));
    
    const validation = validateNickname(value);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, nickname: validation.error! }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.nickname;
        return newErrors;
      });
      
      // 유효한 경우 중복 확인
      checkNickname(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검증
    const validation = validateNickname(formData.nickname);
    if (!validation.isValid) {
      setErrors({ nickname: validation.error! });
      return;
    }

    // 에러가 있는 경우 제출 불가
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('기본 정보 저장 실패:', error);
      setErrors({ submit: '저장 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const platformOptions = [
    { value: 'PC', label: 'PC 게임', icon: '💻' },
    { value: '모바일', label: '모바일 게임', icon: '📱' },
    { value: 'PC+모바일', label: 'PC + 모바일', icon: '🎮' },
  ] as const;

  const timeZoneOptions = [
    { value: 'morning', label: '오전 (06:00-12:00)', icon: '🌅' },
    { value: 'afternoon', label: '오후 (12:00-18:00)', icon: '☀️' },
    { value: 'evening', label: '저녁 (18:00-24:00)', icon: '🌆' },
    { value: 'night', label: '새벽 (00:00-06:00)', icon: '🌙' },
    { value: 'allday', label: '하루종일', icon: '⏰' },
  ] as const;

  return (
    <div className="basic-info-form">
      <div className="form-header">
        <h3 className="form-title">🎮 기본 정보</h3>
        <p className="form-subtitle">게임 시세 서비스 이용을 위한 기본 정보를 설정해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* 닉네임 */}
        <div className="form-group">
          <label htmlFor="nickname" className="form-label">
            닉네임 *
          </label>
          <div className="input-wrapper">
            <input
              id="nickname"
              type="text"
              value={formData.nickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              className={`form-input ${errors.nickname ? 'error' : ''}`}
              placeholder="2-20자, 한글/영문/숫자/특수문자(-,_)"
              maxLength={20}
              disabled={isLoading || isSubmitting}
            />
            {nicknameChecking && (
              <div className="input-status checking">
                <span className="status-icon">⏳</span>
                확인 중...
              </div>
            )}
            {!nicknameChecking && formData.nickname && !errors.nickname && (
              <div className="input-status success">
                <span className="status-icon">✅</span>
                사용 가능
              </div>
            )}
          </div>
          {errors.nickname && (
            <div className="error-message">{errors.nickname}</div>
          )}
        </div>

        {/* 주 플레이 플랫폼 */}
        <div className="form-group">
          <label className="form-label">주 플레이 플랫폼 *</label>
          <div className="radio-group horizontal">
            {platformOptions.map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="platform"
                  value={option.value}
                  checked={formData.platform === option.value}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    platform: e.target.value as 'PC' | '모바일' | 'PC+모바일'
                  }))}
                  disabled={isLoading || isSubmitting}
                />
                <div className="radio-content">
                  <span className="radio-icon">{option.icon}</span>
                  <span className="radio-label">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 주 활동 시간대 */}
        <div className="form-group">
          <label className="form-label">주 활동 시간대 *</label>
          <div className="radio-group">
            {timeZoneOptions.map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="activeTimeZone"
                  value={option.value}
                  checked={formData.activeTimeZone === option.value}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    activeTimeZone: e.target.value as 'morning' | 'afternoon' | 'evening' | 'night' | 'allday'
                  }))}
                  disabled={isLoading || isSubmitting}
                />
                <div className="radio-content">
                  <span className="radio-icon">{option.icon}</span>
                  <span className="radio-label">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 에러 메시지 */}
        {errors.submit && (
          <div className="error-message global-error">{errors.submit}</div>
        )}

        {/* 제출 버튼 */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={
              isLoading || 
              isSubmitting || 
              nicknameChecking ||
              Object.keys(errors).length > 0 ||
              !formData.nickname.trim()
            }
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner">⏳</span>
                저장 중...
              </>
            ) : (
              '저장하기'
            )}
          </button>
        </div>
      </form>

      <div className="form-info">
        <h4>📋 정보 활용 안내</h4>
        <ul>
          <li><strong>닉네임</strong>: 서비스 내에서 표시되는 이름입니다</li>
          <li><strong>플랫폼</strong>: 관심 게임 추천 시 활용됩니다</li>
          <li><strong>활동 시간대</strong>: 알림 발송 시간 최적화에 사용됩니다</li>
        </ul>
      </div>
    </div>
  );
}

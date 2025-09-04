'use client';

import { useState } from 'react';
import { NotificationSettings } from '@/types/profile';

interface NotificationSettingsFormProps {
  initialSettings?: NotificationSettings;
  onSave: (settings: NotificationSettings) => Promise<void>;
  isLoading?: boolean;
}

export default function NotificationSettingsForm({ 
  initialSettings, 
  onSave, 
  isLoading = false 
}: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState<NotificationSettings>(
    initialSettings || {
      priceAlert: {
        enabled: true,
        thresholdPercentage: 10,
        priceIncrease: true,
        priceDecrease: true,
      },
      updateAlert: {
        enabled: true,
        frequency: 'daily',
      },
      weeklyReport: {
        enabled: false,
        day: 'monday',
        time: '09:00',
      },
      browserPush: true,
      emailNotification: false,
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(settings);
    } catch (error) {
      console.error('알림 설정 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const thresholdOptions = [
    { value: 5, label: '5%' },
    { value: 10, label: '10%' },
    { value: 15, label: '15%' },
    { value: 20, label: '20%' },
    { value: 30, label: '30%' },
  ];

  const frequencyOptions = [
    { value: 'realtime', label: '실시간', description: '시세 업데이트 즉시' },
    { value: 'hourly', label: '1시간마다', description: '정시마다 요약 정보' },
    { value: 'daily', label: '하루 1회', description: '오전 9시 요약 정보' },
  ] as const;

  const dayOptions = [
    { value: 'monday', label: '월요일' },
    { value: 'tuesday', label: '화요일' },
    { value: 'wednesday', label: '수요일' },
    { value: 'thursday', label: '목요일' },
    { value: 'friday', label: '금요일' },
    { value: 'saturday', label: '토요일' },
    { value: 'sunday', label: '일요일' },
  ] as const;

  const timeOptions = [
    { value: '09:00', label: '오전 9시' },
    { value: '12:00', label: '오후 12시' },
    { value: '18:00', label: '오후 6시' },
    { value: '21:00', label: '오후 9시' },
  ];

  return (
    <div className="notification-settings-form">
      <div className="form-header">
        <h3 className="form-title">🔔 알림 설정</h3>
        <p className="form-subtitle">
          시세 변동과 업데이트 소식을 어떻게 받을지 설정해보세요
        </p>
      </div>

      <div className="settings-sections">
        {/* 가격 변동 알림 */}
        <div className="settings-section">
          <div className="section-header">
            <h4 className="section-title">
              <span className="section-icon">📈</span>
              가격 변동 알림
            </h4>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.priceAlert.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  priceAlert: { ...prev.priceAlert, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {settings.priceAlert.enabled && (
            <div className="section-content">
              <div className="form-group">
                <label className="form-label">변동 임계값</label>
                <div className="radio-group horizontal">
                  {thresholdOptions.map(option => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name="threshold"
                        value={option.value}
                        checked={settings.priceAlert.thresholdPercentage === option.value}
                        onChange={() => setSettings(prev => ({
                          ...prev,
                          priceAlert: { ...prev.priceAlert, thresholdPercentage: option.value }
                        }))}
                      />
                      <span className="radio-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">알림 유형</label>
                <div className="checkbox-group">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={settings.priceAlert.priceIncrease}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        priceAlert: { ...prev.priceAlert, priceIncrease: e.target.checked }
                      }))}
                    />
                    <span className="checkbox-label">
                      <span className="checkbox-icon">📈</span>
                      가격 상승 알림
                    </span>
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={settings.priceAlert.priceDecrease}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        priceAlert: { ...prev.priceAlert, priceDecrease: e.target.checked }
                      }))}
                    />
                    <span className="checkbox-label">
                      <span className="checkbox-icon">📉</span>
                      가격 하락 알림
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 업데이트 알림 */}
        <div className="settings-section">
          <div className="section-header">
            <h4 className="section-title">
              <span className="section-icon">🔄</span>
              업데이트 알림
            </h4>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.updateAlert.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  updateAlert: { ...prev.updateAlert, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {settings.updateAlert.enabled && (
            <div className="section-content">
              <div className="form-group">
                <label className="form-label">알림 빈도</label>
                <div className="radio-group vertical">
                  {frequencyOptions.map(option => (
                    <label key={option.value} className="radio-option detailed">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={settings.updateAlert.frequency === option.value}
                        onChange={() => setSettings(prev => ({
                          ...prev,
                          updateAlert: { ...prev.updateAlert, frequency: option.value }
                        }))}
                      />
                      <div className="radio-content">
                        <span className="radio-label">{option.label}</span>
                        <span className="radio-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 주간 리포트 */}
        <div className="settings-section">
          <div className="section-header">
            <h4 className="section-title">
              <span className="section-icon">📊</span>
              주간 리포트
            </h4>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.weeklyReport.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  weeklyReport: { ...prev.weeklyReport, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {settings.weeklyReport.enabled && (
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">발송 요일</label>
                  <select
                    value={settings.weeklyReport.day}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      weeklyReport: { 
                        ...prev.weeklyReport, 
                        day: e.target.value as any 
                      }
                    }))}
                    className="form-select"
                  >
                    {dayOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">발송 시간</label>
                  <select
                    value={settings.weeklyReport.time}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      weeklyReport: { 
                        ...prev.weeklyReport, 
                        time: e.target.value 
                      }
                    }))}
                    className="form-select"
                  >
                    {timeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 알림 수신 방법 */}
        <div className="settings-section">
          <div className="section-header">
            <h4 className="section-title">
              <span className="section-icon">🔔</span>
              알림 수신 방법
            </h4>
          </div>

          <div className="section-content">
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={settings.browserPush}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    browserPush: e.target.checked
                  }))}
                />
                <span className="checkbox-label">
                  <span className="checkbox-icon">🌐</span>
                  브라우저 푸시 알림
                  <span className="checkbox-description">
                    브라우저에서 바로 알림을 받습니다
                  </span>
                </span>
              </label>

              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={settings.emailNotification}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    emailNotification: e.target.checked
                  }))}
                />
                <span className="checkbox-label">
                  <span className="checkbox-icon">📧</span>
                  이메일 알림
                  <span className="checkbox-description">
                    등록된 이메일로 알림을 받습니다
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="form-actions">
        <button
          type="button"
          onClick={handleSubmit}
          className="submit-button"
          disabled={isLoading || isSubmitting}
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

      <div className="form-info">
        <h4>🔔 알림 활용 팁</h4>
        <ul>
          <li><strong>가격 변동 알림</strong>: 관심 게임의 급격한 시세 변화를 놓치지 마세요</li>
          <li><strong>업데이트 알림</strong>: 새로운 게임 추가나 기능 업데이트 소식을 받아보세요</li>
          <li><strong>주간 리포트</strong>: 지난 주 시세 동향을 한눈에 확인하세요</li>
          <li><strong>브라우저 알림</strong>: 사이트 방문 중이 아니어도 중요한 소식을 받을 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { GameServer } from '@/types/game';
import PriceChart from '@/components/chart/PriceChart';

interface PriceDisplayProps {
  gameName: string;
  gameIcon: string;
  servers: GameServer[];
  selectedServer: string;
  onServerSelect: (serverId: string) => void;
}

export default function PriceDisplay({ 
  gameName, 
  gameIcon, 
  servers, 
  selectedServer, 
  onServerSelect 
}: PriceDisplayProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendClass = (trend: string) => {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      case 'stable': return 'trend-stable';
      default: return 'trend-stable';
    }
  };

  const selectedServerData = servers.find(server => server.id === selectedServer);
  
  const handleServerSelect = (serverId: string) => {
    onServerSelect(serverId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getDisplayServerName = () => {
    if (selectedServer && selectedServerData) {
      return selectedServerData.name;
    }
    return '서버 전체';
  };

  return (
    <div className="price-display">
      <div className="price-header">
        <h2 className="price-title">
          <span className="price-game-icon">{gameIcon}</span>
          {gameName} 시세
        </h2>
        <p className="price-subtitle">1만원당 게임머니 환산</p>
      </div>

      {/* 서버 드롭다운 선택 */}
      <div className="server-dropdown-container">
        <div className="server-dropdown">
          <button 
            className={`dropdown-toggle ${isDropdownOpen ? 'open' : ''}`}
            onClick={toggleDropdown}
          >
            <span className="dropdown-label">{getDisplayServerName()}</span>
            <span className={`dropdown-arrow ${isDropdownOpen ? 'up' : 'down'}`}>
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button
                className={`dropdown-item ${!selectedServer ? 'active' : ''}`}
                onClick={() => handleServerSelect('')}
              >
                서버 전체
              </button>
              {servers.map((server) => (
                <button
                  key={server.id}
                  className={`dropdown-item ${selectedServer === server.id ? 'active' : ''}`}
                  onClick={() => handleServerSelect(server.id)}
                >
                  {server.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 시세 표시 영역 */}
      {selectedServer && selectedServerData ? (
        // 선택된 서버의 시세 표시
        <div className="server-details">
          <div className="server-info-card">
            <div className="server-card-header">
              <h3 className="server-name">{selectedServerData.name} 서버</h3>
              <div className={`trend ${getTrendClass(selectedServerData.trend)}`}>
                {getTrendIcon(selectedServerData.trend)}
              </div>
            </div>
            
            <div className="price-info">
              <div className="price-row">
                <span className="price-label">최저가</span>
                <span className="price-amount lowest">
                  {formatPrice(selectedServerData.lowestPrice)} {selectedServerData.currency}
                </span>
              </div>
              <div className="price-row">
                <span className="price-label">평균가</span>
                <span className="price-amount average">
                  {formatPrice(selectedServerData.averagePrice)} {selectedServerData.currency}
                </span>
              </div>
            </div>
            
            <div className="server-footer">
              <div className="update-info">
                <span className="update-date">{selectedServerData.lastUpdated}</span>
                <span className="update-time">{selectedServerData.updateTime} 업데이트</span>
              </div>
            </div>
          </div>

          <PriceChart 
            servers={[selectedServerData]} 
            selectedServerId={selectedServer}
          />
        </div>
      ) : !selectedServer ? (
        // 서버 전체 선택 시 모든 서버 시세 표시
        <div className="all-servers-overview">
          <h3 className="overview-title">전체 서버 시세 현황</h3>
          <div className="servers-grid">
            {servers.map((server) => (
              <div key={server.id} className="server-overview-card">
                <div className="server-overview-header">
                  <h4 className="server-overview-name">{server.name}</h4>
                  <div className={`trend ${getTrendClass(server.trend)}`}>
                    {getTrendIcon(server.trend)}
                  </div>
                </div>
                <div className="server-overview-prices">
                  <div className="price-item">
                    <span className="price-label">최저</span>
                    <span className="price-value lowest">
                      {formatPrice(server.lowestPrice)}
                    </span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">평균</span>
                    <span className="price-value average">
                      {formatPrice(server.averagePrice)}
                    </span>
                  </div>
                </div>
                <div className="server-overview-currency">
                  단위: {server.currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {servers.length === 0 && (
        <div className="no-data">
          <p>해당 게임의 시세 정보가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

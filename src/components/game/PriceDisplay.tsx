'use client';

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

  return (
    <div className="price-display">
      <div className="price-header">
        <h2 className="price-title">
          <span className="price-game-icon">{gameIcon}</span>
          {gameName} 
          {selectedServer ? ` - ${selectedServerData?.name} 서버` : ' 서버 선택'}
        </h2>
        <p className="price-subtitle">
          {selectedServer ? '1만원당 게임머니 환산' : '시세를 확인할 서버를 선택하세요'}
        </p>
      </div>

      {!selectedServer ? (
        // 서버 선택 단계
        <div className="server-selection">
          <h3 className="server-selection-title">서버 선택</h3>
          <div className="server-buttons">
            {servers.map((server) => (
              <button
                key={server.id}
                className="server-button"
                onClick={() => onServerSelect(server.id)}
              >
                <span className="server-button-name">{server.name}</span>
                <span className="server-button-info">
                  최저 {formatPrice(server.lowestPrice)} {server.currency}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : selectedServerData ? (
        // 선택된 서버의 시세 표시
        <div className="server-details">
          <div className="server-info-card">
            <div className="server-card-header">
              <h3 className="server-name">{selectedServerData.name}</h3>
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

          <div className="server-actions">
            <button 
              className="back-button"
              onClick={() => onServerSelect('')}
            >
              ← 다른 서버 선택
            </button>
          </div>

          <PriceChart 
            servers={[selectedServerData]} 
            selectedServerId={selectedServer}
          />
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

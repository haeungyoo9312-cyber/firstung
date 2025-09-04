'use client';

import { GameServer } from '@/types/game';

interface PriceChartProps {
  servers: GameServer[];
  selectedServerId?: string;
}

export default function PriceChart({ servers, selectedServerId }: PriceChartProps) {
  const selectedServer = selectedServerId 
    ? servers.find(s => s.id === selectedServerId) 
    : servers[0];

  if (!selectedServer || !selectedServer.priceHistory.length) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">시세 변동 그래프</h3>
        <div className="chart-no-data">
          <p>차트 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  // 최근 7일 데이터만 표시
  const recentHistory = selectedServer.priceHistory.slice(-14); // 최저가/평균가 각 7개씩
  const lowestPrices = recentHistory.filter(item => item.type === 'lowest');
  const averagePrices = recentHistory.filter(item => item.type === 'average');

  // 가격 범위 계산
  const allPrices = recentHistory.map(item => item.price);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;

  // 좌표 계산 함수 (간단한 SVG 차트)
  const getY = (price: number) => {
    const chartHeight = 200;
    const padding = 20;
    return padding + (1 - (price - minPrice) / priceRange) * (chartHeight - 2 * padding);
  };

  const getX = (index: number, total: number) => {
    const chartWidth = 400;
    const padding = 30;
    return padding + (index / (total - 1)) * (chartWidth - 2 * padding);
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {selectedServer.name} 시세 변동 그래프 (최근 7일)
      </h3>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color lowest"></div>
          <span>최저가</span>
        </div>
        <div className="legend-item">
          <div className="legend-color average"></div>
          <span>평균가</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <svg viewBox="0 0 400 240" className="price-chart">
          {/* 배경 그리드 */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 최저가 라인 */}
          <polyline
            fill="none"
            stroke="#4caf50"
            strokeWidth="2"
            points={lowestPrices.map((item, index) => 
              `${getX(index, lowestPrices.length)},${getY(item.price)}`
            ).join(' ')}
          />

          {/* 평균가 라인 */}
          <polyline
            fill="none"
            stroke="#2196f3"
            strokeWidth="2"
            points={averagePrices.map((item, index) => 
              `${getX(index, averagePrices.length)},${getY(item.price)}`
            ).join(' ')}
          />

          {/* 최저가 포인트 */}
          {lowestPrices.map((item, index) => (
            <circle
              key={`lowest-${index}`}
              cx={getX(index, lowestPrices.length)}
              cy={getY(item.price)}
              r="4"
              fill="#4caf50"
            />
          ))}

          {/* 평균가 포인트 */}
          {averagePrices.map((item, index) => (
            <circle
              key={`average-${index}`}
              cx={getX(index, averagePrices.length)}
              cy={getY(item.price)}
              r="4"
              fill="#2196f3"
            />
          ))}

          {/* Y축 라벨 */}
          <text x="10" y="25" fontSize="10" fill="var(--secondary-contrast)">
            {maxPrice.toLocaleString()}
          </text>
          <text x="10" y="215" fontSize="10" fill="var(--secondary-contrast)">
            {minPrice.toLocaleString()}
          </text>
        </svg>
      </div>

      <div className="chart-info">
        <div className="chart-stat">
          <span className="stat-label">현재 최저가:</span>
          <span className="stat-value lowest">
            {selectedServer.lowestPrice.toLocaleString()} {selectedServer.currency}
          </span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">현재 평균가:</span>
          <span className="stat-value average">
            {selectedServer.averagePrice.toLocaleString()} {selectedServer.currency}
          </span>
        </div>
      </div>
    </div>
  );
}

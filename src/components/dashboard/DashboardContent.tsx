'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GameSelector from '@/components/game/GameSelector';
import PriceDisplay from '@/components/game/PriceDisplay';
import GameSearch from '@/components/search/GameSearch';
import { gameData } from '@/data/gameData';

export default function DashboardContent() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState('lineage');
  const [selectedServer, setSelectedServer] = useState<string>(''); // 기본값: 서버 전체

  const games = Object.values(gameData).map(game => ({
    id: game.id,
    name: game.name,
    icon: game.icon,
    category: game.category
  }));

  const currentGame = gameData[selectedGame];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setSelectedServer(''); // 게임 변경 시 서버 선택 초기화
  };

  const handleSearchSelect = (gameId: string, serverId?: string) => {
    setSelectedGame(gameId);
    setSelectedServer(serverId || ''); // 검색에서 서버까지 선택된 경우
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">모바일 게임 시세 대시보드</h1>
        <p className="dashboard-welcome">
          안녕하세요, {user?.displayName || user?.email}님! 실시간 게임머니 시세를 확인하세요.
        </p>
      </div>

      <GameSearch
        games={Object.values(gameData)}
        onSelectResult={handleSearchSelect}
      />

      <GameSelector
        games={games}
        selectedGame={selectedGame}
        onGameSelect={handleGameSelect}
      />

      {currentGame && (
        <PriceDisplay
          gameName={currentGame.name}
          gameIcon={currentGame.icon}
          servers={currentGame.servers}
          selectedServer={selectedServer}
          onServerSelect={setSelectedServer}
        />
      )}

      <div className="dashboard-info">
        <div className="info-card">
          <h3>💡 시세 정보 안내</h3>
          <ul>
            <li>시세는 실시간으로 업데이트됩니다</li>
            <li>1000원당 구매 가능한 게임머니 양을 표시합니다</li>
            <li>📈 상승, 📉 하락, ➡️ 보합 추세를 확인하세요</li>
          </ul>
        </div>
        
        <div className="info-card">
          <h3>⚠️ 주의사항</h3>
          <ul>
            <li>실제 거래 시 수수료가 발생할 수 있습니다</li>
            <li>시세는 참고용이며, 실제 거래가와 차이가 있을 수 있습니다</li>
            <li>안전한 거래를 위해 공식 채널을 이용하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

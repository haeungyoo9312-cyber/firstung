'use client';

import { useState, useEffect } from 'react';
import { FavoriteGame } from '@/types/profile';
import { gameData } from '@/data/gameData';
import { Game } from '@/types/game';

interface FavoriteGamesFormProps {
  initialFavorites?: FavoriteGame[];
  onSave: (favorites: FavoriteGame[]) => Promise<void>;
  isLoading?: boolean;
}

export default function FavoriteGamesForm({ 
  initialFavorites = [], 
  onSave, 
  isLoading = false 
}: FavoriteGamesFormProps) {
  const [favorites, setFavorites] = useState<FavoriteGame[]>(initialFavorites);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedGameId, setExpandedGameId] = useState<string>('');

  const allGames = Object.values(gameData);
  const availableGames = allGames.filter(game => 
    !favorites.some(fav => fav.gameId === game.id)
  );

  // 게임 추가
  const handleAddGame = () => {
    if (!selectedGame || favorites.length >= 5) return;

    const gameInfo = gameData[selectedGame];
    if (!gameInfo) return;

    const newFavorite: FavoriteGame = {
      gameId: gameInfo.id,
      gameName: gameInfo.name,
      gameIcon: gameInfo.icon,
      favoriteServers: [], // 초기에는 빈 배열
      addedDate: new Date().toISOString(),
      priority: favorites.length + 1,
    };

    setFavorites(prev => [...prev, newFavorite]);
    setSelectedGame('');
  };

  // 게임 제거
  const handleRemoveGame = (gameId: string) => {
    setFavorites(prev => prev.filter(game => game.gameId !== gameId));
    if (expandedGameId === gameId) {
      setExpandedGameId('');
    }
  };

  // 서버 선택/해제
  const handleServerToggle = (gameId: string, serverId: string) => {
    setFavorites(prev => prev.map(game => {
      if (game.gameId === gameId) {
        const isSelected = game.favoriteServers.includes(serverId);
        const newServers = isSelected 
          ? game.favoriteServers.filter(id => id !== serverId)
          : [...game.favoriteServers, serverId];
        
        return { ...game, favoriteServers: newServers };
      }
      return game;
    }));
  };

  // 우선순위 변경
  const handlePriorityChange = (gameId: string, direction: 'up' | 'down') => {
    const currentIndex = favorites.findIndex(game => game.gameId === gameId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= favorites.length) return;

    const newFavorites = [...favorites];
    [newFavorites[currentIndex], newFavorites[newIndex]] = 
    [newFavorites[newIndex], newFavorites[currentIndex]];

    // 우선순위 재조정
    const updatedFavorites = newFavorites.map((game, index) => ({
      ...game,
      priority: index + 1,
    }));

    setFavorites(updatedFavorites);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(favorites);
    } catch (error) {
      console.error('관심 게임 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="favorite-games-form">
      <div className="form-header">
        <h3 className="form-title">⭐ 관심 게임 설정</h3>
        <p className="form-subtitle">
          자주 확인하는 게임을 등록하면 대시보드에서 우선적으로 표시됩니다 (최대 5개)
        </p>
      </div>

      {/* 게임 추가 */}
      <div className="add-game-section">
        <div className="add-game-controls">
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="game-select"
            disabled={isLoading || favorites.length >= 5}
          >
            <option value="">게임을 선택하세요</option>
            {availableGames.map(game => (
              <option key={game.id} value={game.id}>
                {game.icon} {game.name} ({game.category})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddGame}
            className="add-button"
            disabled={!selectedGame || favorites.length >= 5}
          >
            추가
          </button>
        </div>
        
        <div className="limit-info">
          {favorites.length}/5개 등록됨
        </div>
      </div>

      {/* 관심 게임 목록 */}
      <div className="favorite-games-list">
        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎮</div>
            <p>아직 등록된 관심 게임이 없습니다</p>
            <p>위에서 게임을 선택해서 추가해보세요!</p>
          </div>
        ) : (
          favorites.map((game, index) => {
            const gameInfo = gameData[game.gameId];
            const isExpanded = expandedGameId === game.gameId;
            
            return (
              <div key={game.gameId} className="favorite-game-item">
                <div className="game-header">
                  <div className="game-info">
                    <span className="game-priority">#{game.priority}</span>
                    <span className="game-icon">{game.gameIcon}</span>
                    <span className="game-name">{game.gameName}</span>
                    <span className="server-count">
                      {game.favoriteServers.length}개 서버 선택됨
                    </span>
                  </div>
                  
                  <div className="game-actions">
                    {/* 우선순위 변경 */}
                    <button
                      type="button"
                      onClick={() => handlePriorityChange(game.gameId, 'up')}
                      className="priority-button"
                      disabled={index === 0}
                      title="우선순위 올리기"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePriorityChange(game.gameId, 'down')}
                      className="priority-button"
                      disabled={index === favorites.length - 1}
                      title="우선순위 내리기"
                    >
                      ↓
                    </button>
                    
                    {/* 서버 선택 토글 */}
                    <button
                      type="button"
                      onClick={() => setExpandedGameId(isExpanded ? '' : game.gameId)}
                      className="expand-button"
                      title="서버 선택"
                    >
                      {isExpanded ? '접기' : '서버 선택'}
                    </button>
                    
                    {/* 게임 제거 */}
                    <button
                      type="button"
                      onClick={() => handleRemoveGame(game.gameId)}
                      className="remove-button"
                      title="게임 제거"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 서버 선택 영역 */}
                {isExpanded && gameInfo && (
                  <div className="servers-section">
                    <h4 className="servers-title">관심 서버 선택</h4>
                    <div className="servers-grid">
                      {gameInfo.servers.map(server => {
                        const isSelected = game.favoriteServers.includes(server.id);
                        return (
                          <label
                            key={server.id}
                            className={`server-option ${isSelected ? 'selected' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleServerToggle(game.gameId, server.id)}
                              className="server-checkbox"
                            />
                            <div className="server-content">
                              <span className="server-name">{server.name}</span>
                              <span className="server-price">
                                최저 {server.lowestPrice.toLocaleString()} {server.currency}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    
                    {game.favoriteServers.length === 0 && (
                      <div className="no-servers-selected">
                        서버를 선택하지 않으면 전체 서버 정보가 표시됩니다
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
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
        <h4>💡 관심 게임 활용법</h4>
        <ul>
          <li><strong>우선순위</strong>: 번호가 낮을수록 대시보드 상단에 표시됩니다</li>
          <li><strong>서버 선택</strong>: 특정 서버만 선택하면 해당 서버 정보만 표시됩니다</li>
          <li><strong>전체 서버</strong>: 서버를 선택하지 않으면 모든 서버 정보를 확인할 수 있습니다</li>
          <li><strong>빠른 접근</strong>: 헤더에서 관심 게임으로 바로 이동할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}

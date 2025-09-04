'use client';

import { useState } from 'react';
import { Game, GameServer } from '@/types/game';

interface SearchResult {
  game: Game;
  server?: GameServer;
  matchType: 'game' | 'server';
}

interface GameSearchProps {
  games: Game[];
  onSelectResult: (gameId: string, serverId?: string) => void;
}

export default function GameSearch({ games, onSelectResult }: GameSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const results: SearchResult[] = [];
    
    games.forEach(game => {
      // 게임명 검색
      if (game.name.toLowerCase().includes(term.toLowerCase())) {
        results.push({
          game,
          matchType: 'game'
        });
      }
      
      // 서버명 검색
      game.servers.forEach(server => {
        if (server.name.toLowerCase().includes(term.toLowerCase())) {
          results.push({
            game,
            server,
            matchType: 'server'
          });
        }
      });
    });

    setSearchResults(results.slice(0, 10)); // 최대 10개 결과
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult(result.game.id, result.server?.id);
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="game-search">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="게임명 또는 서버명을 검색하세요..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="search-icon">🔍</div>
      </div>

      {isSearching && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result, index) => (
            <div
              key={`${result.game.id}-${result.server?.id || 'game'}-${index}`}
              className="search-result-item"
              onClick={() => handleSelectResult(result)}
            >
              <div className="result-icon">{result.game.icon}</div>
              <div className="result-info">
                <div className="result-primary">
                  {result.matchType === 'game' ? (
                    <span>{result.game.name}</span>
                  ) : (
                    <span>{result.server?.name}</span>
                  )}
                </div>
                <div className="result-secondary">
                  {result.matchType === 'server' ? (
                    <span>{result.game.name}</span>
                  ) : (
                    <span>{result.game.category}</span>
                  )}
                </div>
              </div>
              <div className="result-type">
                {result.matchType === 'game' ? '게임' : '서버'}
              </div>
            </div>
          ))}
        </div>
      )}

      {isSearching && searchTerm.length >= 2 && searchResults.length === 0 && (
        <div className="search-no-results">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="content">
      <section className="hero-section">
        <h1 className="heading">모바일 게임 시세 확인</h1>
        <p className="hero-description">
          실시간으로 인기 모바일 게임의 서버별 게임머니 시세를 확인하고 비교하세요
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="cta-button primary">
            시세 확인하기
          </Link>
          {!user && (
            <Link href="/login" className="cta-button secondary">
              로그인
            </Link>
          )}
        </div>
      </section>

      <section className="features">
        <article className="card">
          <div className="card-icon">💰</div>
          <h2>실시간 시세 확인</h2>
          <p>
            각 서버별 게임머니 시세를 실시간으로 확인하고
            1000원당 얼마인지 정확한 환산 가격을 제공합니다.
          </p>
        </article>
        
        <article className="card">
          <div className="card-icon">📊</div>
          <h2>서버별 비교</h2>
          <p>
            여러 서버의 시세를 한눈에 비교하여
            가장 유리한 거래 조건을 찾아보세요.
          </p>
        </article>
        
        <article className="card">
          <div className="card-icon">🎮</div>
          <h2>다양한 게임 지원</h2>
          <p>
            인기 모바일 게임들의 시세 정보를 
            지속적으로 업데이트하여 제공합니다.
          </p>
        </article>
      </section>

      <section className="supported-games">
        <h2>지원 게임</h2>
        <div className="game-category">
          <h3 className="category-header">PC게임</h3>
          <div className="game-grid">
            <div className="game-item">🏰 리니지</div>
            <div className="game-item">🏹 리니지2</div>
            <div className="game-item">🍁 메이플스토리</div>
            <div className="game-item">⚔️ 던전앤파이터</div>
            <div className="game-item">🪶 아이온</div>
            <div className="game-item">⚡ 블레이드앤소울</div>
            <div className="game-item">🗡️ DK온라인</div>
            <div className="game-item">🏛️ 트로이온라인</div>
            <div className="game-item">🎯 반온라인</div>
            <div className="game-item">⚔️ 리그오브레전드</div>
            <div className="game-item">🌪️ 바람의나라</div>
            <div className="game-item">🗡️ 테라</div>
            <div className="game-item">🔫 서든어택</div>
            <div className="game-item">⚾ 마구마구</div>
            <div className="game-item">🐉 월드오브크래프트</div>
            <div className="game-item">🧚 마비노기</div>
            <div className="game-item">🧛 다크에덴</div>
            <div className="game-item">⚔️ 마비노기영웅전</div>
            <div className="game-item">🏺 삼국지W</div>
            <div className="game-item">⚾ 야구9단</div>
            <div className="game-item">🏮 SD삼국지</div>
            <div className="game-item">🌊 리프트</div>
            <div className="game-item">🧚‍♀️ 파인딩네버랜드</div>
            <div className="game-item">⚔️ 구검온라인</div>
            <div className="game-item">☁️ 룰더스카이</div>
            <div className="game-item">🥷 사이퍼즈</div>
            <div className="game-item">👹 디아블로3</div>
          </div>
        </div>
        
        <div className="game-category">
          <h3 className="category-header">모바일게임</h3>
          <div className="game-grid">
            <div className="game-item">🏰 리니지M</div>
            <div className="game-item">🏹 리니지2M</div>
            <div className="game-item">⚔️ 리니지W</div>
            <div className="game-item">🍀 메이플스토리M</div>
            <div className="game-item">💎 아이모</div>
            <div className="game-item">🛡️ 엘가드</div>
            <div className="game-item">🌀 카오스베인</div>
            <div className="game-item">⚾ 컴투스프로야구2012</div>
            <div className="game-item">👑 모나크</div>
            <div className="game-item">🛡️ 영웅시대30</div>
            <div className="game-item">🌙 청풍명월</div>
            <div className="game-item">🧙‍♂️ 신선도</div>
          </div>
        </div>
      </section>
    </main>
  );
}

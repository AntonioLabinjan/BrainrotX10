import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Infinity as InfinityIcon, Pause, Play, Zap } from 'lucide-react';
import './style.css';

const CHARACTERS = [
  { id: 'capybara', name: 'CEO Capybara', image: '/characters/capybara.webp', video: '/videos/capybara.mp4', color: '#d6a36a', tags: ['BUSINESS', 'GRINDSET', 'LINKEDIN'] },
  { id: 'pigeon', name: 'Crypto Pigeon', image: '/characters/pigeon.webp', video: '/videos/pigeon.mp4', color: '#9a91c9', tags: ['CRYPTO', 'TRADING', 'HODL'] },
  { id: 'frog', name: 'Finance Frog', image: '/characters/frog.webp', video: '/videos/frog.mp4', color: '#9bcf55', tags: ['ECONOMICS', 'TAXES', 'MATH'] },
  { id: 'raccoon', name: 'Wi-Fi Raccoon', image: '/characters/raccoon.webp', video: '/videos/raccoon.mp4', color: '#a5b5c8', tags: ['GAMING', 'TECH', 'CHAOS'] },
];
const HOOKS = [
  'BRO JUST DISCOVERED COMPOUND INTEREST 💀', 'POV: the rent is due but the vibes are immaculate',
  'HE SAID “LET ME COOK” AND OPENED EXCEL', 'the algorithm has chosen your financial advisor',
  'ONE MORE SCROLL. THIS IS YOUR FINAL WARNING.', 'me explaining my business model to the pigeons',
  'THE ECONOMY IS IN SHAMBLES BUT THIS GUY IS LOCKED IN', 'wake up babe, a new side quest just dropped',
  'bro has 17 tabs open and zero plans', 'this meeting could have been an hallucination',
  'NOT FINANCIAL ADVICE. NOT EVEN ADVICE.', 'the council will decide your attention span',
  'he invested the emergency fund in vibes', 'average Tuesday in the attention economy',
  'your last two brain cells are fighting for custody', 'SOMEONE TAKE THE ROUTER AWAY FROM HIM',
];
const SUBS = [
  'Experts are calling this “a development”.', 'Nobody was ready for the quarterly report.',
  'Sources confirm: absolutely nothing was learned.', 'The situation is evolving. Unfortunately.',
  'A historic moment for people who should log off.', 'This changes everything and absolutely nothing.',
  'The group chat has been notified.', 'Please consult a licensed cartoon animal.',
];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
let nextId = 1;
function makeCard() {
  const character = pick(CHARACTERS);
  return { id: nextId++, character, hook: pick(HOOKS), sub: pick(SUBS), tag: pick(character.tags), views: (Math.random() * 980 + 20).toFixed(1) + 'K', hue: Math.floor(Math.random() * 360) };
}
function makeBatch(count = 8) { return Array.from({ length: count }, makeCard); }

function VideoVisual({ character, paused, hook, sub, tag, id }) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
      rootMargin: '120px 0px',
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (visible && !paused) {
      const playPromise = video.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, paused, muted]);

  return <div className={`visual video-visual ${paused ? 'is-paused' : ''}`}>
    <video ref={videoRef} className="clip-video" src={character.video} poster={character.image}
      muted={muted} loop playsInline preload="metadata" aria-label={`${character.name} brainrot video`} />
    <div className="video-vignette" />
    <div className="visual-sticker">CERTIFIED<br/>BRAINROT</div>
    <div className="caption-wrap"><div className="caption-kicker">BREAKING: {tag} DEPARTMENT</div><h2>{hook}</h2><p>{sub}</p></div>
    <div className="scanline" />
    <span className="clip-number">CLIP #{String(id).padStart(5, '0')}</span>
    <button className="sound-toggle" onClick={() => setMuted(value => !value)} aria-label={muted ? 'Enable sound' : 'Mute video'}>{muted ? 'SOUND OFF' : 'SOUND ON'}</button>
    {!visible && <span className="play-hint">SCROLL TO PLAY</span>}
  </div>;
}

function FeedCard({ card, index, paused }) {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 900));
  const [liked, setLiked] = useState(false);
  return <article className="feed-card" style={{ '--accent': card.character.color, '--hue': card.hue, '--delay': `${(index % 5) * -1.1}s` }}>
    <div className="card-top"><span className="channel-dot" style={{ background: card.character.color }} /> <b>{card.character.name}</b><span className="tag">#{card.tag}</span><span className="views">{card.views} VIEWS</span></div>
    <VideoVisual character={card.character} paused={paused} hook={card.hook} sub={card.sub} tag={card.tag} id={card.id} />
    <div className="card-bottom"><span>▶ 00:{String(6 + (card.id % 5)).padStart(2, '0')}</span><span>VERTICAL VIDEO · AUTO-PLAY</span><button className={liked ? 'liked' : ''} onClick={() => { setLiked(!liked); setLikes(v => v + (liked ? -1 : 1)); }}>{liked ? '♥' : '♡'} {likes}</button></div>
  </article>;
}

function App() {
  const [cards, setCards] = useState(() => makeBatch(10));
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sessionStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const sentinel = useRef(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(() => {
    if (loadingRef.current || paused) return;
    loadingRef.current = true;
    setLoading(true);
    // Small delay mimics a real feed request and prevents scroll-event spam.
    window.setTimeout(() => {
      setCards(prev => [...prev, ...makeBatch(8)]);
      setLoaded(prev => prev + 8);
      setLoading(false);
      loadingRef.current = false;
    }, 280);
  }, [paused]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) loadMore();
    }, { root: null, rootMargin: '900px 0px', threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, cards.length]);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - sessionStart) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [sessionStart]);

  const time = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  return <div className="app">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Zap size={19} fill="currentColor" /></span><span>BRAINROT<span className="brand-x">X10</span></span><small>VERTICAL VIDEO LAB · v0.7</small></div>
      <div className="top-stats"><div><small>SESSION</small><b>{time}</b></div><div><small>CLIPS LOADED</small><b>{loaded.toLocaleString()}</b></div><div><small>FEED STATUS</small><b className={paused ? 'status-paused' : 'status-live'}>{paused ? 'PAUSED' : 'LIVE'}</b></div></div>
      <div className="controls"><button onClick={() => setPaused(v => !v)} className="control-btn primary">{paused ? <Play size={15}/> : <Pause size={15}/>} {paused ? 'RESUME' : 'PAUSE'}</button></div>
    </header>
    <main className="layout">
      <aside className="side-panel"><div className="panel-label">EXPERIMENT</div><div className="metric"><Activity size={16}/><div><small>ATTENTION STREAM</small><b>UNBOUNDED</b></div></div><div className="metric"><InfinityIcon size={17}/><div><small>CONTENT SUPPLY</small><b>INFINITE-ISH</b></div></div><div className="side-note"><span className="live-dot"/> AUTO-LOADING ENABLED</div><div className="side-foot">SCROLL TO CONTINUE<br/>THERE IS NO BOTTOM.</div></aside>
      <section className="feed" aria-label="Infinite brainrot feed">
        {cards.map((card, index) => <FeedCard key={card.id} card={card} index={index} paused={paused} />)}
        <div className="sentinel" ref={sentinel}>{loading ? <><span className="loader"/> GENERATING MORE BRAINROT...</> : <><InfinityIcon size={18}/> KEEP SCROLLING</>}</div>
      </section>
      <aside className="right-panel"><div className="panel-label">LIVE TELEMETRY</div><div className="telemetry"><small>GENERATED CLIPS</small><strong>{loaded}</strong><span>+8 PER LOAD</span></div><div className="telemetry"><small>SESSION TIMER</small><strong>{time}</strong><span>TIME WELL WASTED</span></div><div className="warning"><b>⚠ SCIENTIFIC DISCLAIMER</b><p>This is a satirical prototype. “Brainrot units” are not a validated scientific metric. Take breaks. Touch grass.</p></div><button className="reset-btn" onClick={() => { nextId = 1; setCards(makeBatch(10)); setLoaded(10); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>RESET THE FEED ↺</button></aside>
    </main>
    <footer> BRAINROT X10 <span>•</span> AUTOPLAY VERTICAL VIDEO FEED <span>•</span> MADE OF 100% QUESTIONABLE DECISIONS</footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);

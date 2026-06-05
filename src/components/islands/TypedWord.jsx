import { useState, useEffect } from 'react';

// The cycling/typing hero word. The only interactive piece on the homepage,
// so it is the only thing shipped to the browser as a hydrated island.
export default function TypedWord({ words = [], ink = '#E6EAF0' }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState(words[0] || '');
  const [phase, setPhase] = useState('hold');

  useEffect(() => {
    let timer;
    if (phase === 'hold') {
      timer = setTimeout(() => setPhase('deleting'), 2200);
    } else if (phase === 'deleting') {
      if (typed.length > 0) timer = setTimeout(() => setTyped(typed.slice(0, -1)), 40);
      else { setWordIdx((wordIdx + 1) % words.length); setPhase('typing'); }
    } else if (phase === 'typing') {
      const target = words[wordIdx];
      if (typed.length < target.length) timer = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 70);
      else setPhase('hold');
    }
    return () => clearTimeout(timer);
  }, [phase, typed, wordIdx, words]);

  return (
    <span style={{ display: 'inline-block', minHeight: '.85em' }}>
      {typed}
      <span
        style={{
          display: 'inline-block', width: '.08em', height: '.75em',
          background: ink, marginLeft: '.04em', verticalAlign: '-0.05em',
          animation: 'scgCaret 1s steps(1) infinite',
        }}
      />
    </span>
  );
}

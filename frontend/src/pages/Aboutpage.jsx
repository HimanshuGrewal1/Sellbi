import React from 'react';

const AboutPage = () => {
  const seed = import.meta.env.VITE_SEED;

  function hashSeedToColor(seed) {
    if (!seed) return "#999999"; 

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    return `rgb(${Math.abs(r)}, ${Math.abs(g)}, ${Math.abs(b)})`;
  }

  const backgroundColor = hashSeedToColor(seed);

  return (
    <div
      style={{
        backgroundColor,
        padding: '2rem',
        color: 'white',
        borderRadius: '10px',
        textAlign: 'center',
        fontFamily: 'monospace',
        margin: '2rem auto',
        maxWidth: '600px'
      }}
    >
      <h2>Assignment Seed</h2>
      {seed ? <p>{seed}</p> : <p style={{ color: 'red' }}>⚠️ Seed is missing!</p>}
    </div>
  );
};

export default AboutPage;

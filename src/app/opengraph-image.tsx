import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Own The Climb — Engineer Challenge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '999px',
              padding: '8px 20px',
              fontSize: '18px',
              color: '#60a5fa',
              letterSpacing: '0.05em',
            }}
          >
            OWN THE CLIMB
          </div>
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              padding: '8px 20px',
              fontSize: '18px',
              color: '#94a3b8',
            }}
          >
            15-MINUTE CHALLENGE
          </div>
        </div>

        {/* Main heading */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Engineer Challenge
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              lineHeight: 1.5,
              maxWidth: '700px',
            }}
          >
            PostgreSQL + Next.js proficiency test.
            No setup. No boilerplate. Just code.
          </div>
        </div>

        {/* Bottom row — tech tags */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          {['Next.js 15', 'PostgreSQL 17', 'TypeScript', 'Server Actions'].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '18px',
                  color: '#cbd5e1',
                }}
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}

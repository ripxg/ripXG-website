import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'ripXG';
  const description = searchParams.get('description') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #2d0a52 50%, #1a0533 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: '#f4c430',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '18px',
              fontWeight: 700,
              color: '#1a0533',
              letterSpacing: '-0.5px',
            }}
          >
            ripXG
          </div>
          <div style={{ color: '#a78bca', fontSize: '18px' }}>
            ripxg.com
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: title.length > 50 ? '52px' : '64px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: '24px',
                color: '#c4a8e0',
                lineHeight: 1.4,
                maxWidth: '820px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#a78bca', fontSize: '20px' }}>
            AI · Automation · Business
          </div>
          <div
            style={{
              background: 'rgba(244, 196, 48, 0.15)',
              border: '1px solid rgba(244, 196, 48, 0.4)',
              borderRadius: '100px',
              padding: '8px 20px',
              color: '#f4c430',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            @rip_xg
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

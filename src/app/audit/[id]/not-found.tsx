import Link from 'next/link';

export default function AuditNotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f9fafb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 24,
          padding: '56px 40px',
          textAlign: 'center',
          maxWidth: 440,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#f0fdf4',
            border: '1px solid #d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            margin: '0 auto 24px',
          }}
        >
          🔍
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#111827',
            marginBottom: 12,
          }}
        >
          Audit not found
        </h1>

        <p
          style={{
            fontSize: 15,
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          This audit link may have expired or the ID is incorrect.
          Run a fresh audit below — it only takes 2 minutes and is completely free.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            padding: '14px 28px',
            borderRadius: 12,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
          }}
        >
          Run your own free audit →
        </Link>

        <p style={{ fontSize: 12, color: '#d1d5db', marginTop: 24 }}>
          Powered by{' '}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
          >
            Credex
          </a>
        </p>
      </div>
    </main>
  );
}

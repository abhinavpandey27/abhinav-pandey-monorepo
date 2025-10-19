import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section
        style={{
          maxWidth: 640,
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 16,
          padding: '3rem 2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p
          style={{
            letterSpacing: '0.48em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            color: 'rgba(253, 252, 251, 0.64)',
            marginBottom: '1rem',
          }}
        >
          Coming Soon
        </p>
        <h1
          style={{
            margin: '0 0 1.5rem 0',
            fontSize: '2.5rem',
            lineHeight: 1.2,
          }}
        >
          Abhinav Pandey&apos;s portfolio experience is under construction.
        </h1>
        <p style={{ margin: '0 0 2rem 0', color: 'rgba(253, 252, 251, 0.72)' }}>
          We&apos;re getting the CMS and front-end pipeline online. Check back soon for the
          full interactive case studies, or follow the build progress on GitHub.
        </p>
        <Link
          href="https://github.com/abhinavpandey27/abhinav-pandey-monorepo"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: 999,
            background: '#fdfcfb',
            color: '#0b0c11',
            fontWeight: 600,
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          View progress on GitHub →
        </Link>
      </section>
    </main>
  );
}

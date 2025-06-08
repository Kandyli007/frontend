import type { AppProps } from 'next/app'
import Link from 'next/link'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header style={{
        padding: '1rem',
        background: '#ff8800',
        color: '#fff',
        display: 'flex',
        gap: '1rem',
      }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Home
        </Link>
        <Link href="/submit" style={{ color: '#fff', textDecoration: 'none' }}>
          Submit
        </Link>
        <Link href="/review" style={{ color: '#fff', textDecoration: 'none' }}>
          Review
        </Link>
      </header>
      <Component {...pageProps} />
    </>
  )
}

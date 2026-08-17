import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in APL Application:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#0a0b10',
          color: '#ffffff',
          fontFamily: 'var(--font-display, sans-serif)',
        }}>
          <div style={{
            fontSize: '4rem',
            color: 'var(--brand-gold, #faa718)',
            marginBottom: '1rem'
          }}>⚠️</div>
          <h2 style={{
            fontSize: '2rem',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>Something Went Wrong</h2>
          <p style={{
            color: '#a0aec0',
            maxWidth: '500px',
            marginBottom: '2rem',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            An error occurred while loading this page. This could be due to a temporary network issue. Please try reloading the application.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: 'var(--brand-gold, #faa718)',
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'transform 0.2s, filter 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)' }}
            onMouseOut={(e) => { e.currentTarget.style.filter = 'none' }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

import { useState, type FormEvent } from 'react'

type LoginPageProps = {
  onLogin: (email: string) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onLogin(email.trim())
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <a className="brand login-brand" href="#">
          <span className="brand-mark" aria-hidden="true">c</span>
          <span>cartellow<span className="brand-dot">.</span></span>
        </a>

        <div className="login-content">
          <span className="eyebrow">YOUR BUSINESS, IN GOOD ORDER</span>
          <h1>Welcome back<span className="brand-dot">.</span></h1>
          <p className="login-intro">Sign in to manage your catalog and keep your orders moving.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Work email</label>
            <input
              autoComplete="email"
              id="login-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
              type="email"
              value={email}
            />
            <button className="button button-primary login-submit" type="submit">
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="login-note">Authentication will be connected when the account API is ready.</p>
        </div>

        <footer className="login-footer">
          <span>© 2026 Cartellow</span>
          <a href="mailto:support@cartellow.com">Contact support</a>
        </footer>
      </section>
      <aside className="login-aside">
        <div className="login-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-card">
            <span className="art-card-label">YOUR CATALOG</span>
            <span className="art-card-title">Thoughtfully<br />put together.</span>
            <div className="art-card-items">
              <span className="art-item art-item-one" />
              <span className="art-item art-item-two" />
              <span className="art-item art-item-three" />
            </div>
            <div className="art-card-footer"><span>Share with your customers</span><span>↗</span></div>
          </div>
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✳</span>
        </div>
        <div className="login-aside-copy">
          <span className="eyebrow">A LITTLE MORE ORDER</span>
          <h2>Everything your customers need, all in one place.</h2>
          <p>Keep your catalog fresh and your business moving forward.</p>
        </div>
        <div className="aside-pagination" aria-label="Slide 1 of 3">
          <span className="selected" /><span /><span />
        </div>
      </aside>
    </main>
  )
}

export default LoginPage

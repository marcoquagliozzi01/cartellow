type HomePageProps = {
  onOpenCatalog: () => void
}

const recentActivity = [
  { initials: 'LM', name: 'Lucia Moretti', detail: 'placed a new order', time: '12 min ago', amount: '€ 84.00', tone: 'peach' },
  { initials: 'GS', name: 'Giovanni Serra', detail: 'placed a new order', time: '1 hour ago', amount: '€ 126.50', tone: 'sage' },
  { initials: 'AB', name: 'Anna Bianchi', detail: 'placed a new order', time: 'Yesterday', amount: '€ 42.00', tone: 'lilac' },
]

function HomePage({ onOpenCatalog }: HomePageProps) {
  return (
    <>
      <header className="topbar">
        <div className="breadcrumbs"><span>Workspace</span><span className="crumb-divider">/</span><strong>Overview</strong></div>
        <div className="topbar-actions">
          <span className="date-label">Monday, 26 October</span>
          <button className="notification-button" aria-label="Notifications"><span>♧</span><i /></button>
        </div>
      </header>

      <div className="page-body">
        <section className="welcome-row">
          <div>
            <span className="eyebrow">MONDAY, OCTOBER 26, 2026</span>
            <h1>Good morning<span className="brand-dot">.</span></h1>
            <p>Here’s what’s happening with your store today.</p>
          </div>
          <button className="button button-primary" onClick={onOpenCatalog}>
            <span aria-hidden="true">＋</span> Configure catalog
          </button>
        </section>

        <section className="stat-grid" aria-label="Store statistics">
          <article className="stat-card">
            <div className="stat-heading"><span>Orders this month</span><span className="stat-icon orange">↗</span></div>
            <div className="stat-value">128</div>
            <div className="stat-foot"><span className="trend-up">↑ 12.8%</span><span>vs. last month</span></div>
            <div className="mini-chart chart-orders" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </article>
          <article className="stat-card">
            <div className="stat-heading"><span>Revenue this month</span><span className="stat-icon green">€</span></div>
            <div className="stat-value">€ 8,420</div>
            <div className="stat-foot"><span className="trend-up">↑ 8.2%</span><span>vs. last month</span></div>
            <div className="mini-chart chart-revenue" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </article>
          <article className="stat-card">
            <div className="stat-heading"><span>Catalog products</span><span className="stat-icon lilac">▦</span></div>
            <div className="stat-value">36</div>
            <div className="stat-foot"><span className="stat-foot-plain">Across 4 categories</span></div>
            <div className="category-dots" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel activity-panel">
            <div className="panel-heading">
              <div><h2>Recent orders</h2><p>A quick look at your latest activity.</p></div>
              <button className="text-button">View all <span aria-hidden="true">→</span></button>
            </div>
            <div className="activity-table">
              <div className="table-head"><span>CUSTOMER</span><span>WHEN</span><span>AMOUNT</span></div>
              {recentActivity.map((activity) => (
                <div className="activity-row" key={activity.name}>
                  <div className="customer-cell">
                    <span className={`customer-avatar ${activity.tone}`}>{activity.initials}</span>
                    <span><strong>{activity.name}</strong><small>{activity.detail}</small></span>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                  <strong className="activity-amount">{activity.amount}</strong>
                </div>
              ))}
            </div>
            <button className="mobile-view-all text-button">View all orders <span aria-hidden="true">→</span></button>
          </article>

          <article className="panel catalog-panel">
            <div className="panel-heading"><div><h2>Your catalog</h2><p>How customers see your store.</p></div></div>
            <div className="catalog-preview">
              <div className="preview-top"><span className="preview-mark">c</span><span className="preview-menu">···</span></div>
              <div className="preview-image"><span>✳</span><span>✳</span></div>
              <span className="preview-label">A LITTLE SOMETHING GOOD</span>
              <strong>Made with care,<br />chosen by you.</strong>
              <div className="preview-products"><i /><i /><i /></div>
            </div>
            <div className="catalog-status"><span className="status-dot" /> Published <span className="status-divider">·</span> Updated today</div>
            <button className="button button-secondary full-width" onClick={onOpenCatalog}>Manage catalog <span aria-hidden="true">→</span></button>
          </article>
        </section>
      </div>
    </>
  )
}

export default HomePage

import { useState, type FormEvent } from 'react'

function CatalogConfigurationPage() {
  const [catalogName, setCatalogName] = useState('Casa Verde')
  const [description, setDescription] = useState('Thoughtful things for everyday living, made with care in Italy.')
  const [storeEmail, setStoreEmail] = useState('orders@casaverde.it')
  const [catalogSlug, setCatalogSlug] = useState('casa-verde')
  const [isPublished, setIsPublished] = useState(true)
  const [allowRequests, setAllowRequests] = useState(true)
  const [showPrices, setShowPrices] = useState(true)
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <header className="topbar">
        <div className="breadcrumbs"><span>Workspace</span><span className="crumb-divider">/</span><strong>Catalog settings</strong></div>
        <div className="topbar-actions">
          <span className="date-label">Monday, 26 October</span>
          <button className="notification-button" aria-label="Notifications"><span>♧</span><i /></button>
        </div>
      </header>

      <div className="page-body settings-body">
        <section className="welcome-row settings-title-row">
          <div>
            <span className="eyebrow">YOUR STORE</span>
            <h1>Catalog settings<span className="brand-dot">.</span></h1>
            <p>Make your catalog feel like your business.</p>
          </div>
          <div className={`publish-badge ${isPublished ? 'published' : 'draft'}`}>
            <span className="status-dot" />{isPublished ? 'Published' : 'Draft'}
          </div>
        </section>

        <form className="settings-form" onSubmit={handleSubmit}>
          <section className="settings-section panel">
            <div className="settings-section-heading">
              <span className="section-number">01</span>
              <div><h2>Store identity</h2><p>Set the details customers see when they visit your catalog.</p></div>
            </div>
            <div className="settings-fields">
              <div className="field-group">
                <label htmlFor="catalog-name">Catalog name</label>
                <input id="catalog-name" onChange={(event) => setCatalogName(event.target.value)} required value={catalogName} />
                <span className="field-hint">Keep it short and easy to recognize.</span>
              </div>
              <div className="field-group">
                <label htmlFor="catalog-description">Short description</label>
                <textarea id="catalog-description" onChange={(event) => setDescription(event.target.value)} rows={3} value={description} />
                <span className="field-hint">A little introduction to your store.</span>
              </div>
            </div>
          </section>

          <section className="settings-section panel">
            <div className="settings-section-heading">
              <span className="section-number">02</span>
              <div><h2>Catalog link</h2><p>This is the link you can share with your customers.</p></div>
            </div>
            <div className="field-group">
              <label htmlFor="catalog-slug">Your public link</label>
              <div className="url-field"><span>cartellow.app/</span><input id="catalog-slug" onChange={(event) => setCatalogSlug(event.target.value)} required value={catalogSlug} /></div>
              <span className="field-hint">Use lowercase letters and hyphens only.</span>
            </div>
            <div className="field-group email-field">
              <label htmlFor="store-email">Order notifications</label>
              <input autoComplete="email" id="store-email" onChange={(event) => setStoreEmail(event.target.value)} required type="email" value={storeEmail} />
              <span className="field-hint">We’ll let you know when a customer places an order.</span>
            </div>
          </section>

          <section className="settings-section panel">
            <div className="settings-section-heading">
              <span className="section-number">03</span>
              <div><h2>Customer experience</h2><p>Choose what customers can see and do in your catalog.</p></div>
            </div>
            <label className="toggle-row">
              <span><strong>Publish catalog</strong><small>Make your catalog visible to anyone with the link.</small></span>
              <input checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} type="checkbox" />
              <span className="toggle-switch" aria-hidden="true" />
            </label>
            <label className="toggle-row">
              <span><strong>Accept order requests</strong><small>Let customers send you an order directly from the catalog.</small></span>
              <input checked={allowRequests} onChange={(event) => setAllowRequests(event.target.checked)} type="checkbox" />
              <span className="toggle-switch" aria-hidden="true" />
            </label>
            <label className="toggle-row">
              <span><strong>Show product prices</strong><small>Display prices alongside your products.</small></span>
              <input checked={showPrices} onChange={(event) => setShowPrices(event.target.checked)} type="checkbox" />
              <span className="toggle-switch" aria-hidden="true" />
            </label>
          </section>

          <div className="settings-actions">
            {saved && <span className="save-confirmation" role="status">Your catalog settings have been saved.</span>}
            <button className="button button-primary" type="submit">Save changes <span aria-hidden="true">→</span></button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CatalogConfigurationPage

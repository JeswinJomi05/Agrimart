import { useEffect, useRef, useState } from 'react'
import logo from '../assets/Agrimart Green Leaf Logo.png'
import hero from '../assets/Hero landscape.png'
import agricultural from '../assets/Product image.png'
import cutting from '../assets/Product image-1.png'
import spraying from '../assets/Product image-2.png'
import water from '../assets/Product image-3.png'
import engines from '../assets/Product image-4.png'
import other from '../assets/Product image-5.png'
import field from '../assets/field-banner.jpg'
import './App.css'
import TestimonialsSection from './components/ui/testimonial-v2'
import { useScrollMotion } from './hooks/useScrollMotion'

const categories = [
  { id: 'agricultural', image: agricultural, name: 'Agricultural Machinery', lines: ['Agricultural', 'Machinery'], description: 'Power tillers, cultivators and dependable machinery for your farm.' },
  { id: 'cutting', image: cutting, name: 'Cutting & Garden Equipment', lines: ['Cutting &', 'Garden Equipment'], description: 'Chainsaws, brush cutters and tools to keep your garden in shape.' },
  { id: 'spraying', image: spraying, name: 'Spraying Equipment', lines: ['Spraying', 'Equipment'], description: 'Portable sprayers and crop care equipment for everyday farming.' },
  { id: 'water', image: water, name: 'Water & Irrigation', lines: ['Water &', 'Irrigation'], description: 'Water pumps and irrigation equipment for efficient water management.' },
  { id: 'engines', image: engines, name: 'Engines & Power Equipment', lines: ['Engines &', 'Power Equipment'], description: 'Generators and engines for reliable power when you need it.' },
  { id: 'other', image: other, name: 'Other Equipment', lines: ['Other Equipment'], description: 'Explore more equipment for your farm, home and business.' },
]

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7.4 3.2 2.2 4.4a1.5 1.5 0 0 1-.3 1.7l-1.4 1.4a14.4 14.4 0 0 0 5.4 5.4l1.4-1.4a1.5 1.5 0 0 1 1.7-.3l4.4 2.2a1.5 1.5 0 0 1 .8 1.6l-.4 2a2 2 0 0 1-2 1.6C10.3 21.8 2.2 13.7 2.2 4.8a2 2 0 0 1 1.6-2l2-.4a1.5 1.5 0 0 1 1.6.8Z" /></svg>
}

function App() {
  useScrollMotion()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [slide, setSlide] = useState(0)
  const slides = [
    { title: <>BUILT FOR THE FIELD.<br /><span>READY FOR YOU.</span></>, label: 'Agricultural machinery & equipment', image: hero, alt: 'Power tiller in the green fields of Wayanad' },
    { title: <>MORE POWER.<br /><span>MORE POSSIBILITY.</span></>, label: 'Equipment for every season', image: field, alt: 'Tractor cultivating an agricultural field' },
  ]
  const visibleCategories = categories.filter(category => (filter === 'all' || category.id === filter) && `${category.name} ${category.description}`.toLowerCase().includes(query.toLowerCase()))
  const [menuOpen, setMenuOpen] = useState(false)
  const [panel, setPanel] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const selected = categories.find(category => category.id === panel)

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })
    function showAll() {
      if (preference.matches) {
        elements.forEach(element => element.classList.add('is-visible'))
        observer.disconnect()
      }
    }
    function revealFocused(event: FocusEvent) {
      if (event.target instanceof Element) event.target.closest('[data-reveal]')?.classList.add('is-visible')
    }
    elements.forEach(element => {
      element.classList.add('reveal-ready')
      observer.observe(element)
    })
    showAll()
    preference.addEventListener('change', showAll)
    document.addEventListener('focusin', revealFocused)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', showAll)
      document.removeEventListener('focusin', revealFocused)
      elements.forEach(element => element.classList.remove('reveal-ready'))
    }
  }, [query, filter])

  useEffect(() => {
    if (panel && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal()
  }, [panel])

  function openPanel(id: string) {
    setMenuOpen(false)
    setPanel(id)
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="utility-bar" id="home"><span>Rooted in Wayanad. Ready for every season.</span><span>Equipment · Supplies · Service <span className="utility-dot">●</span> Since 2010</span></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Agrimart home">
          <img src={logo} alt="Agrimart — Farm Equipment · Supplies · Service" width="2172" height="724" />
        </a>
        <form className="header-search" role="search" onSubmit={event => { event.preventDefault(); setFilter('all'); document.getElementById('products')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); setMenuOpen(false) }}>
          <input aria-label="Search equipment" placeholder="Find your equipment…" value={query} onChange={event => setQuery(event.target.value)} />
          <button type="submit" aria-label="Search products"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" /></svg></button>
        </form>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={menuOpen ? 'm6 6 12 12M6 18 18 6' : 'M4 6h16M4 12h16M4 18h16'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <nav id="main-navigation" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation">
          <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About Us</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
          <button className="nav-contact" onClick={() => openPanel('contact')}><PhoneIcon /> Contact Us <ArrowIcon /></button>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <img key={slide} className="hero-artwork" src={slides[slide].image} alt={slides[slide].alt} fetchPriority="high" />
          <div className="hero-topline"><span>AGRIMART / WAYANAD</span><span className="hero-tag">Your local equipment partner</span></div>
          <div className="hero-content" key={`content-${slide}`}>
            <p className="eyebrow">{slides[slide].label}</p>
            <h1 id="hero-title">{slides[slide].title}</h1>
            <p className="hero-description">Dependable machinery. Practical advice. Local support.<br />Everything you need to make the next season count.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#products">Explore Products <ArrowIcon /></a>
              <button className="secondary-button" onClick={() => openPanel('contact')}>Let’s talk <ArrowIcon /></button>
            </div>
          </div>
          <div className="hero-bottom"><span>GROW WITH CONFIDENCE</span><div className="slide-controls"><button aria-label="Previous banner" onClick={() => setSlide((slide + 1) % slides.length)}>←</button>{slides.map((_, index) => <button className={`slide-dot ${slide === index ? 'selected' : ''}`} key={index} aria-label={`Show banner ${index + 1}`} aria-pressed={slide === index} onClick={() => setSlide(index)} />)}<button aria-label="Next banner" onClick={() => setSlide((slide + 1) % slides.length)}>→</button></div><span>0{slide + 1} / 02</span></div>
        </section>

        <a className="catalog-tab" href="#products">Explore the catalog <ArrowIcon /></a>

        <section className="highlights section-container" aria-labelledby="highlights-title">
          <div className="section-heading" data-reveal><div><p className="section-label">Ready for the work ahead</p><h2 id="highlights-title">A tool for every ambition.</h2></div><span className="heading-note">From your backyard to your biggest field.</span></div>
          <div className="highlight-grid">
            {[{ id: 'agricultural', label: 'FOR THE FIELD', title: 'Make light work\nof hard ground.', image: agricultural }, { id: 'cutting', label: 'FOR THE GARDEN', title: 'Keep your green\nin great shape.', image: cutting }, { id: 'water', label: 'FOR EVERY SEASON', title: 'Keep the water.\nKeep growing.', image: water }].map((item, index) => <button className={`highlight-card highlight-${index}`} key={item.id} onClick={() => openPanel(item.id)} data-reveal><span className="highlight-label">{item.label}</span><h3>{item.title}</h3><img src={item.image} alt="" loading="lazy" /><span className="highlight-link">Explore equipment <ArrowIcon /></span></button>)}
          </div>
        </section>

        <section className="products section-container" id="products" aria-labelledby="products-title">
          <div className="products-heading" data-reveal>
            <div>
              <p className="section-label">The Agrimart catalog</p>
              <h2 id="products-title">Find your next workhorse.</h2>
              <p className="section-description">Purpose-built equipment for your farm, garden and everything in between.</p>
            </div>
            <button className="view-products" onClick={() => openPanel('products')}>View All Products <ArrowIcon /></button>
          </div>
          <div className="catalog-filters" aria-label="Filter equipment">{[{ id: 'all', name: 'All equipment' }, ...categories].map(category => <button key={category.id} className={filter === category.id ? 'selected' : ''} aria-pressed={filter === category.id} onClick={() => setFilter(category.id)}>{category.id === 'all' ? 'All equipment' : category.name.replace(' Equipment', '')}</button>)}</div>
          <p className="catalog-count" role="status">{visibleCategories.length} equipment {visibleCategories.length === 1 ? 'category' : 'categories'}{query && <> matching “{query}” <button onClick={() => setQuery('')}>Clear search ×</button></>}</p>
          <div className="category-grid">
            {visibleCategories.map((category, index) => (
              <button className="category-card" data-reveal key={category.id} onClick={() => openPanel(category.id)}>
                <span className="category-index">AGRIMART / 0{index + 1}</span>
                <img src={category.image} alt="" width="140" height="130" loading="lazy" />
                <span className="category-name">{category.name}</span>
                <span className="category-description">{category.description}</span>
                <span className="category-action">Discover equipment <ArrowIcon /></span>
              </button>
            ))}
          </div>
          {visibleCategories.length === 0 && <div className="empty-catalog"><h3>No equipment found</h3><p>Try a different search or browse all equipment.</p><button className="primary-button" onClick={() => { setQuery(''); setFilter('all') }}>Reset filters <ArrowIcon /></button></div>}
        </section>

        <section className="advantages" id="services" aria-labelledby="advantages-title"><div className="section-container"><div className="section-heading" data-reveal><div><p className="section-label">More than machinery</p><h2 id="advantages-title">The right partner.<br />A better way forward.</h2></div><p className="heading-note">Real people. Practical know-how.<br />Support that stays close to home.</p></div><div className="advantages-grid">{[{ title: 'Advice that makes sense', text: 'Talk through your needs with a team that understands the equipment and the work it has to do.' }, { title: 'Tools for the real world', text: 'Explore machinery, garden tools and power equipment chosen for everyday agricultural needs.' }, { title: 'Support beyond the sale', text: 'Visit our local team for product care guidance, service enquiries and ongoing support.' }, { title: 'Rooted in your community', text: 'Serving Wayanad since 2010, with a commitment to reliable products and genuine service.' }].map((item, index) => <article data-reveal key={item.title}><span className="advantage-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><button className="text-button" onClick={() => openPanel('services')}>Discover our service & support <ArrowIcon /></button></div></section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="section-container">
            <div className="about-grid" data-reveal>
              <div className="about-visual"><img className="store-image" src="/images/store.png" alt="Agrimart Wayanad storefront" width="245" height="139" loading="lazy" /><span className="about-stamp">SINCE<br /><b>2010</b><br />WAYANAD, KERALA</span></div>
              <div className="about-copy">
                <p className="section-label">Local roots. Lasting relationships.</p>
                <h2 id="about-title">Your field.<br />Our commitment.</h2>
                <p>Established in 2010, Agrimart Wayanad has been serving the farming community with quality agricultural machinery, power equipment and garden tools. We are committed to providing reliable products, genuine service and expert support to help farmers and homeowners achieve better results.</p>
                <button className="text-button" onClick={() => openPanel('contact')}>Meet your local equipment partner <ArrowIcon /></button>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />
        <div className="review-invitation section-container"><p>Have a question about your next purchase?</p><button className="text-button" onClick={() => openPanel('contact')}>Talk to our team <ArrowIcon /></button></div>
      </main>

      <footer className="site-footer">
        <div className="section-container">
          <div className="footer-callout" data-reveal>
            <div><p className="footer-eyebrow">Here for your next season</p><h2>Let’s find the right tools<br />for the work ahead.</h2></div>
            <button className="footer-contact" onClick={() => openPanel('contact')}>Get in touch <ArrowIcon /></button>
          </div>
          <div className="footer-grid">
            <div className="footer-brand"><a href="#home" aria-label="Agrimart home"><img src={logo} alt="Agrimart" width="2172" height="724" loading="lazy" /></a><p>Equipment you can depend on.<br />Local guidance you can count on.</p><span className="footer-location">Wayanad, Kerala · Since 2010</span></div>
            <nav aria-label="Footer navigation"><h3>Explore</h3><a href="#home">Home</a><a href="#products">Our products</a><a href="#about">About Agrimart</a><a href="#reviews">Customer reviews</a></nav>
            <nav aria-label="Equipment categories"><h3>Equipment</h3><button onClick={() => openPanel('agricultural')}>Agricultural machinery</button><button onClick={() => openPanel('cutting')}>Garden & cutting tools</button><button onClick={() => openPanel('water')}>Water & irrigation</button><button onClick={() => openPanel('engines')}>Engines & power</button></nav>
            <div className="footer-support"><h3>Here to help</h3><p>Visit our Wayanad showroom for product advice and service enquiries.</p><button className="text-button" onClick={() => openPanel('services')}>Service & support <ArrowIcon /></button><button className="text-button" onClick={() => openPanel('contact')}>Contact our team <ArrowIcon /></button></div>
          </div>
          <div className="footer-bottom"><p>© {new Date().getFullYear()} Agrimart Wayanad. All rights reserved.</p><a href="#home">Back to top <span aria-hidden="true">↑</span></a></div>
        </div>
      </footer>

      {panel && (
        <dialog ref={dialogRef} className="detail-dialog" aria-labelledby="dialog-title" onClose={() => setPanel(null)} onClick={event => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect()
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setPanel(null)
          }
        }}>
          <button className="close-button" autoFocus onClick={() => setPanel(null)} aria-label="Close dialog">✕</button>
          <p className="section-label">Agrimart Wayanad</p>
          <h2 id="dialog-title">{selected?.name ?? (panel === 'services' ? 'Service & Support' : panel === 'contact' ? 'Contact Agrimart' : 'Our Products')}</h2>
          {selected ? (
            <><img className="detail-image" src={selected.image} alt={selected.name} width="140" height="130" /><p>{selected.description}</p><p>Visit our Wayanad store for product availability, pricing and expert advice.</p></>
          ) : panel === 'products' ? (
            <div className="catalog-list">{categories.map(category => <button key={category.id} onClick={() => setPanel(category.id)}><img src={category.image} alt="" width="140" height="130" /><span>{category.name}</span><ArrowIcon /></button>)}</div>
          ) : panel === 'services' ? (
            <p>Get expert guidance on agricultural machinery, power equipment and garden tools. Visit Agrimart Wayanad for product support and service enquiries.</p>
          ) : (
            <><p>Visit our showroom in Wayanad for equipment enquiries, product availability and service support.</p><p>Our team can help you choose the right equipment for your farm or garden.</p></>
          )}
        </dialog>
      )}
    </>
  )
}

export default App

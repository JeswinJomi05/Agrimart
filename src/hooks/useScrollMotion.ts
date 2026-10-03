import { useEffect } from 'react'

/** Native scrolling with lightweight visual effects; wheel and touch stay native. */
export function useScrollMotion() {
  useEffect(() => {
    const root = document.documentElement
    const header = document.querySelector<HTMLElement>('.site-header')
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let pageHeight = 1
    let heroHeight = 1

    function measure() {
      pageHeight = Math.max(1, root.scrollHeight - window.innerHeight)
      heroHeight = document.querySelector('.hero')?.clientHeight ?? 1
      schedule()
    }

    function update() {
      frame = 0
      const scroll = Math.max(0, window.scrollY)
      header?.classList.toggle('is-scrolled', scroll > 24)
      root.style.setProperty('--scroll-progress', String(Math.min(1, scroll / pageHeight)))
      root.style.setProperty('--hero-offset', preference.matches ? '0px' : `${Math.min(scroll, heroHeight) * 0.08}px`)
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    resizeObserver?.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    preference.addEventListener('change', schedule)
    measure()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      preference.removeEventListener('change', schedule)
      header?.classList.remove('is-scrolled')
      root.style.removeProperty('--scroll-progress')
      root.style.removeProperty('--hero-offset')
    }
  }, [])
}

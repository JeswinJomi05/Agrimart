import { useRef, useState } from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { Moon, Quote, Sun } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface Testimonial {
  text: string
  image: string
  name: string
  role: string
}

const portraits = ['photo-1500648767791-00dcc994a43e', 'photo-1494790108377-be9c29b29330', 'photo-1506794778202-cad84cf45f1d']

// Illustrative copy and stock portraits, never represented as verified reviews.
const sampleTestimonials: Testimonial[] = [
  { text: 'The team took the time to understand what I needed for my farm and helped me find the right equipment.', name: 'Farm equipment customer', role: 'Agricultural machinery' },
  { text: 'Helpful advice and practical guidance on using and caring for my new tools made the whole experience straightforward.', name: 'Garden equipment customer', role: 'Garden & cutting tools' },
  { text: 'It is reassuring to have a local team to turn to for advice when choosing equipment for the next season.', name: 'Water pump customer', role: 'Water & irrigation' },
  { text: 'Being able to compare different options with someone who understands the work made choosing a machine much easier.', name: 'Machinery customer', role: 'Equipment guidance' },
  { text: 'The team explained how to maintain my equipment and helped me feel confident before putting it to work.', name: 'Power equipment customer', role: 'Engines & power' },
  { text: 'I appreciated the clear answers to my questions about which tools would suit a smaller garden.', name: 'Home garden customer', role: 'Garden tools' },
  { text: 'A nearby showroom makes it easier to see the equipment in person and talk through what the farm needs.', name: 'Local farming customer', role: 'Showroom experience' },
  { text: 'Practical product advice helped me understand the differences between the spraying equipment available.', name: 'Crop care customer', role: 'Spraying equipment' },
  { text: 'It is good to know there is a local team I can visit for equipment care and service enquiries.', name: 'Equipment owner', role: 'Service & support' },
].map((review, index) => ({ ...review, image: `https://images.unsplash.com/${portraits[index % portraits.length]}?auto=format&fit=crop&w=80&h=80&q=80` }))

function TestimonialsColumn({ testimonials, duration, paused, reducedMotion, className }: {
  testimonials: Testimonial[]
  duration: number
  paused: boolean
  reducedMotion: boolean
  className?: string
}) {
  const columnRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const y = useMotionValue('0%')
  const inView = useInView(columnRef, { amount: 0.05 })

  useAnimationFrame((_, delta) => {
    if (paused || reducedMotion || !inView || document.hidden) return
    // Both copies have identical trailing spacing, so -50% loops seamlessly.
    progress.current = (progress.current + Math.min(delta, 64) / (duration * 1000)) % 1
    y.set(`${-progress.current * 50}%`)
  })

  return (
    <div ref={columnRef} className={cn('min-w-0 flex-1', className)}>
      <motion.div style={{ y: reducedMotion ? '0%' : y }}>
        {Array.from({ length: reducedMotion ? 1 : 2 }, (_, copy) => (
          <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className="m-0 flex list-none flex-col gap-6 p-0 pb-6">
            {testimonials.map(({ text, image, name, role }, index) => (
              <motion.li key={`${name}-${index}`} whileHover={reducedMotion ? undefined : { y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="rounded-3xl border border-border bg-card p-7 text-card-foreground shadow-lg shadow-black/5 dark:border-white/10 dark:bg-[#053326] dark:text-white">
                <Quote aria-hidden="true" className="mb-4 h-6 w-6 text-primary" />
                <blockquote className="m-0 p-0">
                  <p className="text-sm leading-relaxed text-muted-foreground dark:text-[#b8ccc1]">{text}</p>
                  <footer className="mt-6 flex items-center gap-3">
                    <img width={40} height={40} src={image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-primary/10" onError={event => { event.currentTarget.style.display = 'none' }} />
                    <div className="min-w-0"><cite className="block text-xs font-semibold not-italic leading-5">{name}</cite><span className="block text-xs leading-5 text-muted-foreground dark:text-[#b8ccc1]">{role}</span></div>
                  </footer>
                </blockquote>
              </motion.li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  )
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
  id?: string
  title?: string
  description?: string
  sampleContent?: boolean
  showThemeToggle?: boolean
}

export default function TestimonialsSection({
  testimonials = sampleTestimonials,
  id = 'reviews',
  title = 'Good equipment. Better experiences.',
  description = 'From the first enquiry to ongoing care, your experience matters to us.',
  sampleContent = true,
  showThemeToggle = false,
}: TestimonialsSectionProps) {
  const reducedMotion = Boolean(useReducedMotion())
  const [hovered, setHovered] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const columnCount = Math.min(3, testimonials.length)
  const columns = Array.from({ length: columnCount }, (_, column) => testimonials.filter((_, index) => index % columnCount === column))

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('testimonial-section relative overflow-hidden py-16 md:py-24', isDark && 'dark bg-[#053326] text-white')}>
      <div className="section-container">
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="mx-auto mb-8 max-w-xl text-center">
            <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">Our community</span>
            <h2 id={`${id}-title`} className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground dark:text-[#b8ccc1]">{description}</p>
            {sampleContent && <p className="mt-3 text-xs text-muted-foreground dark:text-[#b8ccc1]">Sample reviews · illustrative content · stock portraits</p>}
          </div>
          {showThemeToggle && <div className="mb-6 flex items-center justify-center gap-3">
            {showThemeToggle && <button type="button" aria-label={isDark ? 'Use light theme for testimonials' : 'Use dark theme for testimonials'} aria-pressed={isDark} onClick={() => setIsDark(!isDark)} className="grid h-9 w-9 place-items-center rounded-full border border-primary/20 text-primary">{isDark ? <Sun size={16} /> : <Moon size={16} />}</button>}
          </div>}
          <div role="region" aria-label={sampleContent ? 'Scrolling sample reviews' : 'Customer reviews'} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={cn('flex justify-center gap-6', !reducedMotion && 'h-[580px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] md:h-[680px]', reducedMotion && 'flex-col md:flex-row')}>
            {columns.map((column, index) => <TestimonialsColumn key={index} testimonials={column} duration={[28, 34, 31][index]} paused={hovered} reducedMotion={reducedMotion} className={!reducedMotion ? ['max-w-sm', 'hidden max-w-sm md:block', 'hidden max-w-sm lg:block'][index] : undefined} />)}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

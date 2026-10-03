"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion"
import { cn } from "@/lib/utils" // Assumes a 'lib/utils.ts' file for 'cn'
import { X } from "lucide-react"

// Defines the structure for each image item in the gallery
export type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  span: string // Tailwind CSS grid span classes (e.g., "md:col-span-2")
}

// Defines the props for the main gallery component
interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  title: string
  description: string
  layout?: "drag" | "grid"
}

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Animation variants for each gallery item
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
}

// Modal component for displaying the selected image
const ImageModal = ({
  item,
  onClose,
}: {
  item: ImageItem
  onClose: () => void
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label={item.title}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex h-full items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl"
          onClick={(event) => event.stopPropagation()}
        >
          <img src={item.url} alt={item.title} className="block max-h-[85dvh] w-full rounded-lg object-contain" />
        </motion.div>
        <button type="button" onClick={onClose} autoFocus
          className="absolute right-4 top-4 rounded-full bg-black/60 p-3 text-white"
          aria-label="Close image view"><X size={24} /></button>
      </motion.div>
    </dialog>
  )
}

// Main gallery component
const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description, layout = "drag" }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const [dragConstraint, setDragConstraint] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const targetRef = useRef<HTMLDivElement>(null)

  // Calculate the draggable area constraint
  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const gridWidth = gridRef.current.scrollWidth
        const newConstraint = Math.min(0, containerWidth - gridWidth)
        setDragConstraint(newConstraint)
      }
    }

    calculateConstraints()
    const observer = new ResizeObserver(calculateConstraints)
    if (containerRef.current) observer.observe(containerRef.current)
    if (gridRef.current) observer.observe(gridRef.current)
    window.addEventListener("resize", calculateConstraints)
    return () => { observer.disconnect(); window.removeEventListener("resize", calculateConstraints) }
  }, [imageItems])

  // Framer Motion scroll animations
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0])

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-background py-16 sm:py-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      </motion.div>

      <div
        ref={containerRef}
        className={cn("relative mt-12 w-full", layout === "drag" && "cursor-grab active:cursor-grabbing")}
      >
        <motion.div
          className={layout === "grid" ? "w-full" : "w-max"}
          drag={layout === "drag" ? "x" : false}
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.05}
          onDragStart={() => { isDragging.current = true }}
          onDragEnd={() => { requestAnimationFrame(() => { isDragging.current = false }) }}
        >
          <motion.div
            ref={gridRef}
            className={cn(
              "grid gap-4",
              layout === "grid"
                ? "grid-cols-1 auto-rows-[18rem] sm:grid-cols-2 lg:grid-cols-3"
                : "auto-cols-[minmax(15rem,1fr)] grid-flow-col auto-rows-[15rem] grid-rows-2 px-4 md:px-8",
            )}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {imageItems.map((item) => (
              <motion.button
                type="button"
                key={item.id}
                variants={itemVariants}
                className={cn(
                  "group relative flex h-full min-h-[15rem] w-full min-w-0 cursor-pointer items-end overflow-hidden rounded-xl border bg-card p-4 text-left shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  layout === "drag" && "min-w-[15rem]",
                  item.span,
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => { if (!isDragging.current) setSelectedItem(item) }}
                tabIndex={0}
                aria-label={`View ${item.title}`}
              >
                <img
                  draggable={false}
                  loading="lazy"
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 md:opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="relative z-10 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 transition-all duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="block text-lg font-bold text-white">{item.title}</span>
                  <span className="mt-1 block text-sm text-white/80">{item.desc}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery

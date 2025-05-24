interface Demo {
  id: string
  title: string
  description?: string
  coverImage: string
  date: string
  tags: string[]
  href: string
}

export const demos: Demo[] = [
  {
    id: "1",
    title: "3D Card Hover Effect",
    description: "Interactive 3D card with smooth hover animations and depth effects",
    coverImage: "/placeholder.svg?height=200&width=350",
    date: "2024-01-15",
    tags: ["CSS", "Animation", "3D"],
    href: "/demo/3d-card",
  },
  {
    id: "2",
    title: "Particle System",
    description: "Canvas-based particle system with physics simulation",
    coverImage: "/placeholder.svg?height=200&width=350",
    date: "2024-01-12",
    tags: ["Canvas", "Physics", "WebGL"],
    href: "/demo/particles",
  },
  {
    id: "3",
    title: "Smooth Scroll Navigation",
    description: "Optimized smooth scrolling with intersection observer",
    coverImage: "/placeholder.svg?height=200&width=350",
    date: "2024-01-10",
    tags: ["JavaScript", "Performance", "UX"],
    href: "/demo/smooth-scroll",
  },
  {
    id: "4",
    title: "Morphing Shapes",
    description: "SVG path morphing animations with spring physics",
    coverImage: "/placeholder.svg?height=200&width=350",
    date: "2024-01-08",
    tags: ["SVG", "Animation", "Spring"],
    href: "/demo/morphing",
  },
  {
    id: "5",
    title: "Virtual Scrolling",
    description: "High-performance virtual scrolling for large datasets",
    coverImage: "/placeholder.svg?height=200&width=350",
    date: "2024-01-05",
    tags: ["Performance", "React", "Optimization"],
    href: "/demo/virtual-scroll",
  },
  {
    id: "6",
    title: "Gesture Recognition",
    description: "Touch and mouse gesture recognition system",
    coverImage: "/placeholder.svg?height=200&width=350",
    date: "2024-01-03",
    tags: ["Touch", "Gestures", "Interaction"],
    href: "/demo/gestures",
  },
]
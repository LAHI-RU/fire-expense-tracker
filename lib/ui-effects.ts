// Professional JS utilities for seamless UI interactions
// Smooth scroll to element by id
export function smoothScrollTo(id: string, offset: number = 0) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

// Ripple effect for button clicks
export function createRipple(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  const button = event.currentTarget
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`
  circle.classList.add('ripple')
  const ripple = button.getElementsByClassName('ripple')[0]
  if (ripple) {
    ripple.remove()
  }
  button.appendChild(circle)
}

// Hover animation utility (for cards/buttons)
export function addHoverAnimation(ref: React.RefObject<HTMLElement>, animationClass: string) {
  if (!ref.current) return
  ref.current.addEventListener('mouseenter', () => {
    ref.current?.classList.add(animationClass)
  })
  ref.current.addEventListener('mouseleave', () => {
    ref.current?.classList.remove(animationClass)
  })
}

// Usage: Import and use in components for enhanced UX

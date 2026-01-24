import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Detects whether the viewport is below the mobile breakpoint.
 *
 * @returns True when viewport width is under 768px.
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile()
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

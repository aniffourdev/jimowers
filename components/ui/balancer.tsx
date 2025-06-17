import { ReactNode } from "react"

interface BalancerProps {
  children: ReactNode
}

export function Balancer({ children }: BalancerProps) {
  return (
    <span
      style={{
        display: "inline-block",
        verticalAlign: "top",
        textDecoration: "inherit",
      }}
    >
      {children}
    </span>
  )
} 
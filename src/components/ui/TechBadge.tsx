interface TechBadgeProps {
  label: string
}

function TechBadge({ label }: TechBadgeProps) {
  return (
    <span className="inline-block rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-ink">
      {label}
    </span>
  )
}

export default TechBadge

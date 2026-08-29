interface TechBadgeProps {
  label: string
}

function TechBadge({ label }: TechBadgeProps) {
  return (
    <span className="inline-block rounded-full border border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent-violet hover:text-primary">
      {label}
    </span>
  )
}

export default TechBadge

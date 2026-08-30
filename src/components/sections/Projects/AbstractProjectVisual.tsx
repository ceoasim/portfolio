import TechBadge from '../../ui/TechBadge.js'

interface AbstractProjectVisualProps {
  tags: string[]
}

function AbstractProjectVisual({ tags }: AbstractProjectVisualProps) {
  return (
    <div
      className="flex h-full min-h-[220px] flex-wrap content-center items-center justify-center gap-2 rounded-lg border border-border p-8"
      style={{
        background:
          'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.16), transparent 60%), radial-gradient(circle at 70% 70%, rgba(74,222,128,0.10), transparent 60%)',
      }}
    >
      {tags.map((tag) => (
        <TechBadge key={tag} label={tag} />
      ))}
    </div>
  )
}

export default AbstractProjectVisual

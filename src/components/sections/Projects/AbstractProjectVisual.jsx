import TechBadge from '../../ui/TechBadge.jsx'

function AbstractProjectVisual({ tags }) {
  return (
    <div
      className="flex h-full min-h-[220px] flex-wrap content-center items-center justify-center gap-2 rounded-lg p-8"
      style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,123,255,0.18), transparent 60%), radial-gradient(circle at 70% 70%, rgba(37,201,208,0.15), transparent 60%)' }}
    >
      {tags.map((tag) => (
        <TechBadge key={tag} label={tag} />
      ))}
    </div>
  )
}

export default AbstractProjectVisual

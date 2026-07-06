/**
 * Shared section header: mono index label + optional ultraviolet stamp.
 * Server-safe (no client hooks) — sections animate it themselves.
 */
export default function SectionHeader({
  index,
  name,
  stamp,
}: {
  index: string;
  name: string;
  stamp?: string;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <p className="specimen-label" data-section-label>
        {index} — {name}
      </p>
      {stamp ? <span className="stamp">{stamp}</span> : null}
    </div>
  );
}

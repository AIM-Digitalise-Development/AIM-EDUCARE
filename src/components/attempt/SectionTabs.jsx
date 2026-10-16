export default function SectionTabs({
  sections = [],
  activeSectionId,
  onSelectSection,
}) {
  if (!sections || sections.length <= 1) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto border-b pb-2 mb-4">
      {sections.map((sec) => {
        const isActive = sec.id === activeSectionId;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => onSelectSection(sec.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {sec.name}
          </button>
        );
      })}
    </div>
  );
}
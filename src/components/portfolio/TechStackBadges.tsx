interface TechStackBadgesProps {
  stack: string[];
}

export const TechStackBadges = ({ stack }: TechStackBadgesProps) => (
  <div className="flex flex-wrap gap-2">
    {stack.map((tech) => (
      <span
        key={tech}
        className="px-3 py-1.5 rounded-md bg-secondary text-foreground text-xs font-semibold tracking-wide border border-border"
      >
        {tech}
      </span>
    ))}
  </div>
);

export default TechStackBadges;

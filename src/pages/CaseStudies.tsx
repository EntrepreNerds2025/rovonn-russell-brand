const studies = [
  {
    title: "Community Health Initiative",
    problem: "A regional health organization had strong outcomes but couldn't convey their impact to major funders and policy-makers.",
    approach: "Designed a narrative architecture around patient transformation stories, paired with data visualization.",
    execution: "Produced a documentary-style impact reel and a structured messaging guide for all stakeholder communications.",
    results: "3x increase in donor engagement. Secured two new foundation grants within 6 months.",
  },
  {
    title: "Youth Empowerment Campaign",
    problem: "A youth development initiative struggled to attract corporate partners despite strong community results.",
    approach: "Repositioned the narrative from 'program overview' to 'opportunity for impact partnership.'",
    execution: "Created a story system including a campaign film, partnership deck, and ongoing content framework.",
    results: "Secured 5 new corporate partnerships and a feature in a national media outlet.",
  },
  {
    title: "Environmental Impact Launch",
    problem: "A foundation launching an environmental initiative had their message lost in a crowded landscape.",
    approach: "Built a documentary-style storytelling system that positioned the initiative as a movement.",
    execution: "Produced launch content, a storytelling playbook, and a social amplification strategy.",
    results: "400% increase in engagement. Content went viral with 2M+ organic impressions.",
  },
  {
    title: "Education Access Initiative",
    problem: "An education nonprofit's messaging was scattered across programs, weakening overall brand authority.",
    approach: "Unified all program narratives under a single story architecture with consistent proof points.",
    execution: "Redesigned all communications, produced a flagship impact documentary, and trained the team on messaging.",
    results: "Doubled annual fundraising and improved stakeholder retention by 60%.",
  },
];

const CaseStudiesPage = () => (
  <main>
    <section className="section-padding pt-32 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-6">Case Studies</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Stories of transformation.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-16 leading-relaxed">
          Deep storytelling breakdowns showing how AI Advisorure transforms organizational communication.
        </p>
        <div className="space-y-10">
          {studies.map((s) => (
            <div key={s.title} className="border border-border rounded p-8 md:p-10 hover:border-accent/30 transition-colors">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">{s.title}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(["problem", "approach", "execution", "results"] as const).map((key) => (
                  <div key={key}>
                    <h3 className="text-xs font-semibold tracking-widest uppercase text-accent-highlight mb-2">{key}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default CaseStudiesPage;

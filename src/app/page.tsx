const nextSteps = [
  "Connect a Supabase project",
  "Add administrator sign-in",
  "Build the public idea list",
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">MY100IDEAS</p>
        <h1>Give every idea a life.</h1>
        <p className="intro">
          A cloud-ready workspace for recording, exploring, and developing ideas.
          The first release is being prepared now.
        </p>
      </section>

      <section className="status" aria-labelledby="status-title">
        <div>
          <p className="eyebrow">PROJECT STATUS</p>
          <h2 id="status-title">The foundation is ready.</h2>
        </div>
        <ol>
          {nextSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

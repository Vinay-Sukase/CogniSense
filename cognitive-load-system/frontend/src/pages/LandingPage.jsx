import { Link } from "react-router-dom";

const LandingPage = () => (
  <div className="hero-grid items-start">
    <section className="py-6 md:py-10">
      <div className="glass-chip">
        Educational cognitive monitoring platform
      </div>
      <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-tight text-slate-900 md:text-6xl">
        Detect cognitive overload before it becomes unmanageable.
      </h1>
      <p className="mt-6 max-w-2xl text-lg muted-copy">
        CogniSense combines behavioral tests, indirect well-being questions, and a machine learning
        layer to help students reflect on focus, mental fatigue, and workload balance.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/signup" className="button-primary">
          Create account
        </Link>
        <Link to="/login" className="button-secondary">
          Sign in
        </Link>
      </div>
      <p className="mt-8 text-sm muted-copy">
        This system is not a medical diagnosis tool. It provides reflective feedback only.
      </p>
    </section>
    <aside className="panel p-8 md:p-10">
      <div className="grid gap-4">
        {[
          "Reaction time and variance monitoring",
          "Working memory and recall testing",
          "Reading and Stroop interference analysis",
          "Admin analytics and dataset export"
        ].map((item) => (
            <div key={item} className="panel-soft p-5 text-slate-700">
              {item}
            </div>
        ))}
      </div>
    </aside>
  </div>
);

export default LandingPage;

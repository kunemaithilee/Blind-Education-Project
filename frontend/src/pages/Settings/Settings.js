import { useEffect, useState } from "react";
import { getSettings } from "../../services/learningService";
import { speak } from "../../utils/speech";

function Settings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  return (
    <section className="page module-page">
      <span className="page-kicker">Settings</span>
      <h1>Accessibility controls</h1>
      {settings && (
        <div className="module-grid">
          {Object.entries(settings).map(([key, value]) => (
            <article className="module-card" key={key}>
              <h2>{key.replace(/([A-Z])/g, " $1")}</h2>
              <p>{String(value)}</p>
              <button onClick={() => speak(`${key} is set to ${value}`)}>Speak Setting</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Settings;

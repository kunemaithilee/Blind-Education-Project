import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useVoiceContext } from "../../context/VoiceContext";

const menuItems = [
  ["Home", "home", "/"],
  ["Courses", "book", "/courses"],
  ["Audio Notes", "mic", "/audio-notes"],
  ["Quizzes", "quiz", "/quizzes"],
  ["Progress", "chart", "/progress"],
  ["AI Assistant", "spark", "/assistant"],
  ["Settings", "gear", "/settings"],
];

const stats = [
  ["Courses Completed", "12", "+3 this month", "book"],
  ["Audio Notes", "48", "8 new summaries", "mic"],
  ["Quiz Accuracy", "91%", "Up 6 percent", "quiz"],
  ["Learning Hours", "126", "14 this week", "clock"],
];

const features = [
  {
    icon: "book",
    title: "Courses",
    text: "Explore guided audio courses across science, math, English and life skills.",
    action: "Explore Courses",
    path: "/courses",
  },
  {
    icon: "mic",
    title: "Audio Notes",
    text: "Listen to saved notes, summaries and reminders with voice-first controls.",
    action: "Read Notes",
    path: "/audio-notes",
  },
  {
    icon: "quiz",
    title: "Quizzes",
    text: "Practice with sound-based questions and instant spoken feedback.",
    action: "Start Quiz",
    path: "/quizzes",
  },
  {
    icon: "chart",
    title: "Progress",
    text: "Track course completion, streaks, accuracy and learning momentum.",
    action: "Show Progress",
    path: "/progress",
  },
];

const suggestions = ["Open Courses", "Read Notes", "Start Quiz", "Show Progress"];

const activities = [
  ["Completed", "Organic Chemistry - Basics", "Today, 6:20 PM"],
  ["Listened", "Physics Through Sound, Lesson 2", "Today, 4:10 PM"],
  ["Scored", "91 percent in Grammar Quiz", "Yesterday"],
  ["Saved", "Algebra audio note", "Yesterday"],
];

const quickActions = [
  ["Font Size", "Large"],
  ["Speech Speed", "0.95x"],
  ["High Contrast", "On"],
  ["Screen Reader Mode", "Ready"],
];

function Icon({ name }) {
  return <span className={`icon icon-${name}`} aria-hidden="true" />;
}

function Home() {
  const {
    error,
    isListening,
    isSupported,
    isVoiceModeOn,
    reply,
    speakWelcome,
    startListening,
    stopListening,
    transcript,
  } = useVoiceContext();

  return (
    <div className="home-screen premium-dashboard">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <Navbar />

      <section className="dashboard-shell" aria-label="EchoLearn dashboard">
        <aside className="sidebar glass-panel">
          <div className="sidebar-brand">
            <span className="mini-logo">EL</span>
            <strong>Echo<span>Learn</span></strong>
          </div>

          <nav className="side-menu" aria-label="Dashboard navigation">
            {menuItems.map(([label, icon, path], index) => (
              <Link className={index === 0 ? "active" : ""} key={label} to={path}>
                <Icon name={icon} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-status">
            <span className="status-dot" />
            <strong>Voice mode</strong>
            <span>{isVoiceModeOn ? "Always listening" : "Ready to start"}</span>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="hero-panel glass-panel page-enter">
            <div className="hero-copy-block">
              <span className="eyebrow">Voice-first learning OS</span>
              <h1>Learn with an AI assistant that listens first.</h1>
              <p>
                EchoLearn gives blind and visually impaired students a premium
                learning dashboard powered by speech, audio lessons and accessible progress tracking.
              </p>
            </div>

            <div className="hero-actions">
              <button onClick={speakWelcome}>
                <Icon name="speaker" />
                Listen intro
              </button>
              <Link to="/assistant">
                <Icon name="spark" />
                AI Assistant
              </Link>
            </div>
          </section>

          <section className="stats-grid" aria-label="Dashboard statistics">
            {stats.map(([label, value, helper, icon]) => (
              <article className="stat-card glass-card lift-card" key={label}>
                <div className="stat-icon"><Icon name={icon} /></div>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{helper}</small>
              </article>
            ))}
          </section>

          <section className="voice-command-center glass-panel" aria-label="Voice command center">
            <div className="voice-grid">
              <div className="wave-field" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <button
                className={`voice-orb ${isVoiceModeOn ? "listening" : ""}`}
                onClick={isVoiceModeOn ? stopListening : startListening}
                aria-label={isVoiceModeOn ? "Stop voice assistant" : "Start voice assistant"}
              >
                <span className="orb-ring" />
                <Icon name="mic-large" />
              </button>

              <div className="voice-copy">
                <span className="eyebrow">Central microphone</span>
                <h2>{isListening ? "Listening for your command" : isVoiceModeOn ? "Responding, then listening again" : "Start voice mode"}</h2>
                <p>{isSupported ? "Say a command or ask a question. EchoLearn will speak the response aloud." : "Speech recognition needs Chrome or Edge."}</p>
              </div>
            </div>

            <div className="command-suggestions" aria-label="Voice command suggestions">
              {suggestions.map((suggestion) => (
                <button key={suggestion} onClick={startListening}>{suggestion}</button>
              ))}
            </div>

            <section className="voice-response" aria-live="polite">
              <div>
                <strong>User command</strong>
                <p>{transcript || "No command yet"}</p>
              </div>
              <div>
                <strong>Assistant response</strong>
                <p>{error || reply}</p>
              </div>
            </section>
          </section>

          <section className="feature-grid" aria-label="Primary learning areas">
            {features.map((feature) => (
              <article className="feature-card glass-card lift-card" key={feature.title}>
                <div className="feature-icon"><Icon name={feature.icon} /></div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <Link to={feature.path}>{feature.action}<span aria-hidden="true">-&gt;</span></Link>
              </article>
            ))}
          </section>

          <section className="dashboard-lower">
            <article className="recent-activity glass-panel">
              <div className="section-heading">
                <span className="eyebrow">Recent activity</span>
                <h2>Learning timeline</h2>
              </div>
              <div className="activity-list">
                {activities.map(([type, title, time]) => (
                  <div className="activity-item" key={`${type}-${title}`}>
                    <span>{type}</span>
                    <strong>{title}</strong>
                    <small>{time}</small>
                  </div>
                ))}
              </div>
            </article>

            <aside className="insight-column">
              <article className="streak-card glass-card">
                <span className="eyebrow">Learning streak</span>
                <strong>14 days</strong>
                <p>Consistent listening builds confident learning.</p>
                <div className="streak-bars" aria-hidden="true">
                  <i /><i /><i /><i /><i /><i /><i />
                </div>
              </article>

              <article className="circle-widget glass-card">
                <div className="circle-progress" aria-label="75 percent complete">
                  <span>75%</span>
                </div>
                <div>
                  <span className="eyebrow">Course progress</span>
                  <strong>Organic Chemistry</strong>
                  <p>Chapter 3: Alkanes and Cycloalkanes</p>
                </div>
              </article>
            </aside>
          </section>

          <section className="quick-actions glass-panel" aria-label="Accessibility quick actions">
            <div className="section-heading">
              <span className="eyebrow">Accessibility quick actions</span>
              <h2>Personalize the experience</h2>
            </div>
            <div className="quick-grid">
              {quickActions.map(([label, value]) => (
                <button className="quick-action" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </button>
              ))}
            </div>
          </section>
        </main>
      </section>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {menuItems.slice(0, 5).map(([label, icon, path]) => (
          <Link className={label === "Home" ? "active" : ""} to={path} key={label}>
            <Icon name={icon} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <button
        className={`mobile-mic ${isVoiceModeOn ? "active" : ""}`}
        onClick={isVoiceModeOn ? stopListening : startListening}
        aria-label={isVoiceModeOn ? "Stop voice assistant" : "Start voice assistant"}
      >
        <Icon name="mic-large" />
      </button>
    </div>
  );
}

export default Home;

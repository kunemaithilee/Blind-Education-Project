import { BrowserRouter } from "react-router-dom";
import { VoiceProvider } from "./context/VoiceContext";
import VoiceAssistant from "./components/voice/VoiceAssistant";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <VoiceProvider>
        <div className="app-layout">
          <div className="app-content">
            <AppRoutes />
          </div>
          <Footer />
        </div>
        <VoiceAssistant />
      </VoiceProvider>
    </BrowserRouter>
  );
}

export default App;

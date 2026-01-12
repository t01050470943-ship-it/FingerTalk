import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import {
  HomePage,
  StudyPage,
  FlashCardPage,
  QuizPage,
  BasicQuizPage,
  AdvancedQuizPage,
  TimeAttackPage,
  SettingsPage,
} from './pages';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/study/:category" element={<FlashCardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/basic" element={<BasicQuizPage />} />
          <Route path="/quiz/advanced" element={<AdvancedQuizPage />} />
          <Route path="/quiz/timeattack" element={<TimeAttackPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

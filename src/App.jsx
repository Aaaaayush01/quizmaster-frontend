import React, { useState, useCallback } from 'react';
import styles from './App.module.css';

import Background from './components/Background';
import StartScreen from './screens/StartScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';

import { fetchQuestions } from './utils/helpers';
import { getStats } from './utils/storage';

// Screen states
const SCREEN = {
  START: 'start',
  LOADING: 'loading',
  QUIZ: 'quiz',
  RESULT: 'result',
};

const DEFAULT_CONFIG = {
  category: '',
  difficulty: '',
  count: 10,
};

export default function App() {
  const [screen, setScreen] = useState(SCREEN.START);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(() => getStats());
  const [error, setError] = useState(null);

  const updateConfig = useCallback((patch) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const loadAndStart = useCallback(async (cfg) => {
    setScreen(SCREEN.LOADING);
    setError(null);
    try {
      const qs = await fetchQuestions(cfg);
      setQuestions(qs);
      setScreen(SCREEN.QUIZ);
    } catch (e) {
      setError('Failed to load questions. Check your connection and try again.');
      setScreen(SCREEN.START);
    }
  }, []);

  const handleStart = useCallback(() => {
    loadAndStart(config);
  }, [config, loadAndStart]);

  const handleFinish = useCallback((res) => {
    setResult(res);
    setStats(getStats()); // refresh after ResultScreen saves
    setScreen(SCREEN.RESULT);
  }, []);

  const handlePlayAgain = useCallback(() => {
    loadAndStart(config);
  }, [config, loadAndStart]);

  const handleSettings = useCallback(() => {
    setStats(getStats());
    setScreen(SCREEN.START);
  }, []);

  return (
    <div className={styles.root}>
      <Background />
      <main className={styles.main} role="main">
        {error && (
          <div className={styles.errorBanner} role="alert">{error}</div>
        )}

        {screen === SCREEN.START && (
          <StartScreen
            config={config}
            onConfigChange={updateConfig}
            onStart={handleStart}
            stats={stats}
          />
        )}

        {screen === SCREEN.LOADING && <LoadingScreen />}

        {screen === SCREEN.QUIZ && questions.length > 0 && (
          <QuizScreen
            key={questions[0].question} // remount on new game
            questions={questions}
            onFinish={handleFinish}
          />
        )}

        {screen === SCREEN.RESULT && result && (
          <ResultScreen
            result={result}
            onPlayAgain={handlePlayAgain}
            onSettings={handleSettings}
          />
        )}
      </main>
    </div>
  );
}

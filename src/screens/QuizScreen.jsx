import { decodeHTML } from "../utils/helpers";
import React, { useState, useEffect, useCallback } from 'react';
import styles from './QuizScreen.module.css';
import { useTimer } from '../hooks/useTimer';
import { LETTERS } from '../utils/helpers';

const TIMER_DURATION = 15;

export default function QuizScreen({ questions, onFinish }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);   // selected option text
  const [answered, setAnswered] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState([]);

  const question = questions[currentQ];

  const handleExpire = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setTimedOut(true);
    setStreak(0);
    setHistory((h) => [
      ...h,
      { correct: false, timeout: true, question: question.question },
    ]);
  }, [answered, question]);

  const { timeLeft, timerClass, start, clear } = useTimer({
    duration: TIMER_DURATION,
    onExpire: handleExpire,
  });

  // Start timer whenever the question index changes
  useEffect(() => {
    setAnswered(false);
    setSelected(null);
    setTimedOut(false);
    start();
    return () => clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ]);

  function handleAnswer(opt) {
    if (answered) return;
    setAnswered(true);
    clear();
    setSelected(opt);

    const correct = opt === question.answer;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }

    setHistory((h) => [
      ...h,
      { correct, timeout: false, question: question.question },
    ]);
  }

  // Derive correct score for finish (we tally inside handleAnswer already)
  function handleNextSafe() {
    const next = currentQ + 1;
    if (next < questions.length) {
      setCurrentQ(next);
    } else {
      onFinish({ score, total: questions.length, bestStreak, history });
    }
  }

  const progress = (currentQ / questions.length) * 100;

  // Feedback content
  let feedbackType = null;
  let feedbackMsg = '';
  if (answered) {
    if (timedOut) {
      feedbackType = 'timeout';
      feedbackMsg = `Time's up! Answer: "${question.answer}"`;
    } else if (selected === question.answer) {
      feedbackType = 'correct';
      feedbackMsg = streak > 1 ? `Correct! 🔥 ${streak} in a row!` : 'Correct! Well done!';
    } else {
      feedbackType = 'wrong';
      feedbackMsg = `Wrong! The answer was: "${decodeHTML(question.answer)}"`;
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.counter}>
          Question <span>{currentQ + 1}</span> of <span>{questions.length}</span>
        </div>
        <div className={styles.timerWrap}>
          <span className={styles.timerIcon}>⏱</span>
          <span className={`${styles.timerVal} ${styles[timerClass]}`}>{timeLeft}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* Category badge */}
      <div className={styles.badge}>{question.category}</div>

      {/* Question */}
      <h2 className={styles.question}>{decodeHTML(question.question)}</h2>

      {/* Options */}
      <div className={styles.options}>
        {question.options.map((opt, i) => {
          let cls = styles.optBtn;
          if (answered) {
            if (opt === question.answer) {
              cls += ` ${selected === question.answer ? styles.correct : styles.revealed}`;
            } else if (opt === selected && selected !== question.answer) {
              cls += ` ${styles.wrong}`;
            }
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
            >
              <span className={styles.letter}>{LETTERS[i]}</span>
              <span>{decodeHTML(opt)}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`${styles.feedback} ${styles[feedbackType + 'Fb']}`}>
          <span className={styles.feedbackIcon}>
            {feedbackType === 'correct' ? '✓' : feedbackType === 'wrong' ? '✗' : '⏰'}
          </span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button className={styles.nextBtn} onClick={handleNextSafe}>
          {currentQ + 1 < questions.length ? 'Next Question →' : 'See Results →'}
        </button>
      )}
    </div>
  );
}

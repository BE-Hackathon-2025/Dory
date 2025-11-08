"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./selfcheck.module.css"; // CSS module import

export default function SelfCheckQuizPage() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "multipleChoice",
      question: "What is the main topic of the uploaded text?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: null,
      explanation: "The AI will generate the explanation here.",
    },
    {
      id: 2,
      type: "shortAnswer",
      question: "Summarize the key idea in one sentence.",
      answer: "",
      explanation: "The AI explanation will appear here.",
    },
  ]);

  const [showExplanations, setShowExplanations] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverView, setHoverView] = useState(false);

  const handleAnswerChange = (qId, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, answer: value } : q))
    );
  };

  const handleSubmit = () => {
    console.log("User answers:", questions);
    alert("Answers submitted! You can now view explanations.");
    setShowExplanations(true);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.headerBar}>
        <div className={styles.headerContent}>
          <Image src="/dory.png" alt="Dory logo" width={100} height={100} />
          <h1 className={styles.headerTitle}>Dory</h1>
        </div>
      </header>

      {/* Wave below header */}
      <div className={styles.waveContainer}>
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className={styles.waveSvg}
        >
          <path
            d="
              M0,0 
              L1440,0 
              C1320,50 1200,100 1080,60 
              C960,20 840,80 720,50 
              C600,20 480,70 360,40 
              C240,10 120,60 0,20 
              Z"
            fill="#579ffc"
          />
        </svg>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <h2 className={styles.pageTitle}>Self-Check Quiz</h2>

        {questions.map((q) => (
          <div key={q.id} className={styles.questionCard}>
            <p className={styles.questionText}>{q.question}</p>

            {q.type === "multipleChoice" && (
              <div className={styles.optionsContainer}>
                {q.options.map((opt, i) => (
                  <label key={i} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={q.answer === opt}
                      onChange={() => handleAnswerChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "shortAnswer" && (
              <textarea
                className={styles.textArea}
                value={q.answer}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder="Type your answer here..."
              />
            )}

            {showExplanations && (
              <p className={styles.explanation}>💡 Explanation: {q.explanation}</p>
            )}
          </div>
        ))}

        <div className={styles.buttonsContainer}>
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            onMouseEnter={() => setHoverSubmit(true)}
            onMouseLeave={() => setHoverSubmit(false)}
            style={{
              transform: hoverSubmit ? "scale(1.05)" : "scale(1)",
            }}
          >
            Submit Answers
          </button>

          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className={styles.viewButton}
            onMouseEnter={() => setHoverView(true)}
            onMouseLeave={() => setHoverView(false)}
            style={{
              transform: hoverView ? "scale(1.05)" : "scale(1)",
            }}
          >
            {showExplanations ? "Hide Explanations" : "View Explanations"}
          </button>
        </div>
      </main>
    </div>
  );
}

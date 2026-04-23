import { createContext, useContext, useState } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [overallScore, setOverallScore] = useState(null);

  const startSession = (newSessionId, newQuestions) => {
    setSessionId(newSessionId);
    setQuestions(newQuestions);
    setAnswers([]);
    setFeedback(null);
    setOverallScore(null);
  };

  const saveAnswers = (newAnswers) => {
    setAnswers(newAnswers);
  };

  const saveFeedback = (newFeedback, newOverallScore) => {
    setFeedback(newFeedback);
    setOverallScore(newOverallScore);
  };

  const clearSession = () => {
    setSessionId(null);
    setQuestions([]);
    setAnswers([]);
    setFeedback(null);
    setOverallScore(null);
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        questions,
        answers,
        feedback,
        overallScore,
        startSession,
        saveAnswers,
        saveFeedback,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

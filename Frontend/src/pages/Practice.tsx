import { useState, useMemo } from 'react';
import { allQuestions } from '../data/chapters';
import QuizSlide from '../components/quiz/QuizSlide';
import type { Slide } from '../data/chapters';
import { useGamification } from '../context/GamificationContext';
const Practice = () => {
  const {   } = useGamification();
  const slides: Slide[] = useMemo(() => {
    const copy = [...allQuestions];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  const [index, setIndex] = useState(0);

  const handleCorrect = () => {
    console.log('correct');
  };

  const handleIncorrect = () => {
    
    console.log('incorrect');
  };

  const handleNext = () => {
    setIndex((prev) => prev + 1);
  };

  if (!slides[index]) {
    return <div>Practice complete</div>;
  }

  return (
    <QuizSlide
      slide={slides[index]}
      onCorrect={handleCorrect}
      onIncorrect={handleIncorrect}
      onNext={handleNext}
    />
  );
};

export default Practice;

import { useEffect, useMemo, useState } from "react";

const READING_BANK = [
  {
    passage:
      "Short breaks during long study sessions can improve attention when they are planned rather than taken impulsively.",
    questions: [
      {
        prompt: "According to the passage, when are breaks most useful?",
        options: ["When planned", "When skipped", "When taken impulsively"],
        answer: "When planned"
      },
      {
        prompt: "What can planned breaks improve?",
        options: ["Attention", "Typing speed", "Memory loss"],
        answer: "Attention"
      }
    ]
  },
  {
    passage:
      "Students who organize difficult tasks into smaller milestones often feel less mentally overwhelmed while working.",
    questions: [
      {
        prompt: "What can reduce feeling overwhelmed?",
        options: ["Bigger deadlines", "Smaller milestones", "More distractions"],
        answer: "Smaller milestones"
      },
      {
        prompt: "The passage focuses on which kind of tasks?",
        options: ["Difficult tasks", "Social tasks", "Outdoor tasks"],
        answer: "Difficult tasks"
      }
    ]
  },
  {
    passage:
      "Hydration and posture can influence how alert a person feels during extended reading or problem-solving sessions.",
    questions: [
      {
        prompt: "What may influence alertness during long study sessions?",
        options: ["Hydration and posture", "Room size", "Notebook color"],
        answer: "Hydration and posture"
      },
      {
        prompt: "Which activities are mentioned?",
        options: ["Reading and problem solving", "Cooking and running", "Driving and singing"],
        answer: "Reading and problem solving"
      }
    ]
  },
  {
    passage:
      "Removing notifications before beginning focused work can reduce unnecessary task switching and preserve concentration.",
    questions: [
      {
        prompt: "What should be removed before focused work?",
        options: ["Notifications", "Pens", "Study notes"],
        answer: "Notifications"
      },
      {
        prompt: "What does removing them help preserve?",
        options: ["Concentration", "Background noise", "Typing speed"],
        answer: "Concentration"
      }
    ]
  },
  {
    passage:
      "Reading comprehension often improves when a student slows down slightly instead of rushing through unfamiliar material.",
    questions: [
      {
        prompt: "When can comprehension improve?",
        options: ["When slowing down slightly", "When rushing", "When multitasking"],
        answer: "When slowing down slightly"
      },
      {
        prompt: "What kind of material is mentioned?",
        options: ["Unfamiliar material", "Only fiction", "Only diagrams"],
        answer: "Unfamiliar material"
      }
    ]
  },
  {
    passage:
      "A quiet environment does not guarantee focus, but it can reduce external distractions that interrupt deep work.",
    questions: [
      {
        prompt: "What can a quiet environment reduce?",
        options: ["External distractions", "Motivation", "Vocabulary"],
        answer: "External distractions"
      },
      {
        prompt: "Does the passage say quiet always guarantees focus?",
        options: ["No", "Yes", "Only at night"],
        answer: "No"
      }
    ]
  },
  {
    passage:
      "Revisiting key ideas after a short pause can strengthen understanding more effectively than rereading continuously without stopping.",
    questions: [
      {
        prompt: "What can strengthen understanding?",
        options: ["Revisiting key ideas after a pause", "Continuous rereading only", "Ignoring the main idea"],
        answer: "Revisiting key ideas after a pause"
      },
      {
        prompt: "What is contrasted with revisiting key ideas?",
        options: ["Continuous rereading", "Group discussion", "Note highlighting"],
        answer: "Continuous rereading"
      }
    ]
  },
  {
    passage:
      "Simple planning at the start of a study block can reduce hesitation by making the next action immediately clear.",
    questions: [
      {
        prompt: "What can simple planning reduce?",
        options: ["Hesitation", "Sleep", "Curiosity"],
        answer: "Hesitation"
      },
      {
        prompt: "Why does planning help?",
        options: ["It clarifies the next action", "It shortens the text", "It removes all effort"],
        answer: "It clarifies the next action"
      }
    ]
  },
  {
    passage:
      "When learners alternate between active recall and short review, they often stay more mentally engaged than during passive reading alone.",
    questions: [
      {
        prompt: "Which combination can keep learners more engaged?",
        options: ["Active recall and short review", "Passive reading only", "Background music and browsing"],
        answer: "Active recall and short review"
      },
      {
        prompt: "The passage compares this method with what?",
        options: ["Passive reading alone", "Exercise breaks", "Memorizing dates"],
        answer: "Passive reading alone"
      }
    ]
  },
  {
    passage:
      "A student may read quickly yet misunderstand the message if attention slips during crucial parts of the material.",
    questions: [
      {
        prompt: "What can happen if attention slips?",
        options: ["The message may be misunderstood", "Reading always becomes slower", "Memory always improves"],
        answer: "The message may be misunderstood"
      },
      {
        prompt: "Can fast reading still lead to misunderstanding?",
        options: ["Yes", "No", "Only on weekends"],
        answer: "Yes"
      }
    ]
  },
  {
    passage:
      "Consistent routines before studying can reduce mental friction by helping the brain shift into a focused mode more smoothly.",
    questions: [
      {
        prompt: "What can routines reduce?",
        options: ["Mental friction", "Color contrast", "Typing errors"],
        answer: "Mental friction"
      },
      {
        prompt: "What do routines help the brain do?",
        options: ["Shift into focused mode", "Forget earlier learning", "Avoid all breaks"],
        answer: "Shift into focused mode"
      }
    ]
  },
  {
    passage:
      "Students who notice declining concentration early can adjust their pace before fatigue causes larger drops in performance.",
    questions: [
      {
        prompt: "Why is early noticing useful?",
        options: ["It allows pace adjustment", "It increases distractions", "It removes all fatigue"],
        answer: "It allows pace adjustment"
      },
      {
        prompt: "What may cause larger performance drops?",
        options: ["Fatigue", "Fresh air", "Clear notes"],
        answer: "Fatigue"
      }
    ]
  }
];

const pickRandomPassage = () => READING_BANK[Math.floor(Math.random() * READING_BANK.length)];

const shuffleOptions = (items) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

const MovingTextReadingTest = ({ onComplete }) => {
  const content = useMemo(() => {
    const selectedPassage = pickRandomPassage();

    return {
      ...selectedPassage,
      questions: selectedPassage.questions.map((question) => ({
        ...question,
        options: shuffleOptions(question.options)
      }))
    };
  }, []);
  const words = useMemo(() => content.passage.split(" "), [content]);
  const [index, setIndex] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [answers, setAnswers] = useState(Array(content.questions.length).fill(""));
  const [startTime] = useState(performance.now());

  useEffect(() => {
    if (readingComplete) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIndex((value) => {
        if (value >= words.length - 1) {
          setReadingComplete(true);
          return value;
        }

        return value + 1;
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [index, readingComplete, words.length]);

  const submit = () => {
    const correct = content.questions.filter(
      (question, questionIndex) => question.answer === answers[questionIndex]
    ).length;

    onComplete({
      reading_time: Math.round((performance.now() - startTime) / 1000),
      reading_correct_answers: correct,
      reading_accuracy: Math.round((correct / content.questions.length) * 100)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Moving Text Reading Test</h3>
        <p className="mt-2 text-sm muted-copy">
          A random short passage is shown word by word, followed by comprehension questions based on
          that specific passage.
        </p>
      </div>

      {!readingComplete ? (
        <div className="space-y-5">
          <div className="test-focus-surface p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current word</p>
            <div className="test-focus-display mt-4 flex min-h-40 items-center justify-center p-8 text-center text-3xl font-semibold text-slate-900">
              {words[index]}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <p>Word {index + 1} of {words.length}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="test-copy-panel p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Passage shown</p>
            <p className="mt-3 text-slate-700">{content.passage}</p>
          </div>
          {content.questions.map((question, questionIndex) => (
            <div key={question.prompt} className="test-copy-panel p-4">
              <p className="mb-3 text-slate-800">{question.prompt}</p>
              <div className="flex flex-wrap gap-3">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const next = [...answers];
                      next[questionIndex] = option;
                      setAnswers(next);
                    }}
                    className={`rounded-full px-4 py-2 text-sm ${
                      answers[questionIndex] === option
                        ? "bg-sky-500 text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={submit} className="button-primary">
            Submit Reading Test
          </button>
        </div>
      )}
    </div>
  );
};

export default MovingTextReadingTest;


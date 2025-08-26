import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  BookOpen, 
  CheckCircle, 
  X, 
  Clock,
  Brain,
  Trophy,
  ArrowRight,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROTOCOL_CONFIG } from '../config/web3';
import toast from 'react-hot-toast';

const DailyQuiz = ({ onQuizComplete, onClose }) => {
  const { userData } = useWeb3();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizState, setQuizState] = useState('ready'); // ready, loading, active, completed
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per question
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(userData?.knowledgeStreak || 0);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    toast.error('Time\'s up! Question skipped.');
    handleNextQuestion();
  }, []);

  // Quiz questions database
  const quizQuestions = [
    {
      question: "What is the native currency of the IRYS Testnet?",
      options: ["IRYS", "ETH", "MATIC", "BNB"],
      correctAnswer: 0,
      explanation: "IRYS is the native currency of the IRYS Testnet, used for transaction fees and gas costs.",
      category: "blockchain"
    },
    {
      question: "What is the purpose of SMASH tokens in the Smash Protocol?",
      options: ["Only for trading", "Internal point system and future utility token", "Just for mining rewards", "Only for referrals"],
      correctAnswer: 1,
      explanation: "SMASH serves as both an internal point system for the ecosystem and a future tradeable utility token.",
      category: "protocol"
    },
    {
      question: "How many consecutive days are needed for the first mining streak milestone?",
      options: ["1 day", "3 days", "7 days", "14 days"],
      correctAnswer: 2,
      explanation: "The first mining streak milestone is achieved after 3 consecutive days of mining.",
      category: "mining"
    },
    {
      question: "What percentage of SMASH do direct referrals earn from their referrals?",
      options: ["5%", "10%", "15%", "20%"],
      correctAnswer: 1,
      explanation: "Direct referrals earn 10% of all SMASH earned by their direct referrals.",
      category: "referrals"
    },
    {
      question: "What is the master protocol referral code?",
      options: ["SMASH", "HIRYS", "PROTO", "WEB3"],
      correctAnswer: 1,
      explanation: "HIRYS is the master protocol code that allows users to join the ecosystem.",
      category: "protocol"
    },
    {
      question: "How many daily rewarded ads can a user watch maximum?",
      options: ["3", "5", "7", "10"],
      correctAnswer: 1,
      explanation: "Users can watch up to 5 rewarded ads per day to earn SMASH.",
      category: "ads"
    },
    {
      question: "What blockchain network does Smash Protocol use?",
      options: ["Ethereum Mainnet", "Polygon", "IRYS Testnet", "BSC"],
      correctAnswer: 2,
      explanation: "Smash Protocol is built on the IRYS Testnet for testing and development.",
      category: "blockchain"
    },
    {
      question: "What happens when a user reaches 100 referrals?",
      options: ["Nothing special", "They get a small bonus", "They unlock Epic tier privileges", "They become admin"],
      correctAnswer: 2,
      explanation: "Reaching 100 referrals unlocks the Epic tier with special ecosystem privileges.",
      category: "referrals"
    }
  ];

  useEffect(() => {
    if (quizState === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState, timeRemaining, handleTimeUp]);

  const startQuiz = () => {
    setQuizState('active');
    setTimeRemaining(60);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answerIndex);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('Correct answer! +10 SMASH');
    } else {
      toast.error('Incorrect answer. Better luck next time!');
    }
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeRemaining(60);
    } else {
      completeQuiz();
    }
  }, [currentQuestionIndex, quizQuestions.length]);

  const completeQuiz = () => {
    setQuizState('completed');
    
    // Calculate rewards
    const baseReward = score * PROTOCOL_CONFIG.QUIZ_REWARD; // 50 SMASH per correct answer
    const streakBonus = Math.floor(streak / 7) * 25; // Bonus for every 7-day streak
    const totalReward = baseReward + streakBonus;
    
    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    toast.success(`Quiz completed! +${totalReward} SMASH earned (${baseReward} + ${streakBonus} streak bonus)`);
    
    if (onQuizComplete) {
      onQuizComplete(totalReward, newStreak, score);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => quizQuestions[currentQuestionIndex];

  const getQuizContent = () => {
    switch (quizState) {
      case 'ready':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-smash-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-10 h-10 text-smash-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Knowledge Quiz</h3>
            <p className="text-gray-600 mb-4">
              Test your knowledge about Smash Protocol and earn SMASH rewards!
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Questions</p>
                  <p className="font-semibold text-gray-900">{quizQuestions.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time Limit</p>
                  <p className="font-semibold text-gray-900">60s per question</p>
                </div>
                <div>
                  <p className="text-gray-600">Reward per Answer</p>
                  <p className="font-semibold text-smash-secondary">50 SMASH</p>
                </div>
                <div>
                  <p className="text-gray-600">Current Streak</p>
                  <p className="font-semibold text-smash-accent">{streak} days</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={startQuiz}
              className="w-full py-3 px-6 bg-smash-secondary hover:bg-smash-secondary/80 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Quiz</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      case 'active':
        const question = getCurrentQuestion();
        return (
          <div className="space-y-6">
            {/* Progress and Timer */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-smash-warning" />
                <span className={`font-mono text-sm ${
                  timeRemaining <= 10 ? 'text-smash-danger' : 'text-gray-900'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-smash-secondary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-5 h-5 text-smash-secondary" />
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {question.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {question.question}
              </h3>

              {/* Answer Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === null
                        ? 'border-gray-200 hover:border-smash-secondary hover:bg-smash-secondary/5'
                        : selectedAnswer === index
                        ? index === question.correctAnswer
                          ? 'border-smash-success bg-smash-success/10'
                          : 'border-smash-danger bg-smash-danger/10'
                        : index === question.correctAnswer
                        ? 'border-smash-success bg-smash-success/10'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{option}</span>
                      {selectedAnswer === index && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center">
                          {index === question.correctAnswer ? (
                            <CheckCircle className="w-5 h-5 text-smash-success" />
                          ) : (
                            <X className="w-5 h-5 text-smash-danger" />
                          )}
                        </div>
                      )}
                      {index === question.correctAnswer && selectedAnswer !== null && selectedAnswer !== index && (
                        <CheckCircle className="w-5 h-5 text-smash-success" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-start space-x-2">
                  <Star className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Explanation</p>
                    <p className="text-sm text-blue-700">{question.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 'completed':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-smash-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Trophy className="w-10 h-10 text-smash-success" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Completed!</h3>
            <p className="text-gray-600 mb-4">
              Great job! You've completed today's knowledge quiz.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Score</p>
                  <p className="font-semibold text-gray-900">{score}/{quizQuestions.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Accuracy</p>
                  <p className="font-semibold text-gray-900">
                    {Math.round((score / quizQuestions.length) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">New Streak</p>
                  <p className="font-semibold text-smash-accent">{streak} days</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Earned</p>
                  <p className="font-semibold text-smash-success">
                    +{score * PROTOCOL_CONFIG.QUIZ_REWARD} SMASH
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-smash-success hover:bg-smash-success/80 text-white rounded-xl font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Daily Knowledge Quiz</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={quizState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {getQuizContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DailyQuiz;

import React, { useState, useEffect, useRef } from 'react';
import { 
  // Jobs Icons
  ChefHat, Stethoscope, Hammer, Palette, Wrench, Plane, GraduationCap, Truck,
  // Animal Icons
  Cat, Dog, Fish, Rabbit, Bird, Snail, Turtle, Bug,
  // Space Icons
  Sun, Globe, Moon, Rocket, Star,
  // UI Icons
  RefreshCw, Trophy, Users, Monitor, User
} from 'lucide-react';

/**
 * Custom Icons for specific Planets not in Lucide
 */
const Saturn = ({ className, strokeWidth }) => (
  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="6" />
    <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-20 12 12)" />
  </svg>
);

const Jupiter = ({ className, strokeWidth }) => (
  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 9h17" />
    <path d="M3.5 15h17" />
  </svg>
);

const Mars = ({ className, strokeWidth }) => (
  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="14" r="6" />
    <path d="m14 10 5-5" />
    <path d="M14 5h5v5" />
  </svg>
);

const THEMES = {
  jobs: {
    label: "Jobs",
    cards: [
      { id: 'chef', label: 'Chef', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-100' },
      { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'text-red-500', bg: 'bg-red-100' },
      { id: 'builder', label: 'Builder', icon: Hammer, color: 'text-yellow-600', bg: 'bg-yellow-100' },
      { id: 'artist', label: 'Artist', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-100' },
      { id: 'mechanic', label: 'Mechanic', icon: Wrench, color: 'text-gray-600', bg: 'bg-gray-100' },
      { id: 'pilot', label: 'Pilot', icon: Plane, color: 'text-blue-500', bg: 'bg-blue-100' },
      { id: 'teacher', label: 'Teacher', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100' },
      { id: 'driver', label: 'Driver', icon: Truck, color: 'text-green-600', bg: 'bg-green-100' },
    ]
  },
  animals: {
    label: "Animals",
    cards: [
      { id: 'cat', label: 'Cat', icon: Cat, color: 'text-orange-500', bg: 'bg-orange-100' },
      { id: 'dog', label: 'Dog', icon: Dog, color: 'text-amber-600', bg: 'bg-amber-100' },
      { id: 'fish', label: 'Fish', icon: Fish, color: 'text-blue-500', bg: 'bg-blue-100' },
      { id: 'rabbit', label: 'Rabbit', icon: Rabbit, color: 'text-pink-500', bg: 'bg-pink-100' },
      { id: 'bird', label: 'Bird', icon: Bird, color: 'text-sky-500', bg: 'bg-sky-100' },
      { id: 'snail', label: 'Snail', icon: Snail, color: 'text-lime-600', bg: 'bg-lime-100' },
      { id: 'turtle', label: 'Turtle', icon: Turtle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      { id: 'bug', label: 'Bug', icon: Bug, color: 'text-rose-500', bg: 'bg-rose-100' },
    ]
  },
  solar: {
    label: "Space",
    cards: [
      { id: 'sun', label: 'Sun', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-100' },
      { id: 'earth', label: 'Earth', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-100' },
      { id: 'moon', label: 'Moon', icon: Moon, color: 'text-slate-400', bg: 'bg-slate-100' },
      { id: 'mars', label: 'Mars', icon: Mars, color: 'text-red-500', bg: 'bg-red-100' },
      { id: 'jupiter', label: 'Jupiter', icon: Jupiter, color: 'text-amber-700', bg: 'bg-orange-100' },
      { id: 'saturn', label: 'Saturn', icon: Saturn, color: 'text-amber-500', bg: 'bg-amber-100' },
      { id: 'rocket', label: 'Rocket', icon: Rocket, color: 'text-purple-500', bg: 'bg-purple-100' },
      { id: 'star', label: 'Star', icon: Star, color: 'text-indigo-400', bg: 'bg-indigo-100' },
    ]
  }
};

const MODES = {
  solo: { id: 'solo', label: 'Solo', icon: User },
  pvp: { id: 'pvp', label: '2 Players', icon: Users },
  cpu: { id: 'cpu', label: 'Vs CPU', icon: Monitor },
};

export default function App() {
  // Game State
  const [currentTheme, setCurrentTheme] = useState('jobs');
  const [gameMode, setGameMode] = useState('solo');
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Multiplayer/CPU State
  const [turn, setTurn] = useState(1); // 1 or 2
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [winner, setWinner] = useState(null);

  // AI Memory
  const aiMemory = useRef({}); // Maps index -> cardId

  useEffect(() => {
    startNewGame(currentTheme, gameMode);
  }, []);

  // AI Turn Logic
  useEffect(() => {
    if (gameMode === 'cpu' && turn === 2 && !gameWon && !isProcessing) {
      const performAiMove = async () => {
        // Short delay before AI starts acting
        await new Promise(r => setTimeout(r, 1000));

        // AI Logic:
        // 1. Check if we know any pairs in memory that aren't matched yet
        let firstMoveIndex = -1;
        let secondMoveIndex = -1;

        const availableIndices = cards
          .map((_, i) => i)
          .filter(i => !matchedPairs.includes(cards[i].id));

        // Look for known pairs in memory
        const knownCards = {}; // id -> [indices]
        Object.entries(aiMemory.current).forEach(([idx, id]) => {
            const index = parseInt(idx);
            if (!matchedPairs.includes(id)) {
               if (!knownCards[id]) knownCards[id] = [];
               knownCards[id].push(index);
            }
        });

        // Try to find a pair in memory
        for (const id in knownCards) {
          if (knownCards[id].length === 2) {
            firstMoveIndex = knownCards[id][0];
            secondMoveIndex = knownCards[id][1];
            break;
          }
        }

        // If no pair known, pick a random card for first move
        if (firstMoveIndex === -1) {
          const unknownIndices = availableIndices.filter(i => !aiMemory.current[i]);
          // Prefer completely unknown cards first to gather info
          const candidates = unknownIndices.length > 0 ? unknownIndices : availableIndices;
          firstMoveIndex = candidates[Math.floor(Math.random() * candidates.length)];
        }

        // Click first card
        handleCardClick(firstMoveIndex, true);

        // Wait a bit
        await new Promise(r => setTimeout(r, 1000));

        // Decide second move
        // If we didn't have a plan, check if the first card's match is in memory
        if (secondMoveIndex === -1) {
          const firstCardId = cards[firstMoveIndex].id;
          const knownMatch = Object.entries(aiMemory.current).find(([idx, id]) => 
            id === firstCardId && parseInt(idx) !== firstMoveIndex
          );

          if (knownMatch) {
            secondMoveIndex = parseInt(knownMatch[0]);
          } else {
            // Pick random valid remaining
            const remaining = availableIndices.filter(i => i !== firstMoveIndex);
            secondMoveIndex = remaining[Math.floor(Math.random() * remaining.length)];
          }
        }

        handleCardClick(secondMoveIndex, true);
      };

      performAiMove();
    }
  }, [turn, gameMode, gameWon, isProcessing, matchedPairs]); // Depend on turn switching

  const startNewGame = (themeKey = currentTheme, modeKey = gameMode) => {
    const themeCards = THEMES[themeKey].cards;
    const pairs = [...themeCards, ...themeCards];

    const shuffled = pairs
      .sort(() => Math.random() - 0.5)
      .map((type, index) => ({
        ...type,
        uniqueId: index,
      }));

    setCurrentTheme(themeKey);
    setGameMode(modeKey);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
    setIsProcessing(false);
    setTurn(1);
    setScores({ 1: 0, 2: 0 });
    setWinner(null);
    aiMemory.current = {};
  };

  const handleCardClick = (index, isAiClick = false) => {
    // Blocking conditions
    if (isProcessing) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].id)) return;
    if (gameMode === 'cpu' && turn === 2 && !isAiClick) return; // Block user during AI turn

    // Record in AI memory whenever ANYONE flips a card
    aiMemory.current[index] = cards[index].id;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsProcessing(true);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = (currentFlippedIndices) => {
    const card1 = cards[currentFlippedIndices[0]];
    const card2 = cards[currentFlippedIndices[1]];
    const isMatch = card1.id === card2.id;

    if (isMatch) {
      const newMatched = [...matchedPairs, card1.id];
      setMatchedPairs(newMatched);
      setFlippedIndices([]);
      setIsProcessing(false);

      // Score update
      if (gameMode !== 'solo') {
        const newScores = { ...scores, [turn]: scores[turn] + 1 };
        setScores(newScores);
      }

      // Check Win
      if (newMatched.length === 8) {
        setGameWon(true);
        if (gameMode !== 'solo') {
          // Determine winner based on updated scores
          const finalScores = gameMode !== 'solo' ? { ...scores, [turn]: scores[turn] + 1 } : scores;
          if (finalScores[1] > finalScores[2]) setWinner(1);
          else if (finalScores[2] > finalScores[1]) setWinner(2);
          else setWinner('draw');
        }
      }
      // Note: In many memory rules, if you get a match, you go again. 
      // We will keep that rule here for competitive modes.

    } else {
      // No match
      setTimeout(() => {
        setFlippedIndices([]);
        setIsProcessing(false);
        // Switch turn if not solo
        if (gameMode !== 'solo') {
          setTurn(prev => prev === 1 ? 2 : 1);
        }
      }, 1500); // Slightly longer delay to see the mismatch
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 flex flex-col items-center py-6 px-4">
      <header className="w-full max-w-lg flex flex-col items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Memory Match
        </h1>

        {/* Controls Container */}
        <div className="flex flex-col gap-3 w-full">
          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            {Object.values(MODES).map((mode) => (
              <button
                key={mode.id}
                onClick={() => startNewGame(currentTheme, mode.id)}
                className={`
                  flex items-center justify-center gap-2 py-2 rounded-lg text-xs md:text-sm font-bold transition-all
                  ${gameMode === mode.id 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }
                `}
              >
                <mode.icon className="w-4 h-4" />
                <span className="hidden md:inline">{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Theme Selector */}
          <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            {Object.entries(THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => startNewGame(key, gameMode)}
                className={`
                  flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                  ${currentTheme === key 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }
                `}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {/* Score Board */}
        <div className="flex w-full justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          {gameMode === 'solo' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Moves</p>
                  <p className="text-xl font-bold text-slate-700 leading-none">{moves}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Found</p>
                  <p className="text-xl font-bold text-slate-700 leading-none">{matchedPairs.length} / 8</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Player 1 Score */}
              <div className={`flex items-center gap-3 transition-opacity ${turn === 1 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`p-2 rounded-lg ${turn === 1 ? 'bg-blue-600 shadow-md scale-110' : 'bg-slate-100'} transition-all`}>
                  <User className={`w-5 h-5 ${turn === 1 ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Player 1</p>
                  <p className="text-xl font-bold text-slate-700 leading-none">{scores[1]}</p>
                </div>
              </div>

              {/* VS Divider */}
              <div className="h-8 w-px bg-slate-200 mx-2"></div>

              {/* Player 2 / CPU Score */}
              <div className={`flex items-center gap-3 transition-opacity ${turn === 2 ? 'opacity-100' : 'opacity-50'}`}>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {gameMode === 'cpu' ? 'CPU' : 'Player 2'}
                  </p>
                  <p className="text-xl font-bold text-slate-700 leading-none">{scores[2]}</p>
                </div>
                <div className={`p-2 rounded-lg ${turn === 2 ? 'bg-red-500 shadow-md scale-110' : 'bg-slate-100'} transition-all`}>
                  {gameMode === 'cpu' ? (
                    <Monitor className={`w-5 h-5 ${turn === 2 ? 'text-white' : 'text-slate-400'}`} />
                  ) : (
                    <Users className={`w-5 h-5 ${turn === 2 ? 'text-white' : 'text-slate-400'}`} />
                  )}
                </div>
              </div>
            </>
          )}

          <button 
            onClick={() => startNewGame(currentTheme, gameMode)}
            className="ml-2 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-xl transition-colors active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Turn Indicator for Multiplayer */}
        {gameMode !== 'solo' && !gameWon && (
          <div className={`
            px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-colors duration-300
            ${turn === 1 ? 'bg-blue-500' : 'bg-red-500'}
          `}>
            {turn === 1 ? "Player 1's Turn" : (gameMode === 'cpu' ? "Computer's Turn..." : "Player 2's Turn")}
          </div>
        )}
      </header>

      {/* Game Grid */}
      <div className="relative w-full max-w-lg aspect-square md:aspect-auto">
        <div className="grid grid-cols-4 gap-3 md:gap-4 w-full h-full">
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index);
            const isMatched = matchedPairs.includes(card.id);
            const isVisible = isFlipped || isMatched;

            return (
              <div 
                key={`${card.id}-${card.uniqueId}`}
                className="relative aspect-square cursor-pointer group perspective-1000"
                onClick={() => handleCardClick(index)}
              >
                <div 
                  className={`
                    w-full h-full transition-all duration-500 transform-style-3d
                    ${isVisible ? 'rotate-y-180' : ''}
                  `}
                >
                  {/* Card Back (Face Down) */}
                  <div className="absolute w-full h-full backface-hidden">
                    <div className={`w-full h-full rounded-xl shadow-md border-b-4 flex items-center justify-center transform transition-transform group-hover:scale-[1.02]
                      ${currentTheme === 'solar' ? 'bg-indigo-900 border-indigo-950' : 'bg-blue-500 border-blue-700'}
                    `}>
                      <Star className={`w-8 h-8 opacity-50 ${currentTheme === 'solar' ? 'text-indigo-200' : 'text-blue-200'}`} />
                    </div>
                  </div>

                  {/* Card Front (Face Up) */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180">
                    <div className={`
                      w-full h-full rounded-xl shadow-sm border-2 flex flex-col items-center justify-center
                      ${card.bg} border-white
                      ${isMatched ? 'ring-4 ring-green-400 ring-opacity-50 animate-pulse-once' : ''}
                    `}>
                      <card.icon className={`w-8 h-8 md:w-10 md:h-10 mb-1 ${card.color}`} strokeWidth={2.5} />
                      <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-70 ${card.color.replace('text', 'text-slate')}`}>
                        {card.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Victory Overlay */}
        {gameWon && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl" />
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-yellow-400 max-w-sm w-full transform animate-bounce-in">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-yellow-500" />
              </div>

              {gameMode === 'solo' ? (
                <>
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Great Job!</h2>
                  <p className="text-slate-500 mb-6">You matched all the cards in {moves} moves.</p>
                </>
              ) : (
                <>
                  {winner === 'draw' ? (
                     <h2 className="text-3xl font-extrabold text-slate-800 mb-2">It's a Draw!</h2>
                  ) : (
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
                       {winner === 1 ? 'Player 1 Wins!' : (gameMode === 'cpu' ? 'Computer Wins!' : 'Player 2 Wins!')}
                    </h2>
                  )}
                  <p className="text-slate-500 mb-6 text-lg font-bold">
                    {scores[1]} - {scores[2]}
                  </p>
                </>
              )}

              <button 
                onClick={() => startNewGame(currentTheme, gameMode)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-2px] active:translate-y-0"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-pulse-once { animation: pulse-once 0.3s ease-in-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const PoeticMatchingGame = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [placedItems, setPlacedItems] = useState({
    meanings: Array(11).fill(null),
    analyses: Array(11).fill(null)
  });
  const [animatingCell, setAnimatingCell] = useState(null);
  const [animationType, setAnimationType] = useState(null);

  const correctAnimationClass = "animate-[flash_1s_ease-in-out] bg-gradient-to-r from-[#00ff00] via-[#00ffff] to-[#ff00ff] background-animate";
  const wrongAnimationClass = "animate-[flash_1s_ease-in-out] bg-gradient-to-r from-red-600 via-black to-red-600 background-animate";

  const styles = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .background-animate {
      background-size: 200% 200%;
      animation: gradient 1s ease infinite;
    }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  const poemStanzas = [
    "After every war\nsomeone has to clean up.\nThings won't\nstraighten themselves up, after all.",
    "Someone has to push the rubble\nto the side of the road,\nso the corpse-filled wagons\ncan pass.",
    "Someone has to get mired\nin scum and ashes,\nsofa springs,\nsplintered glass,\nand bloody rags.",
    "Someone has to drag in a girder\nto prop up a wall.\nSomeone has to glaze a window,\nrehang a door.",
    "Photogenic it's not,\nand takes years.\nAll the cameras have left\nfor another war.",
    "We'll need the bridges back,\nand new railway stations.\nSleeves will go ragged\nfrom rolling them up.",
    "Someone, broom in hand,\nstill recalls the way it was.\nSomeone else listens\nand nods with unsevered head.\nBut already there are those nearby\nstarting to mill about\nwho will find it dull.",
    "From out of the bushes\nsometimes someone still unearths\nrusted-out arguments\nand carries them to the garbage pile.",
    "Those who knew\nwhat was going on here\nmust make way for\nthose who know little.\nAnd less than little.\nAnd finally as little as nothing.",
    "In the grass that has overgrown\ncauses and effects,\nsomeone must be stretched out\nblade of grass in his mouth\ngazing at the clouds."
  ];

  const meanings = [
    "After a war ends, people need to clean up the mess. Things won't fix themselves.",
    "Someone needs to move broken things from the roads so trucks can pass through.",
    "Someone has to clean up dirty and broken things: broken glass, old furniture, and torn cloth.",
    "Someone must fix walls, windows, and doors that were broken during the war.",
    "This cleanup work is not pretty. It takes many years. The news people have left to film another war.",
    "People need to rebuild bridges and train stations. They work so hard their clothes get worn out.",
    "Some people remember the war. Others listen to their stories. But young people think these stories are boring.",
    "Sometimes people find old angry words from the war and throw them away like garbage.",
    "The people who knew about the war must let new people take their place. These new people know nothing about what happened.",
    "In the end, someone lies in the grass, looking at clouds, where the war once happened."
  ];

  const analyses = [
    "The tone is serious and matter-of-fact. The words 'Things won't straighten themselves up' show the speaker's practical attitude.",
    "The phrase 'corpse-filled wagons' creates a strong visual image that helps us picture the dark reality after war.",
    "Words like 'scum,' 'splintered,' and 'bloody' make readers feel disgusted and sad about war's aftermath.",
    "Repetition of 'Someone' shows that these tasks could be anyone. The role is universal.",
    "The line 'All the cameras have left' creates a lonely, abandoned mood as the world loses interest.",
    "The 'ragged sleeves' are a symbol of how hard and long people must work to rebuild.",
    "The poet speaks for different groups: those who remember, those who listen, and those who are bored.",
    "'Rusted-out arguments' is a metaphor using figurative language to compare old war disagreements to rusty metal objects",
    "The word 'little' is repeated three times, showing how knowledge of war fades over time.",
    "The image of someone lying in grass, looking at clouds creates a peaceful picture of how nature returns after war."
  ];

  useEffect(() => {
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    setShuffledMeanings(shuffleArray(meanings));
    setShuffledAnalyses(shuffleArray(analyses));
  }, []);

  const [shuffledMeanings, setShuffledMeanings] = useState([]);
  const [shuffledAnalyses, setShuffledAnalyses] = useState([]);

  const handleDrop = (e, index, type) => {
    e.preventDefault();
    const draggedData = JSON.parse(e.dataTransfer.getData('text'));
    const newPlacedItems = { ...placedItems };
    
    const isCorrect = (type === 'meanings' && meanings[index] === draggedData.content) ||
                     (type === 'analyses' && analyses[index] === draggedData.content);

    setAnimatingCell('all');
    setAnimationType(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setAnimatingCell(null);
      setAnimationType(null);
    }, 1000);

    if (isCorrect) {
      newPlacedItems[type][index] = draggedData.content;
      setPlacedItems(newPlacedItems);
      setScore(score + 100);
      
      if (score + 100 >= 2000) {
        setGameWon(true);
      }
    } else {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameWon(false);
    setGameOver(false);
    setPlacedItems({
      meanings: Array(11).fill(null),
      analyses: Array(11).fill(null)
    });
    setAnimatingCell(null);
    setAnimationType(null);
    const shuffleArray = (array) => {
      return [...array].sort(() => Math.random() - 0.5);
    };
    setShuffledMeanings(shuffleArray(meanings));
    setShuffledAnalyses(shuffleArray(analyses));
  };

  return (
    <div className="max-w-[1920px] mx-auto p-4 relative">
      <style>{styles}</style>
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center rounded-lg">
          <button 
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-2xl font-bold transition-colors"
          >
            Reset Game
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Poetry Analysis Game</h1>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              {[...Array(lives)].map((_, i) => (
                <Heart key={i} className="text-red-500" size={24} />
              ))}
            </div>
            <div className="text-xl font-bold text-gray-800">Score: {score}/2000</div>
            <button 
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold transition-colors"
            >
              Reset Game
            </button>
          </div>
        </div>

        <div className="mb-8 space-y-4 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800">How to Play</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Game Rules:</h3>
              <ul className="list-disc pl-4 text-gray-700 space-y-1">
                <li>Drag and drop the correct meanings and analyses to match each stanza of the poem</li>
                <li>Each correct match earns 100 points</li>
                <li>You need 2000 points to win</li>
                <li>You have 3 lives (hearts) - each incorrect match loses one life</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Tips:</h3>
              <ul className="list-disc pl-4 text-gray-700 space-y-1">
                <li>Read each stanza carefully before making your match</li>
                <li>Green boxes contain simpler meaning explanations</li>
                <li>Orange boxes contain detailed literary analysis</li>
                <li>All cells will flash green for correct matches and red for incorrect ones</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className={`grid grid-cols-[2fr,3fr,3fr] gap-6 flex-grow ${gameWon ? 'animate-pulse' : ''}`}>
            <div className="space-y-6">
              {poemStanzas.map((stanza, index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded bg-white shadow-sm h-40 overflow-y-auto text-gray-800 font-medium whitespace-pre-line"
                >
                  {stanza}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {meanings.map((_, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 border-dashed rounded h-40 min-w-[300px] overflow-y-auto transition-colors
                    text-gray-800 font-medium
                    ${placedItems.meanings[index] ? 'bg-green-100 border-green-300' : 'bg-green-50 border-green-200'}
                    ${gameWon ? 'border-yellow-400 shadow-lg' : ''}
                    ${animatingCell === 'all' ? (animationType === 'correct' ? correctAnimationClass : wrongAnimationClass) : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index, 'meanings')}
                >
                  {placedItems.meanings[index]}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {analyses.map((_, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 border-dashed rounded h-40 min-w-[300px] overflow-y-auto transition-colors
                    text-gray-800 font-medium
                    ${placedItems.analyses[index] ? 'bg-orange-100 border-orange-300' : 'bg-orange-50 border-orange-200'}
                    ${gameWon ? 'border-yellow-400 shadow-lg' : ''}
                    ${animatingCell === 'all' ? (animationType === 'correct' ? correctAnimationClass : wrongAnimationClass) : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index, 'analyses')}
                >
                  {placedItems.analyses[index]}
                </div>
              ))}
            </div>
          </div>

          <div className="w-[800px] h-full">
            <div className="space-y-2 h-1/2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Meanings</h3>
              <div className="grid grid-cols-2 gap-4 h-[90%]">
                {shuffledMeanings.map((meaning, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text', JSON.stringify({ content: meaning, type: 'meaning' }));
                    }}
                    className={`p-4 bg-green-100 rounded cursor-move transition-all overflow-y-auto min-w-[300px]
                      text-gray-800 font-medium hover:shadow-md h-40
                      ${Object.values(placedItems.meanings).includes(meaning) ? 'opacity-50' : 'hover:bg-green-200'}
                      ${animatingCell === 'all' ? (animationType === 'correct' ? correctAnimationClass : wrongAnimationClass) : ''}`}
                  >
                    {meaning}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2 h-1/2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyses</h3>
              <div className="grid grid-cols-2 gap-4 h-[90%]">
                {shuffledAnalyses.map((analysis, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text', JSON.stringify({ content: analysis, type: 'analysis' }));
                    }}
                    className={`p-4 bg-orange-100 rounded cursor-move transition-all overflow-y-auto min-w-[300px]
                      text-gray-800 font-medium hover:shadow-md h-40
                      ${Object.values(placedItems.analyses).includes(analysis) ? 'opacity-50' : 'hover:bg-orange-200'}
                      ${animatingCell === 'all' ? (animationType === 'correct' ? correctAnimationClass : wrongAnimationClass) : ''}`}
                  >
                    {analysis}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoeticMatchingGame;
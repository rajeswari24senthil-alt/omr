
import React from 'react';
import { EvaluationResult } from '../types';

interface ResultCardProps {
  result: EvaluationResult;
}

const subjectNames = [
    'Subject 1 (1-20)',
    'Subject 2 (21-40)',
    'Subject 3 (41-60)',
    'Subject 4 (61-80)',
    'Subject 5 (81-100)',
];

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { totalScore, subjectScores } = result;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Score</p>
            <p className="text-6xl font-bold text-blue-600 dark:text-blue-400">{totalScore}<span className="text-3xl text-gray-400 dark:text-gray-500">/100</span></p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {Object.entries(subjectScores).map(([key, score], index) => (
                <div key={key} className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate">{subjectNames[index]}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{score}<span className="text-lg text-gray-400 dark:text-gray-500">/20</span></p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ResultCard;

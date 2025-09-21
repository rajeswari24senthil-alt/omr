
import React, { useState, useCallback } from 'react';
import { EvaluationResult } from './types';
import { evaluateOmrSheet } from './services/geminiService';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import ScoreChart from './components/ScoreChart';

const App: React.FC = () => {
  const [omrImage, setOmrImage] = useState<File | null>(null);
  const [omrImageUrl, setOmrImageUrl] = useState<string | null>(null);
  const [answerKey, setAnswerKey] = useState<string>('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const defaultAnswerKey = "1:A,2:B,3:C,4:D,5:A,6:B,7:C,8:D,9:A,10:B,11:C,12:D,13:A,14:B,15:C,16:D,17:A,18:B,19:C,20:D,21:A,22:B,23:C,24:D,25:A,26:B,27:C,28:D,29:A,30:B,31:C,32:D,33:A,34:B,35:C,36:D,37:A,38:B,39:C,40:D,41:A,42:B,43:C,44:D,45:A,46:B,47:C,48:D,49:A,50:B,51:C,52:D,53:A,54:B,55:C,56:D,57:A,58:B,59:C,60:D,61:A,62:B,63:C,64:D,65:A,66:B,67:C,68:D,69:A,70:B,71:C,72:D,73:A,74:B,75:C,76:D,77:A,78:B,79:C,80:D,81:A,82:B,83:C,84:D,85:A,86:B,87:C,88:D,89:A,90:B,91:C,92:D,93:A,94:B,95:C,96:D,97:A,98:B,99:C,100:D";

  const handleImageUpload = (file: File) => {
    setOmrImage(file);
    setOmrImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleEvaluate = useCallback(async () => {
    if (!omrImage || !answerKey) {
      setError('Please upload an OMR sheet image and provide an answer key.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await fileToBase64(omrImage);
      const evaluationResult = await evaluateOmrSheet(base64Image, omrImage.type, answerKey);
      setResult(evaluationResult);
    } catch (err) {
      console.error(err);
      setError('Failed to evaluate the OMR sheet. The AI model might be unable to process the image. Please try again with a clearer image.');
    } finally {
      setIsLoading(false);
    }
  }, [omrImage, answerKey]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Inputs */}
            <div className="flex flex-col space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Evaluation Setup</h2>
              <FileUploader onFileUpload={handleImageUpload} previewUrl={omrImageUrl} />
              
              <div>
                <label htmlFor="answer-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer Key (for OMR version)
                </label>
                <textarea
                  id="answer-key"
                  rows={6}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., 1:A,2:B,3:C,..."
                  value={answerKey}
                  onChange={(e) => setAnswerKey(e.target.value)}
                ></textarea>
                 <button onClick={() => setAnswerKey(defaultAnswerKey)} className="text-xs text-blue-500 hover:underline mt-1">Use sample key</button>
              </div>

              <button
                onClick={handleEvaluate}
                disabled={isLoading || !omrImage || !answerKey}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center space-x-2"
              >
                {isLoading && <Loader />}
                <span>{isLoading ? 'Evaluating...' : 'Evaluate OMR Sheet'}</span>
              </button>
            </div>

            {/* Right Column: Results */}
            <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 min-h-[300px]">
              {isLoading && (
                <div className="text-center">
                   <div className="w-16 h-16 mx-auto mb-4"><Loader isLarge={true}/></div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">AI is analyzing the sheet...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This might take a few moments.</p>
                </div>
              )}
              {error && (
                <div className="text-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="text-lg font-bold">Evaluation Failed</h3>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {!isLoading && !error && result && (
                <div className="w-full">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Evaluation Results</h2>
                  <ResultCard result={result} />
                  <div className="mt-6 h-64">
                    <ScoreChart data={result.subjectScores} />
                  </div>
                </div>
              )}
              {!isLoading && !error && !result && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="font-semibold">Results will be displayed here</p>
                  <p className="text-sm">Upload an OMR sheet and provide an answer key to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

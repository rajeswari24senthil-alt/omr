
import { GoogleGenAI, Type } from '@google/genai';
import { EvaluationResult } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    subjectScores: {
      type: Type.OBJECT,
      description: 'Scores for each of the 5 subjects.',
      properties: {
        subject1: { type: Type.INTEGER, description: 'Score for questions 1-20' },
        subject2: { type: Type.INTEGER, description: 'Score for questions 21-40' },
        subject3: { type: Type.INTEGER, description: 'Score for questions 41-60' },
        subject4: { type: Type.INTEGER, description: 'Score for questions 61-80' },
        subject5: { type: Type.INTEGER, description: 'Score for questions 81-100' },
      },
    },
    totalScore: {
      type: Type.INTEGER,
      description: 'Total score out of 100.',
    },
    studentAnswers: {
       type: Type.ARRAY,
       description: "An array of 100 strings representing the student's marked answer for each question (1-100). Use 'A', 'B', 'C', 'D', or 'N/A' if not answered, multiple answers, or unclear.",
       items: { type: Type.STRING },
    },
  },
  required: ['subjectScores', 'totalScore', 'studentAnswers'],
};

export const evaluateOmrSheet = async (
  imageBase64: string,
  mimeType: string,
  answerKey: string
): Promise<EvaluationResult> => {
  const prompt = `
    You are an expert and highly accurate OMR (Optical Mark Recognition) sheet evaluation system. Your task is to analyze the provided image of a completed OMR sheet, compare it against the given answer key, and calculate the scores.

    **OMR Sheet Structure:**
    - There are 100 multiple-choice questions in total.
    - The questions are divided into 5 subjects, with 20 questions per subject:
      - Subject 1: Questions 1-20
      - Subject 2: Questions 21-40
      - Subject 3: Questions 41-60
      - Subject 4: Questions 61-80
      - Subject 5: Questions 81-100
    - Each question has four options: A, B, C, D.

    **Scoring Rules:**
    - Each correct answer is worth 1 point.
    - There is no negative marking for incorrect answers.
    - If a question is unanswered or has multiple bubbles filled, it should be marked as 0 points.

    **Your Tasks:**
    1.  Carefully examine the OMR sheet image to identify which bubble (A, B, C, or D) is filled for each of the 100 questions. Be precise in detecting the darkened bubbles.
    2.  For each question, compare the student's marked answer to the correct answer provided in the answer key.
    3.  Create a list of the student's answers for all 100 questions. If an answer is unclear, multi-marked, or not answered, represent it as 'N/A'.
    4.  Calculate the total number of correct answers for each of the 5 subjects.
    5.  Calculate the overall total score (total number of correct answers out of 100).
    6.  Return the results in the specified JSON format.

    **Correct Answer Key:**
    \`\`\`
    ${answerKey}
    \`\`\`

    Analyze the image and provide the evaluation result.
  `;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    }
  });

  const responseText = response.text.trim();
  
  try {
    const resultJson = JSON.parse(responseText);
    // Basic validation to ensure the parsed object matches the expected structure.
    if (resultJson.subjectScores && typeof resultJson.totalScore === 'number' && Array.isArray(resultJson.studentAnswers)) {
      return resultJson as EvaluationResult;
    } else {
      throw new Error("Parsed JSON does not match the expected EvaluationResult structure.");
    }
  } catch (e) {
    console.error("Failed to parse Gemini response:", responseText);
    throw new Error("The AI model returned an invalid data format.");
  }
};

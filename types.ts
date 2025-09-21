
export interface SubjectScores {
  subject1: number;
  subject2: number;
  subject3: number;
  subject4: number;
  subject5: number;
}

export interface EvaluationResult {
  subjectScores: SubjectScores;
  totalScore: number;
  studentAnswers: string[];
}

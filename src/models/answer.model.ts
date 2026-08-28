export interface AttemptAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  choice_id: number | null;
  is_correct: boolean;
  points_awarded: number;
}

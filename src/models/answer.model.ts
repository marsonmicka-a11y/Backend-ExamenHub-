// Réponse d'un étudiant à une question, pour une tentative donnée.
export interface AttemptAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  choice_id: number | null; // null = question laissée sans réponse (RG-05)
  is_correct: boolean;
  points_awarded: number;
}

export interface Attempt {
  id: number;
  student_id: number;
  exam_id: number;
  score: number;
  max_score: number;
  submitted_at: Date;
}

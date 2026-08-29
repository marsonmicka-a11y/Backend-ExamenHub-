import { Choice, PublicChoice } from "./choice.model";

export interface Question {
  id: number;
  exam_id: number;
  statement: string;
  points: number;
  created_at: Date;
}

export interface QuestionWithChoices extends Question {
  choices: Choice[];
}

export interface PublicQuestion {
  id: number;
  statement: string;
  points: number;
  choices: PublicChoice[];
}

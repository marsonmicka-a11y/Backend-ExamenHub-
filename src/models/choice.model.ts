export interface Choice {
  id: number;
  question_id: number;
  label: string;
  is_correct: boolean;
}

export interface PublicChoice {
  id: number;
  label: string;
}

export function toPublicChoice(c: Choice): PublicChoice {
  return {
    id: c.id,
    label: c.label
  };
}
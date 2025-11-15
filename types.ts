
export interface FormState {
  childImage: File | null;
  age: number;
  style: string;
  numImages: number;
  extraNotes: string;
}

export interface GeneratedPrompt {
  prompt_title: string;
  model: string;
  description: string;
  outfit: {
    style: string;
    details: string;
  };
  pose_expression: {
    pose: string;
    expression: string;
  };
  lighting: {
    type: string;
    description: string;
  };
  background: {
    theme: string;
    elements: string;
  };
  camera: {
    angle: string;
    lens: string;
    composition: string;
  };
  color_palette: string[];
  mood: string;
  quality: string;
  environment_effects: string;
}

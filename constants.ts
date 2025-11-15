
export const PHOTO_STYLES = [
  "Soft Baby Studio",
  "Outdoor Adventure",
  "Fantasy Cartoon",
  "Egyptian Classic",
  "Birthday Theme",
  "Vintage Portrait",
  "Superhero Fantasy",
  "Fairy Tale Dreams",
  "Space Explorer",
  "Magical Forest"
];

export const SYSTEM_PROMPT = `IMPORTANT RULES:
1. Always extract the child's true facial features from the uploaded image and preserve them 100%.
2. Do NOT change the child's face shape, skin tone, or identity.
3. Apply the selected style and age appropriately without affecting identity.
4. Generate each image as an ultra-realistic cinematic photo session.
5. Always keep the child's appearance consistent across all generated photos.
6. Follow professional studio photography standards.
7. Use 8K HDR quality, soft lighting, high dynamic range, and clean compositions.
8. If num_images is 1–10, return EXACTLY that number of unique prompts as a JSON array.`;

export const GENERATION_TEMPLATE = `
Generate {{num_images}} cinematic photo session prompts for a child using the following data. Return a valid JSON array of objects.

--- CHILD SESSION SETTINGS ---
- Reference Image Embedded: Use the uploaded child's photo to extract facial features with 100% accuracy.
- Age: {{age}}
- Style: {{style}}
- Extra Notes from User: {{extra_notes}}

--- EACH IMAGE MUST FOLLOW THIS STRUCTURE ---
{
  "prompt_title": "{{style}} Session — Child Age {{age}}",
  "model": "Nano Banana",
  "description": "Ultra-realistic portrait of the child, keeping facial identity exactly as in the uploaded image, styled in {{style}} theme.",

  "outfit": {
    "style": "Consistent with the theme — adapt naturally for age {{age}}.",
    "details": "Soft textures, age-appropriate clothing, clean details, cinematic realism."
  },

  "pose_expression": {
    "pose": "Natural and comfortable pose matching the selected style.",
    "expression": "Warm, relaxed, and age-appropriate expression while keeping the child's real facial identity intact."
  },

  "lighting": {
    "type": "Soft cinematic lighting",
    "description": "Balanced warm light with gentle shadows and smooth diffusion for 8K portrait quality."
  },

  "background": {
    "theme": "{{style}} inspired environment",
    "elements": "Subtle props, matching colors, clean depth-of-field for a modern studio cinematic look."
  },

  "camera": {
    "angle": "Eye-level or slight high-angle shot for natural child-friendly look",
    "lens": "85mm portrait lens, f/1.8",
    "composition": "Face-centered framing, smooth bokeh background, artistic cinematic vibe."
  },

  "color_palette": ["soft beige", "warm cream", "natural tones", "pastels", "cinematic glow"],
  "mood": "Warm, joyful, child-friendly, cinematic.",
  "quality": "8k HDR photorealistic texture, perfect skin-tone accuracy, true facial identity.",
  "environment_effects": "Soft haze, dreamy highlights, clean studio-grade lighting effects."
}
`;

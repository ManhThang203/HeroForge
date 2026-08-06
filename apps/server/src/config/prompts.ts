export const SUPERHERO_PROMPT = `Transform this person into a cinematic superhero while preserving their exact facial identity — same face shape, eyes, nose, mouth, skin tone, and hair as the original photo. Do not alter facial structure or generate a different person.

Add a heroic superhero costume with dynamic cape, form-fitting armor-style suit, and subtle glowing accents. Set against a dramatic cityscape or sky background with cinematic rim lighting and volumetric light rays.

Style: high-detail comic-book illustration blended with realistic photography, vibrant color grading, epic hero pose, sharp focus on the face.

Critical constraint: the face must remain fully recognizable and unedited in structure — only add costume, lighting, and background elements.`;

export const IMAGE_MODEL = "bfl/flux-kontext-pro";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

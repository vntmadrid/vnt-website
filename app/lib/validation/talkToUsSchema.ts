import { z } from "zod";

export const talkToUsSchema = z.object({
  name: z.string().trim().min(1, "Please provide your name."),
  company: z.string().trim().optional(),
  email: z.string().trim().email("Please provide a valid email."),
  project_details: z
    .string()
    .trim()
    .min(1, "Please tell us about your vision."),
});

export type TalkToUsInput = z.infer<typeof talkToUsSchema>;

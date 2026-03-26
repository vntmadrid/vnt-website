import { z } from "zod";

export const talkToUsSchema = z.object({
  name: z.string().trim().min(1, "Please provide your name."),
  company: z.string().trim().optional(),
  email: z.string().trim().email("Please provide a valid email."),
  talk_to_us: z
    .string()
    .trim()
    .min(1, "Please tell us what you want to talk about."),
});

export type TalkToUsInput = z.infer<typeof talkToUsSchema>;

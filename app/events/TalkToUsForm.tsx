"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  talkToUsSchema,
  type TalkToUsInput,
} from "@/lib/validation/talkToUsSchema";

const initialFormData: TalkToUsInput = {
  name: "",
  company: "",
  email: "",
  talk_to_us: "",
};

export default function TalkToUsForm() {
  const [formData, setFormData] = useState<TalkToUsInput>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSuccess(false);

    const parsed = talkToUsSchema.safeParse(formData);

    if (!parsed.success) {
      setMessage(
        parsed.error.issues[0]?.message ?? "Please check your form values.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/talk-to-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
      setMessage(data.message ?? "Thanks, we will get back to you soon.");
      setFormData(initialFormData);
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-8 text-white p-4">
      <h2 className="mb-4 text-4xl font-semibold">Collaborate_</h2>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex w-full gap-2">
          <input
            className="flex-1 min-w-0 border border-mauve-600 px-3 py-2 text-lg p-2"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="flex-1 min-w-0 border border-mauve-600 px-3 py-2 text-lg p-2"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <input
          className="border border-mauve-600 px-3 py-2 text-lg p-2"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          className="min-h-28 border border-mauve-600 px-3 py-2 text-lg p-2"
          name="talk_to_us"
          placeholder="Tell us about your project :)"
          value={formData.talk_to_us}
          onChange={handleChange}
          required
        />

        <button
          className="bg-white text-black px-4 py-3 font-semibold text-lg"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {message ? (
          <p className={isSuccess ? "text-green-700" : "text-red-700"}>
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

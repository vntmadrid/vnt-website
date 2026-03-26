import { NextResponse } from "next/server";
import { talkToUsSchema } from "@/lib/validation/talkToUsSchema";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = talkToUsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            parsed.error.issues[0]?.message ?? "Please check your form values.",
        },
        { status: 400 },
      );
    }

    // Replace this with your email or CRM integration.
    const submission = {
      name: parsed.data.name,
      company: parsed.data.company ?? "",
      email: parsed.data.email,
      talk_to_us: parsed.data.talk_to_us,
      createdAt: new Date().toISOString(),
    };

    void submission;

    return NextResponse.json(
      { message: "Thanks for reaching out. We will contact you soon." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }
}

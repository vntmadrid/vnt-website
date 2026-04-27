"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
    talkToUsSchema,
    type TalkToUsInput,
} from "@/app/lib/validation/talkToUsSchema";

import MagnetLines from "@/components/MagnetLines";
import { scale } from "motion/react";

const initialFormData: TalkToUsInput = {
    name: "",
    company: "",
    email: "",
    project_details: "",
};

export default function TalkToUsForm({ lang }: { lang: "en" | "es" }) {
    const t =
        lang === "es"
            ? {
                  formTitle: "Colabora_",
                  namePlaceholder: "Nombre*",
                  companyPlaceholder: "Empresa",
                  emailPlaceholder: "Correo*",
                  projectPlaceholder: "Cuentanos sobre tu proyecto :)*",
                  submit: "Enviar",
                  submitting: "Enviando...",
                  invalidForm: "Revisa los datos del formulario.",
                  requestError: "Algo salio mal. Intentalo de nuevo.",
                  success: "Gracias, te responderemos pronto.",
                  networkError: "Error de red. Intentalo de nuevo.",
              }
            : {
                  formTitle: "Collaborate_",
                  namePlaceholder: "Name*",
                  companyPlaceholder: "Company",
                  emailPlaceholder: "Email*",
                  projectPlaceholder: "Tell us about your project :)*",
                  submit: "Submit",
                  submitting: "Submitting...",
                  invalidForm: "Please check your form values.",
                  requestError: "Something went wrong. Please try again.",
                  success: "Thanks, we will get back to you soon.",
                  networkError: "Network error. Please try again.",
              };

    const [formData, setFormData] = useState<TalkToUsInput>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const emailKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

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

        console.log("trying to submit with key:", emailKey);

        console.log("unparsed data:", formData);

        const parsed = talkToUsSchema.safeParse(formData);

        console.log("parsed data:", parsed);

        if (!parsed.success) {
            setMessage(parsed.error.issues[0]?.message ?? t.invalidForm);
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Prepare the payload with your Web3Forms Access Key
            const payload = {
                ...parsed.data,
                // !! MOVE THIS KEY TO .env OR SOMEWHERE SAFER
                access_key: emailKey, // Get this from web3forms.com
                subject: `New Lead from ${parsed.data.company || parsed.data.name}`, // Optional: Customizes email subject
            };

            // 2. Post directly to Web3Forms
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            console.log("email details:", data);

            if (data.success) {
                setIsSuccess(true);
                setMessage(t.success);
                setFormData(initialFormData);
            } else {
                // Web3Forms returns error messages in data.message
                setMessage(data.message ?? t.requestError);
            }
        } catch {
            setMessage(t.networkError);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isSuccess || message) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
                setMessage(null);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer); // Cleanup if the user submits again fast
        }
    }, [isSuccess, message]);

    return (
        <section className=" text-white p-4">
            <h2 className="mb-6 text-4xl font-semibold">{t.formTitle}</h2>
            <div className="flex flex-row gap-8">
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <div className="flex w-full gap-2">
                        <input
                            className="flex-1 min-w-0 border border-mauve-600 px-3 py-2 text-lg p-2"
                            name="name"
                            placeholder={t.namePlaceholder}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            className="flex-1 min-w-0 border border-mauve-600 px-3 py-2 text-lg p-2"
                            name="company"
                            placeholder={t.companyPlaceholder}
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>

                    <input
                        className="border border-mauve-600 px-3 py-2 text-lg p-2"
                        name="email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        className="h-full border border-mauve-600 px-3 py-2 text-lg p-2"
                        name="project_details"
                        placeholder={t.projectPlaceholder}
                        value={formData.project_details}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className={`px-4 py-3 font-semibold text-lg transition-all duration-500 ease-in-out text-black ${
                            isSubmitting
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                        } ${
                            isSuccess
                                ? "bg-green-600 text-white"
                                : message && !isSuccess
                                  ? "bg-red-600 text-white"
                                  : "bg-white text-black hover:bg-mauve-200"
                        }`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? t.submitting
                            : isSuccess
                              ? t.success
                              : message && !isSuccess
                                ? "Error, Please try again."
                                : t.submit}
                    </button>

                    {/* {message ? (
                        <p
                            className={
                                isSuccess ? "text-green-700" : "text-red-700"
                            }
                        >
                            {message}
                        </p>
                    ) : null}

                    {true ? (
                        <p className={true ? "text-green-700" : "text-red-700"}>
                            successful!
                        </p>
                    ) : null} */}
                </form>
                <MagnetLines
                    rows={10}
                    columns={12}
                    containerSize="40vmin"
                    lineColor="#efefef"
                    lineWidth="2px"
                    lineHeight="30px"
                    baseAngle={-10}
                    style={{ scale: "1.05" }}
                />
            </div>
        </section>
    );
}

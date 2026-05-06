"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function ShopToastHandler({ lang }: { lang: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const success = searchParams.get("success") === "true";
        const canceled = searchParams.get("canceled") === "true";

        if (success || canceled) {
            if (success) {
                const title =
                    lang === "es"
                        ? "¡Compra completada!"
                        : "Purchase completed!";
                const message =
                    lang === "es"
                        ? "Tu pedido ha sido confirmado. Pronto recibirás un email."
                        : "Your order has been confirmed. You'll receive an email shortly.";
                toast.success(title, { description: message });
            } else {
                const title =
                    lang === "es" ? "Compra cancelada" : "Purchase canceled";
                const message =
                    lang === "es"
                        ? "Tu compra ha sido cancelada."
                        : "Your purchase was canceled.";
                toast.error(title, { description: message });
            }

            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("success");
            newParams.delete("canceled");

            // Replaces the URL without those params, avoiding re-triggers
            router.replace(`${pathname}?${newParams.toString()}`, {
                scroll: false,
            });
        }
    }, [searchParams, lang, router, pathname]);

    return null;
}

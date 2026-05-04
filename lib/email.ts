export async function sendStaffNotification(orderData: {
    customerName: string;
    customerEmail: string;
    total: number;
    items: { title: string; quantity: number }[];
    deliveryMethod: string;
    shippingAddress?: string;
}) {
    const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    if (!WEB3FORMS_ACCESS_KEY) {
        console.warn(
            "WEB3FORMS_ACCESS_KEY is not defined. Skipping notification.",
        );
        return;
    }

    const itemsList = orderData.items
        .map((item) => `- ${item.title} (x${item.quantity})`)
        .join("\n");

    const message = `
        New Order Received!

        Customer: ${orderData.customerName}
        Email: ${orderData.customerEmail}
        Total: €${(orderData.total / 100).toFixed(2)}
        Delivery Method: ${orderData.deliveryMethod}
        ${orderData.shippingAddress ? `Shipping Address: ${orderData.shippingAddress}` : ""}

        Items:
        ${itemsList}
  `.trim();

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: `New Order from ${orderData.customerName}`,
                from_name: "VNT Website Shop",
                message: message,
            }),
        });

        const result = await response.json();
        if (!result.success) {
            console.error("Failed to send staff notification:", result);
        }
    } catch (error) {
        console.error("Error sending staff notification:", error);
    }
}

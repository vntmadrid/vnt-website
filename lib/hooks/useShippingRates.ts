"use client";

import { useState } from "react";

export interface Address {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
    phone: string;
}

export function useShippingRates() {
    const [address, setAddress] = useState<Address>({
        name: "",
        street1: "",
        city: "",
        state: "",
        zip: "",
        country: "ES",
        email: "",
        phone: "",
    });

    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [selectedRate, setSelectedRate] = useState<any>(null);
    const [isFetchingRates, setIsFetchingRates] = useState(false);
    const [fetchError, setFetchError] = useState<string>("");

    const fetchRates = async (items: any[]) => {
        try {
            setIsFetchingRates(true);
            setFetchError("");
            setShippingRates([]); // Clear previous rates

            const res = await fetch("/api/shipping-rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, items }),
            });
            const data = await res.json();

            if (data.rates) {
                setShippingRates(data.rates);
                if (data.rates.length > 0) {
                    setSelectedRate(data.rates[0]);
                } else {
                    setSelectedRate(null);
                    setFetchError("no_rates");
                }
            } else {
                setFetchError("fetch_failed");
            }
        } catch (err) {
            console.error(err);
            setFetchError("fetch_failed");
        } finally {
            setIsFetchingRates(false);
        }
    };

    const resetRates = () => {
        setShippingRates([]);
        setSelectedRate(null);
        setFetchError("");
    };

    return {
        address,
        setAddress,
        shippingRates,
        selectedRate,
        setSelectedRate,
        isFetchingRates,
        fetchError,
        fetchRates,
        resetRates,
    };
}

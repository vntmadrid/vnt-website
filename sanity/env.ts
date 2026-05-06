export const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-17";

// We removed assertValue and added hardcoded fallbacks
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1hkynqya";

// You can keep this function here so other parts of the app don't break,
// but we aren't using it for the main exports above anymore.
function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) {
        throw new Error(errorMessage);
    }
    return v;
}

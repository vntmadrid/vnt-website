// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from "./client";

const globalForSanity = globalThis as typeof globalThis & {
  __sanityLiveTokenLogged?: boolean;
};

if (typeof window === "undefined" && !globalForSanity.__sanityLiveTokenLogged) {
  globalForSanity.__sanityLiveTokenLogged = true;
  const hasReadToken = Boolean(process.env.SANITY_API_READ_TOKEN);
  console.info(
    `[sanity live] SANITY_API_READ_TOKEN ${hasReadToken ? "present" : "missing"}`,
  );
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN || false,
  browserToken: process.env.SANITY_API_READ_TOKEN || false,
});

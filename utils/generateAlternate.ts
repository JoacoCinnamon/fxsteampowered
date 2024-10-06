import type { Context } from "hono";
import { Buffer } from "node:buffer";
import { getAppUrl } from "@/steam/services.ts";

function decodeURIParam(param: string | null | undefined) {
  return param
    ? decodeURIComponent(
      Buffer.from(decodeURIComponent(param), "base64").toString("utf-8"),
    )
    : "";
}

/**
 * Extracted from https://github.com/okdargy/fxTikTok/blob/hono-rewrite/src/util/generateAlternate.tsx
 */
export default function generateAlternate(c: Context): {
  version: string;
  type: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  title: string;
} {
  const { title, description, price, appId } = c.req.query();
  const appUrl = getAppUrl(appId);

  const decodedTitle = decodeURIParam(title);
  const decodedDescription = decodeURIParam(description);
  const decodedPrice = decodeURIParam(price);
  // Some Discord embed values are limited to 256 characters, truncate if necessary
  // See more: https://www.pythondiscord.com/pages/guides/python-guides/discord-embed-limits/
  const truncatedDescription = decodedDescription.length > 256
    ? `${decodedDescription.substring(0, 253)}...`
    : decodedDescription;

  return {
    version: "1.0",
    type: "link",
    author_name: truncatedDescription || "fxSteamPowered - Embed",
    author_url: appUrl,
    provider_name: `${decodeURIComponent(decodedTitle)}`,
    provider_url: appUrl,
    title: decodedPrice,
  };
}

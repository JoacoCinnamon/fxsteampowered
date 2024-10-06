import type { PropsWithChildren } from "hono/jsx";
import { getAppUrl } from "@/steam/services.ts";
import { BaseHtml } from "@/templates/BaseHtml.tsx";
import type { SteamAppData } from "@/steam/types.ts";
import { Buffer } from "node:buffer";
import { formatPrice } from "@/currencies/helpers.ts";

type SteamAppProps = {
  steamApp: SteamAppData;
};

export const SteamAppVideo = async (
  { steamApp }: PropsWithChildren<SteamAppProps>,
) => {
  const appUrl = getAppUrl(steamApp.steam_appid.toString());
  let steamAppMetaTags: { name: string; content: string }[] = [];

  if (steamApp.movies && steamApp.movies.length > 0) {
    const [videoUrl] = steamApp.movies[0].mp4["480"].split("?t=");
    steamAppMetaTags = [
      {
        name: "og:video",
        content: videoUrl,
      },
      {
        name: "og:video:secure_url",
        content: videoUrl,
      },
      {
        name: "og:type",
        content: "video",
      },
      {
        name: "og:video:type",
        content: "video/mp4",
      },
      {
        name: "twitter:card",
        content: "player",
      },
      {
        name: "twitter:player",
        content: videoUrl,
      },
      {
        name: "twitter:image",
        content: steamApp.movies[0].thumbnail,
      },
      {
        name: "og:image",
        content: steamApp.movies[0].thumbnail,
      },
      {
        name: "og:image:type",
        content: "image/jpg",
      },
    ];
  } else {
    steamAppMetaTags = [
      {
        name: "twitter:image",
        content: steamApp.header_image,
      },
      {
        name: "og:type",
        content: "image",
      },
      {
        name: "og:image",
        content: steamApp.header_image,
      },
      {
        name: "og:image:type",
        content: "image/jpg",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ];
  }

  const price = await formatPrice(steamApp);

  const alternate = {
    title: Buffer.from(steamApp.name).toString("base64"),
    description: Buffer.from(steamApp.short_description).toString("base64"),
    price: Buffer.from(price).toString("base64"),
    appId: steamApp.steam_appid,
  };

  return (
    <BaseHtml
      tags={[
        {
          name: "og:url",
          content: appUrl,
        },
        {
          name: "og:title",
          content: price.trim(),
        },
        {
          name: "theme-color",
          content: "#171d25", // Steam theme color
        },
        {
          name: "twitter:creator",
          content: steamApp.developers[0],
        },
        {
          name: "twitter:title",
          content: price.trim(),
        },
        {
          name: "twitter:domain",
          content: "store.steampowered",
        },
        {
          name: "twitter:url",
          content: appUrl,
        },
        ...steamAppMetaTags,
      ]}
      alternate={alternate}
    >
      <title>{steamApp.name}</title>
    </BaseHtml>
  );
};

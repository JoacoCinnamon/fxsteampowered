import type { PropsWithChildren } from "hono/jsx";
import { getAppUrl } from "@/steam/services.ts";
import { BaseHtml } from "@/templates/BaseHtml.tsx";
import type { SteamAppData } from "@/steam/types.ts";
import { Buffer } from "node:buffer";

type SteamAppProps = {
  app: SteamAppData;
};

const showReleaseDate = (releaseDate: string) =>
  `${releaseDate !== "Coming soon" ? `(${releaseDate})` : ""}`;

export const SteamAppVideo = ({ app }: PropsWithChildren<SteamAppProps>) => {
  const appUrl = getAppUrl(app.steam_appid.toString());
  let steamAppMetaTags: { name: string; content: string }[] = [];

  if (app.movies && app.movies.length > 0) {
    const videoUrl = app.movies[0].webm["480"];
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
        content: "video/webm",
      },
      {
        name: "og:video:width",
        content: "auto",
      },
      {
        name: "og:video:height",
        content: "auto",
      },
      {
        name: "twitter:card",
        content: "player",
      },
      {
        name: "twitter:player",
        content: videoUrl,
      },
    ];
  } else {
    steamAppMetaTags = [
      {
        name: "og:type",
        content: "image.other",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ];
  }

  // TODO: DolarCripto Price
  let price = "";
  if (app.is_free) {
    price = "Gratis";
  } else if (app.price_overview) {
    price = app.price_overview.final_formatted;
  } else if (app.release_date.coming_soon) {
    price = `Muy Pronto ${showReleaseDate(app.release_date.date)}`;
  }

  const alternate = {
    title: Buffer.from(app.name).toString("base64"),
    description: Buffer.from(app.short_description).toString("base64"),
    price: Buffer.from(price).toString("base64"),
    appId: app.steam_appid,
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
          content: app.developers[0],
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
        {
          name: "twitter:image",
          content: app.header_image,
        },
        {
          name: "og:image",
          content: app.header_image,
        },
        {
          name: "og:image:type",
          content: "image/jpg",
        },
        {
          name: "og:image:width",
          content: "auto",
        },
        {
          name: "og:image:height",
          content: "auto",
        },
        ...steamAppMetaTags,
      ]}
      alternate={alternate}
    >
      <title>{app.name}</title>
    </BaseHtml>
  );
};

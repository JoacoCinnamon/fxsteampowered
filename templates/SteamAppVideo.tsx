import type { PropsWithChildren } from "hono/jsx";
import { getAppUrl } from "@/steam/services.ts";
import { BaseHtml } from "@/templates/BaseHtml.tsx";
import type { SteamAppData } from "@/steam/types.ts";
import { Buffer } from 'node:buffer';

type SteamAppProps = {
  app: SteamAppData;
}

export const SteamAppVideo = ({ app }: PropsWithChildren<SteamAppProps>) => {
  const appUrl = getAppUrl(app.steam_appid.toString());
  let steamAppMetaTags: { name: string; content: string }[] = [];

  if (app.movies && app.movies.length > 0) {
    const videoUrl = app.movies[0].webm["480"];
    steamAppMetaTags = [
      {
        name: "og:video",
        content: videoUrl
      },
      {
        name: "og:video:type",
        content: "video/webm"
      },
      {
        name: "og:video:width",
        content: "auto"
      },
      {
        name: "og:video:height",
        content: "auto"
      },
      {
        name: "og:type",
        content: "video"
      },
      {
        name: "twitter:card",
        content: "player"
      }
    ];
  } else {
    steamAppMetaTags = [
      {
        name: "og:image",
        content: app.header_image
      },
      {
        name: "og:image:type",
        content: "image/jpg"
      },
      {
        name: "og:image:width",
        content: "auto"
      },
      {
        name: "og:image:height",
        content: "auto"
      },
      {
        name: "og:type",
        content: "image.other"
      },
      {
        name: "twitter:card",
        content: "summary_large_image"
      }
    ];
  }

  // TODO: DolarCripto Price
  let title = ""
  if (app.is_free) {
    title = "Gratis"
  } else if (app.price_overview) {
    title = app.price_overview.final_formatted
  } else if (app.release_date.coming_soon) {
    title = `Muy Pronto ${app.release_date.date !== "Coming soon" ? `(${app.release_date.date})` : ""}`
  }

  const alternate = {
    unique_id: app.name,
    nickname: app.name,
    description: Buffer.from(app.short_description).toString('base64')
  }

  return <BaseHtml tags={[
    {
      name: "og:title",
      content: title.trim()
    },
    {
      name: "theme-color",
      content: "#171d25" // TikTok"s theme color
    },
    // {
    //   name: "twitter:site",
    //   content: `${data.author.uniqueId}`
    // },
    {
      name: "twitter:creator",
      content: `@${app.developers[0]}`
    },
    {
      name: "twitter:title",
      content: `${app.short_description}` // Description
    },
    {
      name: "og:url",
      content: appUrl
    },
    ...(!app.movies || app.movies.length === 0
      ? [
        {
          name: "og:description",
          content: app.short_description
        }
      ]
      : []),
    ...steamAppMetaTags
  ]}
    alternate={alternate}>
    <title>{app.name}</title>
  </BaseHtml>
}
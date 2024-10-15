import type { PropsWithChildren } from "hono/jsx";
import { html } from "hono/html";

type BaseHtmlProps = {
  tags: {
    name: string;
    content: string | null;
  }[];
  alternate?: {
    [key: string]: string | number;
  };
};

export const BaseHtml = (
  { tags, alternate, children }: PropsWithChildren<BaseHtmlProps>,
) => {
  const alternateUrl = new URL(
    "https://fxsteampowered.deno.dev/generate/alternate",
  );

  if (alternate) {
    for (const key in alternate) {
      alternateUrl.searchParams.set(
        key,
        encodeURIComponent(alternate[key].toString()),
      );
    }
  }

  return (
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />

        {tags.map((tag) => (tag.content
          ? <meta property={tag.name} content={tag.content} />
          : null)
        )}
        {alternate
          ? (
            <link
              rel="alternate"
              href={alternateUrl.toString()}
              type="application/json+oembed"
            />
          )
          : null}

        {children}

        {html`
        <style>   
          body {
            margin: 0;
            background-color: #1b2838;
            font-family: Arial, sans-serif;
          }
          .steam-header {
            width: 100vw;
            height: 94px;
            background-color: #171d25;
            display: flex;
            align-items: center;
            padding: 0 20px;
            box-sizing: border-box;
            color: white;
          }
        </style>
        `}
      </head>
      <body>
        <div class="steam-header" />
      </body>
    </html>
  );
};

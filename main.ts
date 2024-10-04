import { Hono } from "hono";
import { logger } from "hono/logger";
import { appendTrailingSlash } from "hono/trailing-slash";

import { fetchSteamApp, isSteamApiResponseError } from "@/steam/services.ts";
import generateAlternate from "@/utils/generateAlternate.ts";
import { GITHUB_REPO_URL } from "@/conts.ts";
import { SteamAppVideo } from "@/templates/SteamAppVideo.tsx";

const app = new Hono({ strict: true });

app.use(logger());
app.use(appendTrailingSlash());

app.get("/", () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: GITHUB_REPO_URL,
    },
  });
});

// Duplicated code just for Context types :)

// TODO: Show proper error
app.get("/app/:id/", async (c) => {
  const appId = c.req.param("id");

  const [err, appResponse] = await fetchSteamApp(appId);
  if (err) {
    console.error(err);
    return c.text(err.message, 500);
  }
  if (isSteamApiResponseError(appId, appResponse)) {
    return c.text("There is no game with that id", 404);
  }

  const responseContent = SteamAppVideo({ app: appResponse[appId].data });
  return c.html(responseContent, 200, {
    "Cache-Control": "public, max-age=3600",
  });
});

// TODO: Show proper error
app.get("/app/:id/:slug/", async (c) => {
  const appId = c.req.param("id");

  const [err, appResponse] = await fetchSteamApp(appId);
  if (err) {
    console.error(err);
    return c.text(err.message, 500);
  }
  if (isSteamApiResponseError(appId, appResponse)) {
    return c.text("There is no game with that id", 404);
  }

  const responseContent = SteamAppVideo({ app: appResponse[appId].data });
  return c.html(responseContent, 200, {
    "Cache-Control": "public, max-age=3600",
  });
});

app.get("/generate/alternate", (c) => {
  const content = JSON.stringify(generateAlternate(c));

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

Deno.serve(app.fetch);

import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { appendTrailingSlash } from "hono/trailing-slash";

import {
  fetchSteamApp,
  getAppUrl,
  isSteamApiResponseError,
} from "@/steam/services.ts";
import generateAlternate from "@/utils/generateAlternate.ts";
import { BOT_REGEX, GITHUB_REPO_URL } from "@/conts.ts";
import { SteamAppVideo } from "@/templates/SteamAppVideo.tsx";

const app = new Hono({ strict: true });

app.use(logger());
app.use(appendTrailingSlash());
app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));

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

  // If the user agent is a bot, redirect to the Steam page
  if (!BOT_REGEX.test(c.req.header("User-Agent") || "")) {
    return c.redirect(getAppUrl(appId), 302);
  }

  const [err, appResponse] = await fetchSteamApp(appId);
  if (err) {
    console.error(err);
    return c.text(err.message, 500);
  }
  if (isSteamApiResponseError(appId, appResponse)) {
    return c.text("There is no game with that id", 404);
  }
  const steamApp = appResponse[appId].data;

  return c.html(SteamAppVideo({ steamApp }), 200, {
    "Cache-Control": "public, max-age=3600",
  });
});

// TODO: Show proper error
app.get("/app/:id/:slug/", async (c) => {
  const appId = c.req.param("id");

  // If the user agent is a bot, redirect to the Steam page
  if (!BOT_REGEX.test(c.req.header("User-Agent") || "")) {
    return c.redirect(getAppUrl(appId), 302);
  }

  const [err, appResponse] = await fetchSteamApp(appId);
  if (err) {
    console.error(err);
    return c.text(err.message, 500);
  }
  if (isSteamApiResponseError(appId, appResponse)) {
    return c.text("There is no game with that id", 404);
  }
  const steamApp = appResponse[appId].data;

  return c.html(SteamAppVideo({ steamApp }), 200, {
    "Cache-Control": "public, max-age=3600",
  });
});

app.get("/generate/alternate", (c) => {
  return c.json(generateAlternate(c), 200, {
    "Cache-Control": "public, max-age=3600",
  });
});

Deno.serve(app.fetch);

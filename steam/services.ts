import {
  STORE_STEAMPOWERED_API_URL,
  STORE_STEAMPOWERED_URL,
} from "@/steam/consts.ts";
import { Err, Ok, to } from "@/utils/helpers.ts";
import type {
  SteamGameAppApiErrorResponse,
  SteamGameAppApiResponse,
  SteamGameAppApiSuccessResponse,
} from "@/steam/types.ts";

export const getGameUrl = (gameId: string) =>
  `${STORE_STEAMPOWERED_URL}/app/${gameId}?cc=AR`;

export async function fetchSteamApp(gameId: string) {
  const [err, res] = await to(
    fetch(
      `${STORE_STEAMPOWERED_API_URL}/appdetails?appids=${gameId}&cc=arg&l=es`,
      {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
        },
      },
    ),
  );

  if (err != null) return Err(err);
  if (!res.ok) {
    return Err(
      new Error(
        `Failed to fetch game data from Steam. Status: ${res.status} ${res.statusText}. URL: ${STORE_STEAMPOWERED_URL}/app/${gameId}`,
      ),
    );
  }

  try {
    const data = await res.json();
    return Ok<SteamGameAppApiResponse>(
      data,
    );
  } catch (error) {
    if (error instanceof Error) return Err(error);

    return Err(
      new Error(
        `Unknown error while fetching Steam game: ${JSON.stringify(error)}`,
      ),
    );
  }
}

export function isSteamApiResponseError(
  appId: string,
  appResponse: SteamGameAppApiResponse,
): appResponse is SteamGameAppApiErrorResponse {
  return appResponse == null || !appResponse[appId]?.success;
}

export function isSteamGame(
  appId: string,
  appResponse: SteamGameAppApiSuccessResponse,
) {
  return appResponse[appId].data.type === "game";
}
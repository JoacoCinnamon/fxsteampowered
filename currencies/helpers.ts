import type { SteamAppData } from "@/steam/types.ts";
import { convertDollarToARS } from "@/currencies/dolarCripto.ts";

export const centsToDollars = (cents: number) =>
  Number((cents / 100).toFixed(2));

export const parsePesosToNumber = (pesos: string) =>
  Number(pesos.replaceAll(",", "."));

const showReleaseDate = (releaseDate: string) =>
  `${releaseDate !== "Coming soon" ? `(${releaseDate})` : ""}`;

export async function formatPrice(steamApp: SteamAppData) {
  const { date } = steamApp.release_date;
  if (steamApp.release_date.coming_soon) return `Muy Pronto ${showReleaseDate(date)}`;
  if (steamApp.is_free) return "Gratis";

  if (steamApp.price_overview) {
    const dollarAmount = centsToDollars(steamApp.price_overview.final);
    const dolarCriptoAmount = await convertDollarToARS(dollarAmount);
    return `💲 USD $${dollarAmount} 🧉 ARS $${dolarCriptoAmount}`;
  }

  return "Precio no disponible";
}

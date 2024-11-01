import type { SteamAppData } from "@/steam/types.ts";
import { convertDollarToARS } from "@/currencies/dolarCripto.ts";

export const centsToDollars = (cents: number) =>
  Number((cents / 100).toFixed(2));

export const parsePesosToNumber = (pesos: string) =>
  Number(pesos.replaceAll(",", "."));

const showReleaseDate = (releaseDate: string) =>
  `${releaseDate !== "Coming soon" ? `(${releaseDate})` : ""}`;

const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "decimal",
  currency: "ARS",
});

export async function formatPrice(steamApp: SteamAppData) {
  const { coming_soon, date } = steamApp.release_date;
  if (steamApp.price_overview) {
    const dollarAmount = centsToDollars(steamApp.price_overview.final);
    const dolarCriptoAmount = await convertDollarToARS(dollarAmount);
    return `💲 USD $${dollarAmount} 🧉 ARS $${
      arsFormatter.format(dolarCriptoAmount)
    } ${coming_soon ? showReleaseDate(date) : ""}`;
  }
  if (steamApp.is_free) {
    return `Gratis ${coming_soon ? showReleaseDate(date) : ""}`;
  }
  if (coming_soon) {
    return `Muy Pronto ${showReleaseDate(date)}`;
  }

  return "Precio no disponible";
}

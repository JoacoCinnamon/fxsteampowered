import { Err, Ok, to } from "@/utils/helpers.ts";
import { parsePesosToNumber } from "@/currencies/helpers.ts";

type DolarAmbitoFinancieroAPI = {
  compra: string;
  venta: string;
  valor: string;
  fecha: string;
  variacion: string;
  "class-variacion": string;
  "variacion-nombre": string;
};

// 6/10/24
const DEFAULT_DOLAR_CRIPTO_PRICE = 1220;

export async function getDolarCripto() {
  const [err, res] = await to(
    fetch("https://mercados.ambito.com/dolarcripto/variacion"),
  );
  if (err != null) {
    return Err(err);
  }

  try {
    const dolarCripto = (await res.json()) as DolarAmbitoFinancieroAPI;
    return Ok(dolarCripto);
  } catch (error) {
    if (error instanceof Error) return Err(error);
    return Err(
      new Error("Unknown error while fetching Dolar Cripto", { cause: error }),
    );
  }
}

// TODO: Generic function to accept multiple types of currency/"dolares"
export async function convertDollarToARS(dollarAmount: number) {
  // TODO: Fetch dolar cripto per request?
  const [_err, ambitoFinancieroData] = await getDolarCripto();
  const dolarCriptoAmount = ambitoFinancieroData
    ? parsePesosToNumber(ambitoFinancieroData.venta)
    : DEFAULT_DOLAR_CRIPTO_PRICE;

  return Number((dollarAmount * dolarCriptoAmount).toFixed(2));
}

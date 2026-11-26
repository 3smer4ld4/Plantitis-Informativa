
export function getSafeHttpUrl(
  value: string | null | undefined
): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    const protocolosPermitidos = ["https:", "http:"];

    if (!protocolosPermitidos.includes(url.protocol)) {
      return undefined;
    }

    if (!url.hostname || url.username || url.password) {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

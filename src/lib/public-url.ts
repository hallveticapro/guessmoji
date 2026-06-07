const LOCAL_APP_URL = "http://localhost:3000";

export function getPublicAppUrl(value = process.env.NEXT_PUBLIC_APP_URL): URL {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return new URL(LOCAL_APP_URL);
  }

  try {
    const url = new URL(trimmedValue);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url;
    }
  } catch {
    // Fall through to the safe local default.
  }

  return new URL(LOCAL_APP_URL);
}

export function getPublicAppUrlString(value = process.env.NEXT_PUBLIC_APP_URL) {
  return getPublicAppUrl(value).toString();
}

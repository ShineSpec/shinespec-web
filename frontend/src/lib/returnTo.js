export const getSafeReturnTo = (search, fallback = "/dashboard") => {
  const value = new URLSearchParams(search).get("returnTo");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
};
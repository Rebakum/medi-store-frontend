export const buildAssetUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL || "";
  return `${base}${path}`;
};

import path from "path";
import { CHARACTERS_DIR, BRAND_CONFIG, BRAND_COLORS, BRAND_FONTS } from "../constants";
import { listDirectories, readFileIfExists, scanAssetTree } from "../file-reader";
import { parseJson } from "../parsers/json";
import { CharacterIdentity, BrandConfig, BrandColors, BrandFonts } from "../types/character";
import { AssetNode } from "../file-reader";

export function listCharacterIds(): string[] {
  return listDirectories(CHARACTERS_DIR)
    .filter((d) => d !== "brand" && d !== "environments")
    .sort();
}

export function loadCharacterIdentity(
  characterId: string
): CharacterIdentity | null {
  const raw = readFileIfExists(
    path.join(CHARACTERS_DIR, characterId, "identity.json")
  );
  return parseJson<CharacterIdentity>(raw);
}

export function loadCharacterReferenceImages(
  characterId: string
): AssetNode[] {
  const stylesDir = path.join(CHARACTERS_DIR, characterId, "styles");
  return scanAssetTree(stylesDir);
}

export interface CharacterSummary {
  id: string;
  identity: CharacterIdentity | null;
  hasReferences: boolean;
}

export function listCharactersWithIdentity(): CharacterSummary[] {
  return listCharacterIds().map((id) => {
    const identity = loadCharacterIdentity(id);
    const refs = loadCharacterReferenceImages(id);
    return {
      id,
      identity,
      hasReferences: refs.length > 0,
    };
  });
}

export function loadBrandConfig(): BrandConfig | null {
  const raw = readFileIfExists(BRAND_CONFIG);
  return parseJson<BrandConfig>(raw);
}

export function loadBrandColors(): BrandColors | null {
  const raw = readFileIfExists(BRAND_COLORS);
  return parseJson<BrandColors>(raw);
}

export function loadBrandFonts(): BrandFonts | null {
  const raw = readFileIfExists(BRAND_FONTS);
  return parseJson<BrandFonts>(raw);
}

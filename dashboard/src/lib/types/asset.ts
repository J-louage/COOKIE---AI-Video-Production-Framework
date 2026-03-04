export interface AssetFile {
  name: string;
  path: string;
  relativePath: string;
  type: "file" | "directory";
  extension?: string;
  size?: number;
  children?: AssetFile[];
}

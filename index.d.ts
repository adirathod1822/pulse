// index.d.ts
export function testPing(
  url?: string,
  count?: number,
  host?: string,
  ip?: string
): Promise<{
  ping: number;
}>;

export function testDownload(options?: {
  durationSeconds?: number;
  url?: string;
  onProgress?: (speedMbps: string) => void;
}): Promise<string>;

export function testUpload(options?: {
  durationSeconds?: number;
  url?: string;
  onProgress?: (speedMbps: string) => void;
}): Promise<string>;
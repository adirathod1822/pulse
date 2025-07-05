// index.js for @onlyrex/pulse (v1.1.2)

const DEFAULT_DOWNLOAD_URL = 'https://speed.cloudflare.com/__down?bytes=100000000';
const DEFAULT_UPLOAD_URL = 'https://httpbin.org/post';
const DEFAULT_PING_URL = 'https://www.cloudflare.com/cdn-cgi/trace';

export async function testPing(url = DEFAULT_PING_URL, count = 5) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    const start = performance.now();
    await fetch(url, { method: 'HEAD', cache: 'no-store' });
    const end = performance.now();
    total += end - start;
  }
  return (total / count).toFixed(2); // ms
}

export async function testDownload({
  durationSeconds = 15,
  url = DEFAULT_DOWNLOAD_URL,
  onProgress = null,
} = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  const startTime = performance.now();
  let bytesReceived = 0;

  const fetchChunk = async () => {
    const res = await fetch(url, { signal, cache: 'no-store' });
    const reader = res.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesReceived += value.length;
    }
  };

  const interval = setInterval(() => {
    const elapsed = (performance.now() - startTime) / 1000;
    const mbps = ((bytesReceived * 8) / elapsed / 1_000_000).toFixed(2);
    if (onProgress) onProgress(mbps);
  }, 200);

  const downloads = Array.from({ length: 8 }, fetchChunk);

  // Set timeout that triggers controller.abort()
  setTimeout(() => controller.abort(), durationSeconds * 1000);

  try {
    await Promise.allSettled(downloads);
  } catch (_) {
    // No-op; fetch errors are expected on abort
  } finally {
    clearInterval(interval);
  }

  const totalTime = (performance.now() - startTime) / 1000;
  return ((bytesReceived * 8) / totalTime / 1_000_000).toFixed(2);
}

export async function testUpload({
  sizeMB = 10,
  url = DEFAULT_UPLOAD_URL,
  onProgress = null,
} = {}) {
  const data = new Uint8Array(sizeMB * 1024 * 1024);
  const startTime = performance.now();
  let uploaded = 0;

  const controller = new AbortController();
  const signal = controller.signal;

  const stream = new ReadableStream({
    start(controller) {
      const chunkSize = 64 * 1024;
      let sent = 0;
      const interval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        if (onProgress) {
          const mbps = ((uploaded * 8) / elapsed / 1_000_000).toFixed(2);
          onProgress(mbps);
        }
      }, 200);

      function push() {
        if (sent >= data.length) {
          clearInterval(interval);
          controller.close();
          return;
        }
        const chunk = data.subarray(sent, sent + chunkSize);
        sent += chunk.length;
        uploaded += chunk.length;
        controller.enqueue(chunk);
        setTimeout(push, 0);
      }

      push();
    },
  });

  try {
    await fetch(url, {
      method: 'POST',
      body: stream,
      headers: { 'Content-Type': 'application/octet-stream' },
      signal,
    });
  } catch (_) {
    // Allow errors (e.g., abort)
  }

  const totalTime = (performance.now() - startTime) / 1000;
  return ((uploaded * 8) / totalTime / 1_000_000).toFixed(2);
}

export async function runSpeedTest(options = {}) {
  const ping = await testPing();
  const download = await testDownload(options);
  const upload = await testUpload(options);
  return { ping, download, upload };
}
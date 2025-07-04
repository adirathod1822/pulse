export async function testPing(url = 'https://www.cloudflare.com/cdn-cgi/trace', count = 5) {
  let totalPing = 0;
  for (let i = 0; i < count; i++) {
    const t0 = performance.now();
    await fetch(url, { method: 'HEAD', cache: 'no-store' });
    const t1 = performance.now();
    totalPing += t1 - t0;
  }
  return (totalPing / count).toFixed(2); // ms
}

export async function testDownload({
  url = 'https://speed.cloudflare.com/__down?bytes=100000000',
  durationSeconds = 10
} = {}) {
  let bytesDownloaded = 0;
  const startTime = performance.now();
  const controller = new AbortController();
  setTimeout(() => controller.abort(), durationSeconds * 1000);

  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    const reader = res.body.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (value) bytesDownloaded += value.length;
      if (done) break;

      const elapsed = (performance.now() - startTime) / 1000;
      if (elapsed >= durationSeconds) break;
    }
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }

  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000;
  const speedMbps = ((bytesDownloaded * 8) / duration / 1000000).toFixed(2);
  return speedMbps;
}

export async function testUpload({
  url = 'https://httpbin.org/post',
  sizeMB = 10
} = {}) {
  const uploadSize = sizeMB * 1024 * 1024;
  const uploadData = new Uint8Array(uploadSize); 
  const uploadStart = performance.now();
  await fetch(url, {
    method: 'POST',
    body: uploadData,
    cache: 'no-store'
  });
  const uploadEnd = performance.now();
  const duration = (uploadEnd - uploadStart) / 1000;
  const speedMbps = ((uploadSize * 8) / duration / 1000000).toFixed(2);
  return speedMbps;
}

export async function runSpeedTest() {
  const ping = await testPing();
  const download = await testDownload();
  const upload = await testUpload();
  return { ping, download, upload };
}

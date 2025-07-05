<h1 align="center">⚡ Pulse — @onlyrex/pulse</h1>

<p align="center">
  <b>Blazing-fast internet speed tester for modern browsers — no dependencies, fully stream-based, developer-friendly.</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@onlyrex/pulse">
    <img alt="npm version" src="https://img.shields.io/npm/v/@onlyrex/pulse?color=lime&style=flat-square">
  </a>
  <a href="https://github.com/adirathod1822/pulse/stargazers">
    <img alt="stars" src="https://img.shields.io/github/stars/adirathod1822/pulse?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@onlyrex/pulse">
    <img alt="downloads" src="https://img.shields.io/npm/dt/@onlyrex/pulse?style=flat-square">
  </a>
  <a href="https://github.com/adirathod1822/pulse/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@onlyrex/pulse?style=flat-square">
  </a>
</p>

---

## 🚀 What is Pulse?

**Pulse** is a modern internet speed test tool for web apps. Inspired by tools like [Fast.com](https://fast.com), it uses **parallel fetch streams**, **live speed updates**, and **no external dependencies** to measure your actual network bandwidth directly from the browser.

Built for:
- [React ⚛️](#React)
- [Angular 🅰️](#Angular)
- [Vanilla JS 🌐](#Vanilla-JS)

---

## 🧠 How It Works

Pulse runs the test in 3 stages:

1. **Ping Test**: Sends multiple `HEAD` requests to a server to calculate average response time (latency).
2. **Download Test**: Fires 8 parallel `fetch()` streams to download random data, calculating the bitrate in real time.
3. **Upload Test**: Generates a binary blob and uploads it to a public endpoint (like `httpbin.org`) to simulate an upload session.

Everything runs **client-side only** — no backend needed.

---

## 🧠 Summary

| Method                         | Shows Live Progress? | Final Result? |
| ------------------------------ | -------------------- | ------------- |
| `runSpeedTest()`               | ❌ No                 | ✅ Yes         |
| `testPing()`                   | ❌ No                 | ✅ Yes         |
| `testDownload({ onProgress })` | ✅ Yes                | ✅ Yes         |
| `testUpload({ onProgress })`   | ✅ Yes                | ✅ Yes         |

---



* Runs all 3 tests and returns the final results.


---

## 📦 Installation

```bash
npm install @onlyrex/pulse
```
---
# 📘 API Reference

## Vanilla JS
### `runSpeedTest(options?) → Promise<{ ping, download, upload }>`

- Runs all 3 tests — `ping`, `download`, and `upload` — and returns final results.
- It internally calls **testPing**, **testDownload**, and **testUpload** without exposing their real-time progress.

```js
import { runSpeedTest } from '@onlyrex/pulse';

const result = await runSpeedTest();
console.log(result);

// result → { ping: "16.87", download: "74.21", upload: "9.45" }
```
Unless you want real-time progress you have to pass a *callback* like onProgress to **testDownload()** or **testUpload()**

### `testPing(url?: string, count?: number): Promise<string>`
- Measures average latency using multiple HEAD requests.
- url: Optional ping target (default: google.com)
- count: Number of ping attempts (default: 5)

### `testDownload({ durationSeconds = 15, url, onProgress }): Promise<string>`
- Performs 8 parallel fetches and measures speed.
- durationSeconds: Duration in seconds (default: 15 Seconds)
- url: Optional download target
- onProgress: Callback for live Mbps updates

### `testUpload({ sizeMB = 10, url, onProgress }): Promise<string>`
- Streams binary data via POST to test upload bandwidth.
- sizeMB: File size in MB
- url: Upload endpoint
- onProgress: Callback for live Mbps updates

```js
import { testPing, testDownload, testUpload } from '@onlyrex/pulse';

(async () => {
  const ping = await testPing();
  console.log(`Ping: ${ping} ms`);

  const download = await testDownload({
    onProgress: (mbps) => console.log(`Download: ${mbps} Mbps`),
  });

  console.log(`Final Download: ${download} Mbps`);

  const upload = await testUpload({
    onProgress: (mbps) => console.log(`Upload: ${mbps} Mbps`),
  });

  console.log(`Final Upload: ${upload} Mbps`);
})();

```

# Angular
## 🔧 pulse-comp.component.ts
```ts
import { Component } from '@angular/core';
import { testDownload, testPing, testUpload } from '@onlyrex/pulse'
@Component({
  selector: 'app-pulse',
  imports: [],
  templateUrl: './pulse.html',
  styleUrl: './pulse.css'
})
export class Pulse {
  ping: any = 0.00;
  download: string = '0.00';
  upload: string = '0.00';
  loading: boolean = false;

  async runTest() {
    this.loading = true;

    try {
      const pingResult = await testPing();
      console.log('pingResult.ping====>', pingResult)
      this.ping = pingResult;

      this.download = '0.00';
      await testDownload({
        durationSeconds: 10,
        onProgress: (mbps: string) => {
          this.download = parseFloat(mbps).toFixed(2);
        },
      });

      this.upload = '0.00';
      await testUpload({
        onProgress: (mbps: string) => {
          this.upload = parseFloat(mbps).toFixed(2);
        },
      });

    } catch (error) {
      console.error('Speed test failed:', error);
      this.ping = this.download = this.upload = 'Error';
    } finally {
      this.loading = false;
    }
  }
}

```




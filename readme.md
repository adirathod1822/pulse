<h1 align="center">⚡ Pulse — @rex/pulse</h1>

<p align="center">
  <b>Blazing-fast internet speed tester for modern browsers — no dependencies, fully stream-based, developer-friendly.</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@rex/pulse">
    <img alt="npm version" src="https://img.shields.io/npm/v/@rex/pulse?color=lime&style=flat-square">
  </a>
  <a href="https://github.com/adirathod1822/pulse/stargazers">
    <img alt="stars" src="https://img.shields.io/github/stars/adirathod1822/pulse?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@rex/pulse">
    <img alt="downloads" src="https://img.shields.io/npm/dt/@rex/pulse?style=flat-square">
  </a>
  <a href="https://github.com/adirathod1822/pulse/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@rex/pulse?style=flat-square">
  </a>
</p>

---

## 🚀 What is Pulse?

**Pulse** is a modern internet speed test tool for web apps. Inspired by tools like [Fast.com](https://fast.com), it uses **parallel fetch streams**, **live speed updates**, and **no external dependencies** to measure your actual network bandwidth directly from the browser.

Built for:
- React ⚛️
- Angular 🅰️
- Next.js 🔼
- Vanilla JS 🌐

---

## 🧠 How It Works

Pulse runs the test in 3 stages:

1. **Ping Test**: Sends multiple `HEAD` requests to a server to calculate average response time (latency).
2. **Download Test**: Fires 8 parallel `fetch()` streams to download random data, calculating the bitrate in real time.
3. **Upload Test**: Generates a binary blob and uploads it to a public endpoint (like `httpbin.org`) to simulate an upload session.

Everything runs **client-side only** — no backend needed.

---

## 📦 Installation

```bash
npm install @rex/pulse

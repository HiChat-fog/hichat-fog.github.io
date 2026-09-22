---
layout: about
title: about
permalink: /
nav: false
subtitle: eBPF · Linux 内核 · RISC-V

profile:
  align: right
  image: avatar.jpg
  image_circular: true
  more_info: >
    <p><i class="fab fa-github"></i> <a href="https://github.com/HiChat-fog">GitHub · HiChat-fog</a></p>
    <p><i class="fas fa-music"></i> <a href="https://music.163.com/#/user/home?id=6403910902">我的网易云音乐</a></p>

selected_papers: false
social: false

announcements:
  enabled: false
latest_posts:
  enabled: false
---

你好,我是 **HiChat-fog** 👋,一枚喜欢折腾底层系统的学生开发者。

- 🔧 日常折腾 **eBPF / Linux 内核 / RISC-V**,习惯在 QEMU 里把系统点起来做实验
- 🌱 正在学 **Rust + aya**,想让 eBPF 程序写得更优雅
- 🤝 给 [aya](https://github.com/aya-rs/aya) 提过 issue、贡献过小改动,欢迎交流 eBPF / 内核观测话题

## 🎧 正在听

<a href="https://music.163.com/#/user/home?id=6403910902" target="_blank" rel="noopener">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/HiChat-fog/netease-cloud-music-card@main/music-now-dark.svg" />
    <img src="https://cdn.jsdelivr.net/gh/HiChat-fog/netease-cloud-music-card@main/music-now-light.svg" alt="正在单曲循环" width="470" />
  </picture>
</a>

*右下角的唱片就是本站 BGM,放的就是这首歌 —— 浏览器禁止自动播放,首次点击页面任意位置即可开始。*

本站基于开源模板 [al-folio](https://github.com/alshedivat/al-folio)(16k★)定制,源码在 [GitHub](https://github.com/HiChat-fog/hichat-fog.github.io/tree/source) 上,全自动构建部署。

<!-- BGM 悬浮唱片 -->
<div id="bgm-widget" style="position:fixed;right:16px;bottom:52px;z-index:9999;display:flex;flex-direction:column;align-items:center;gap:4px;">
  <button id="bgm-btn" aria-label="播放/暂停背景音乐" style="all:unset;cursor:pointer;display:block;line-height:0;">
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22.5" fill="#141419" stroke="#F724A9" stroke-width="1.5"/>
      <g class="vinyl-disc">
        <circle cx="24" cy="24" r="15" fill="none" stroke="#3a3a44" stroke-width="1"/>
        <circle cx="24" cy="24" r="6.5" fill="#F724A9"/>
        <circle cx="24" cy="24" r="1.8" fill="#141419"/>
        <path d="M9 18 A17 17 0 0 1 16 9.5" stroke="#F724A9" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
      </g>
    </svg>
  </button>
  <span id="bgm-tip" style="font-size:11px;color:#8B949E;background:rgba(13,17,23,.75);padding:2px 8px;border-radius:8px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">BGM 加载中…</span>
</div>
<style>
  @keyframes bgm-spin { to { transform: rotate(360deg); } }
  .vinyl-disc { transform-origin: 24px 24px; animation: bgm-spin 3.2s linear infinite; animation-play-state: paused; }
  #bgm-btn.playing .vinyl-disc { animation-play-state: running; }
</style>
<audio id="bgm-audio" loop preload="none"></audio>
<script>
(function () {
  var audio = document.getElementById('bgm-audio');
  var btn = document.getElementById('bgm-btn');
  var tip = document.getElementById('bgm-tip');
  var interacted = false;
  fetch('https://cdn.jsdelivr.net/gh/HiChat-fog/netease-cloud-music-card@main/now-playing.json?ts=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (s) {
      audio.src = 'https://music.163.com/song/media/outer/url?id=' + s.id + '.mp3';
      audio.volume = 0.4;
      tip.textContent = '♪ ' + s.name;
      if (interacted) tryPlay();
    })
    .catch(function () { tip.textContent = 'BGM 未加载'; });
  function mark() { btn.classList.toggle('playing', !audio.paused); }
  audio.addEventListener('play', mark);
  audio.addEventListener('pause', mark);
  audio.addEventListener('error', function () { tip.textContent = 'BGM 暂不可用'; btn.style.opacity = '0.45'; });
  function tryPlay() { var p = audio.play(); if (p) p.catch(function () {}); }
  function kick() { interacted = true; tryPlay(); cleanup(); }
  function cleanup() {
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) { window.removeEventListener(e, kick); });
  }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) {
    window.addEventListener(e, kick, { once: true, passive: true });
  });
  btn.addEventListener('click', function (ev) {
    ev.stopPropagation();
    if (audio.paused) { tryPlay(); } else { audio.pause(); }
  });
  tryPlay();
})();
</script>

---
layout: page
title: 在听的专辑
permalink: /albums/
nav: true
nav_order: 4
description: 我经常听的专辑,来自网易云播放记录,定时自动更新。
---

## 🎧 本周最常听

<div class="row" id="album-grid">
  <div class="col-12"><p class="text-muted">正在从网易云同步本周播放数据…</p></div>
</div>

## 🏛️ 历史最爱 · Top 5

<div class="row" id="album-history-grid">
  <div class="col-12"><p class="text-muted">正在同步历史数据…</p></div>
</div>

<p class="text-muted" style="font-size:0.85rem;">来自网易云播放记录,定时自动刷新。</p>

<script>
(function () {
  // 直接从 GitHub API 读取已提交的数据,绕开 jsdelivr/raw 的缓存层,所见即所提交
  var API = 'https://api.github.com/repos/HiChat-fog/netease-cloud-music-card/contents/';
  function decodeB64(b64) {
    var bin = atob(b64.replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }
  function load(file) {
    return fetch(API + file, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { return JSON.parse(decodeB64(j.content)); });
  }
  function card(a, showCount) {
    return '<div class="col-sm-6 col-md-3 mt-3 mb-3">'
      + '<div class="card h-100" style="border:none;background:transparent;">'
      + '<a href="https://music.163.com/#/album?id=' + a.id + '" target="_blank" rel="noopener">'
      + '<img src="' + a.pic + '" class="card-img-top rounded shadow-sm" alt="' + String(a.name).replace(/"/g, '') + '" loading="lazy">'
      + '</a>'
      + '<div class="card-body px-0">'
      + '<h6 class="mb-1"><strong>' + a.name + '</strong></h6>'
      + '<p class="text-muted" style="font-size:0.85rem;margin-bottom:2px;">' + a.artist + '</p>'
      + (showCount ? '<p class="text-muted" style="font-size:0.8rem;margin-bottom:0;">本周播放 ' + a.count + ' 次</p>' : '')
      + '</div></div></div>';
  }
  function render(gridId, albums, showCount) {
    var grid = document.getElementById(gridId);
    if (!Array.isArray(albums) || !albums.length) {
      grid.innerHTML = '<div class="col-12"><p class="text-muted">暂无可展示的专辑。</p></div>';
      return;
    }
    grid.innerHTML = albums.map(function (a) { return card(a, showCount); }).join('');
  }
  function fail(gridId) {
    document.getElementById(gridId).innerHTML = '<div class="col-12"><p class="text-muted">播放数据暂时没加载出来,稍后再来看看。</p></div>';
  }
  load('top-albums.json')
    .then(function (d) { render('album-grid', d, true); })
    .catch(function () { fail('album-grid'); });
  load('top-albums-history.json')
    .then(function (d) { render('album-history-grid', d, false); })
    .catch(function () { fail('album-history-grid'); });
})();
</script>

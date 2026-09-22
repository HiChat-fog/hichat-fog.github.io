---
layout: page
title: 在听的专辑
permalink: /albums/
nav: false
description: 我最近经常听的专辑(不含华语),来自网易云本周播放记录,定时自动更新。
---

## 🎧 网易云 · 本周最常听

<div class="row" id="album-grid">
  <div class="col-12"><p class="text-muted">正在从网易云同步本周播放数据…</p></div>
</div>

<p class="text-muted" style="font-size:0.85rem;">按本周播放次数聚合,每小时自动刷新;华语专辑不收录。</p>

<script>
(function () {
  var grid = document.getElementById('album-grid');
  fetch('https://cdn.jsdelivr.net/gh/HiChat-fog/netease-cloud-music-card@main/top-albums.json?ts=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (albums) {
      if (!Array.isArray(albums) || !albums.length) {
        grid.innerHTML = '<div class="col-12"><p class="text-muted">本周还没有可展示的专辑。</p></div>';
        return;
      }
      grid.innerHTML = albums.map(function (a, i) {
        return '<div class="col-sm-6 col-md-3 mt-3 mb-3">'
          + '<div class="card h-100" style="border:none;background:transparent;">'
          + '<a href="https://music.163.com/#/album?id=' + a.id + '" target="_blank" rel="noopener">'
          + '<img src="' + a.pic + '" class="card-img-top rounded shadow-sm" alt="' + a.name.replace(/"/g, '') + '" loading="lazy">'
          + '</a>'
          + '<div class="card-body px-0">'
          + '<h6 class="mb-1"><strong>' + a.name + '</strong></h6>'
          + '<p class="text-muted" style="font-size:0.85rem;margin-bottom:2px;">' + a.artist + '</p>'
          + '<p class="text-muted" style="font-size:0.8rem;margin-bottom:0;">本周播放 ' + a.count + ' 次</p>'
          + '</div></div></div>';
      }).join('');
    })
    .catch(function () {
      grid.innerHTML = '<div class="col-12"><p class="text-muted">播放数据暂时没加载出来,稍后再来看看。</p></div>';
    });
})();
</script>

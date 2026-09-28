/* All measurements are generated from the frozen conditions.csv, not entered by hand. */
(() => {
  'use strict';
  const data = window.M3VGT_DATA;
  const $ = (id) => document.getElementById(id);
  const input = $('input-video');
  const robot = $('robot-video');
  const state = { animal: 'cat', seed: '0', condition: 'M', playing: false, operation: 0 };
  const descriptions = {
    S: 'Static shape selects the layout; all rods use the common fixed-stroke rule.',
    F: 'The S body is unchanged. Only actuator travel is adapted to the target motion.',
    M: 'Motion-informed layout selection with the same stroke adaptation available to F.',
  };
  const icons = () => window.lucide?.createIcons();
  const pool = () => `${state.animal}_seed${state.seed}`;
  const row = () => data.find((item) => item.pool === pool() && item.condition === state.condition);
  const f = (value) => Number(value).toFixed(2);

  function renderTable(name) {
    const entries = data.filter((item) => item.pool === name);
    $('result-rows').replaceChildren(...entries.map((item) => {
      const tr = document.createElement('tr');
      tr.dataset.method = item.condition;
      const values = [item.condition, `${f(Number(item.shape_f1) * 100)}%`, f(item.P_T_mm), f(item.X_T_mm), f(item.X_O_mm)];
      values.forEach((value) => { const td = document.createElement('td'); td.textContent = value; tr.append(td); });
      return tr;
    }));
  }

  function playbackLabel() {
    $('play-together').innerHTML = `<i data-lucide="${state.playing ? 'pause' : 'play'}" aria-hidden="true"></i><span>${state.playing ? 'Pause together' : 'Play together'}</span>`;
    icons();
  }

  function pause() {
    state.operation += 1;
    state.playing = false;
    input.pause(); robot.pause(); playbackLabel();
  }

  function update(resetInput = false) {
    pause();
    const item = row();
    $('media-status').textContent = '';
    if (resetInput) {
      input.src = `assets/videos/${state.animal}-input.mp4`;
      input.poster = `assets/images/${state.animal}-input.webp`;
      input.load();
    } else { input.currentTime = 0; }
    robot.src = `assets/videos/${pool()}-${state.condition}-clean.mp4`;
    robot.poster = `assets/images/${pool()}-${state.condition}-clean.webp`;
    robot.load();
    $('design-description').textContent = descriptions[state.condition];
    const animal = state.animal[0].toUpperCase() + state.animal.slice(1);
    $('input-caption').textContent = `${animal}, ${f(item.duration_s)} s motion target`;
    $('metric-shape').innerHTML = `${f(Number(item.shape_f1) * 100)}<span>%</span>`;
    $('metric-projection').innerHTML = `${f(item.P_T_mm)} <span>mm</span>`;
    $('metric-execution').innerHTML = `${f(item.X_T_mm)} <span>mm</span>`;
    $('seed-control').hidden = state.animal !== 'cat';
    $('demo-panel').setAttribute('aria-labelledby', `${state.animal}-tab`);
    document.querySelectorAll('[data-animal]').forEach((button) => {
      const selected = button.dataset.animal === state.animal;
      button.setAttribute('aria-selected', selected); button.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll('[data-condition]').forEach((button) => button.setAttribute('aria-pressed', button.dataset.condition === state.condition));
    $('results-pool').value = pool(); renderTable(pool());
  }

  document.querySelectorAll('[data-animal]').forEach((button) => {
    button.addEventListener('click', () => { state.animal = button.dataset.animal; state.seed = state.animal === 'cat' ? $('seed').value : '0'; update(true); });
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const buttons = Array.from(document.querySelectorAll('[data-animal]'));
      let index = buttons.indexOf(button);
      index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[index].focus(); buttons[index].click();
    });
  });
  document.querySelectorAll('[data-condition]').forEach((button) => button.addEventListener('click', () => { state.condition = button.dataset.condition; update(); }));
  $('seed').addEventListener('change', () => { state.seed = $('seed').value; update(); });
  $('results-pool').addEventListener('change', () => renderTable($('results-pool').value));
  $('play-together').addEventListener('click', async () => {
    if (state.playing || !input.paused || !robot.paused) { pause(); return; }
    const operation = ++state.operation;
    $('media-status').textContent = '';
    if (input.ended || robot.ended) { input.currentTime = 0; robot.currentTime = 0; }
    else { input.currentTime = robot.currentTime; }
    $('play-together').disabled = true;
    try {
      await Promise.all([input.play(), robot.play()]);
      if (operation !== state.operation) return;
      state.playing = true; playbackLabel();
    } catch (error) {
      if (operation === state.operation) {
        pause(); $('media-status').textContent = 'Playback could not start. The individual video controls remain available.';
      }
    } finally { $('play-together').disabled = false; }
  });
  $('restart').addEventListener('click', () => { pause(); input.currentTime = 0; robot.currentTime = 0; });
  robot.addEventListener('timeupdate', () => {
    if (state.playing && !input.seeking && !robot.seeking && Math.abs(input.currentTime - robot.currentTime) > 0.15) input.currentTime = robot.currentTime;
  });
  for (const video of [input, robot]) {
    video.addEventListener('ended', () => { if (state.playing) pause(); });
    video.addEventListener('pause', () => { if (state.playing) pause(); });
    video.addEventListener('error', () => { pause(); $('media-status').textContent = 'A video could not be loaded. Keep the assets folder beside index.html.'; });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

  const dialog = $('figure-dialog');
  document.querySelectorAll('[data-zoom]').forEach((button) => button.addEventListener('click', () => {
    $('enlarged-figure').src = button.dataset.zoom;
    $('enlarged-figure').alt = button.dataset.caption;
    $('figure-caption').textContent = button.dataset.caption;
    dialog.showModal();
  }));
  $('close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) document.querySelectorAll('nav a').forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`)); });
    }, { rootMargin: '-10% 0px -65% 0px' });
    sections.forEach((section) => observer.observe(section));
  }
  renderTable('cat_seed0'); icons();
})();

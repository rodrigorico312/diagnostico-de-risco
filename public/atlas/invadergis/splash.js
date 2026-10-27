/**
 * splash.js — boot-splash controller for InvaderGIS.
 *
 * Loaded as an EXTERNAL script (not inline) so the strict Content-Security-Policy
 * `script-src 'self'` allows it — an inline <script> would be blocked by that CSP,
 * which previously left the splash stuck (the ready signals were never defined).
 *
 * Defines window.__splashRecordsReady() and window.__splashMapReady(); the splash
 * hides once BOTH have fired (or after a 20s safety valve). Called from main.tsx
 * (records) and useMapLifecycle/RootErrorBoundary (map / error paths).
 */
(function () {
  var splash = document.getElementById('app-splash');
  var status = document.getElementById('app-splash__status');
  var fill = document.getElementById('app-splash__fill');
  if (!splash) return;

  var recordsDone = false;
  var mapDone = false;

  function setStatus(msg) {
    if (status) status.textContent = msg;
  }
  function setProgress(pct) {
    if (fill) fill.style.width = pct + '%';
  }

  var safetyTimer = setTimeout(function () {
    splash.classList.add('is-hiding');
    setTimeout(function () { if (splash.parentNode) splash.remove(); }, 420);
  }, 20000);

  function tryHide() {
    if (!recordsDone || !mapDone) return;
    clearTimeout(safetyTimer);
    setStatus('Ready');
    setProgress(100);
    setTimeout(function () {
      splash.classList.add('is-hiding');
      setTimeout(function () { if (splash.parentNode) splash.remove(); }, 420);
    }, 300);
  }

  // Signal 1: records fetched (called from main.tsx after initDataset resolves).
  window.__splashRecordsReady = function () {
    recordsDone = true;
    setProgress(50);
    setStatus('Initialising map…');
    tryHide();
  };

  // Signal 2: map painted (called from useMapLifecycle on ready/error paths).
  window.__splashMapReady = function () {
    mapDone = true;
    setProgress(mapDone && recordsDone ? 100 : 75);
    tryHide();
  };

  // Animate the bar while records load.
  setTimeout(function () { setProgress(20); }, 100);
  setTimeout(function () { setProgress(38); }, 800);
})();

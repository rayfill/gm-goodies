'use strict';

function delay(func, delayTime) {

  let time = delayTime === undefined ? 0 : delayTime;
  let id = setTimeout(func, delayTime);
  return () => { clearTimeout(id); };
}

function domContentLoaded(func) {
  let p = new Promise((resolve) => {
    console.log("DCL", document.readyState);

    if (document.readyState !== "loading") {
      return resolve();
    }
    document.addEventListener('DOMContentLoaded', () => {
      resolve();
    });
  });
  if (typeof func === "function") {
    return p.then(func);
  }
  return p;
}

self.delay = delay;
self.domContentLoaded = domContentLoaded;

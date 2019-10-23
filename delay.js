'use strict';

function delay(func, delayTime) {
  
  let time = delayTime === undefined ? 0 : delayTime;
  let id = setTimeout(func, delayTime);
  return () => { clearTimeout(id); };
}

self.delay = delay;

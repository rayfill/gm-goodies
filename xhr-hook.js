function xhrHook2(hook) {
  window.addEventListener('message', (ev) => {
    let { type: type, responseType: resType, url: url, content: content } = ev.data;
    if (type === "trap") {
      hook(url, resType, content);
    }
  });

  function trap() {
    const origSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
      const xhr = this;
      const args = Array.from(arguments);
      const callback = () => {
        window.postMessage({
          type: "trap",
	  responseType: xhr.responseType,
          url: xhr.responseURL,
          content: xhr.response
        }, "*");
        xhr.removeEventListener("load", callback);
      };
      xhr.addEventListener("load", callback);

      return origSend.apply(xhr, args);
    };
  }

  let scr = document.createElement("script");
  scr.text = "(" + trap.toString() + ")();";
  unsafeWindow.document.documentElement.appendChild(scr);
}

function xhrHook(hook) {
  const xmlhttpRequest = unsafeWindow.XMLHttpRequest;

  let methodHook = {
    get: (xhr, prop, proxy) => {
      let funcOrValue = xhr[prop];

      if (typeof funcOrValue === "function") {
        if (prop === "send") {

          return (...args) => {
            let savedOnload = xhr.onload;
	    
            xhr.onload = (...args) => {
              hook.apply(hook, [xhr].concat(args));
              xhr.onload = savedOnload;

              if (typeof savedOnload === "function") {
                return savedOnload.apply(xhr, args);
              }
            };
	    
            xhr.send.apply(xhr, args);
          }
        }
	
        return (...args) => {
          let result = xhr[prop].apply(xhr, args);
          return result;
        };
      }
      return funcOrValue;
    },

    set: (xhr, prop, value, proxy) => {
      xhr[prop] = value;
      return true;
    }
  };

  let constructorHook = {
    construct: () => {
      return new Proxy(new xmlhttpRequest(), methodHook);
    }
  };

  unsafeWindow.XMLHttpRequest = new Proxy(xmlhttpRequest, constructorHook);
}
self.xhrHook = xhrHook;
self.xhrHook2 = xhrHook2;

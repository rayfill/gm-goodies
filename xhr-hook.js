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

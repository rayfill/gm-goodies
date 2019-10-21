'use strict';

let proxy = null;


(() => {
  function genTrap(options) {
    return (name) => {
      if (name in options) {
	return options[name];
      }
      return null;
    }
  };
  
  const instanceHandler = (gettrap, settrap) => {
    gettrap = gettrap != null ? gettrap : () => { return null };
    settrap = settrap != null ? settrap : () => { return null };

    return {
      get: (target, prop, receiver) => {

	let trapFunc = gettrap(prop);
	if (trapFunc != null) {
	  return trapFunc(receiver, target, prop, undefined);
	}
	
	let val = target[prop];
	if (typeof val === "function") {
	  return (...args) => {
	    return val.apply(target, args);
	  }
	}
	return val;
      },

      set: (target, prop, value, receiver) => {

	let trapFunc = settrap(prop);
	if (trapFunc != null) {
	  trapFunc(receiver, target, prop, value);
	  return;
	}
	target[prop] = value;
      }
    }
  };

  const constructHandler = (gettrap, settrap) => {
    return {
      construct: (target, args) => {
	let instance = new (target.bind.apply(target, args));
	return new Proxy(instance, instanceHandler(gettrap, settrap));
      }
    }
  };

  proxy = (clazz, gettrap, settrap) => {
    return new Proxy(clazz, constructHandler(gettrap, settrap));
  };
})();

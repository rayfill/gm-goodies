'use strict';

let TrapClass = null;
(() => {
    const instanceHandler = (traps, trapCheck) => {

	return {
            get: (target, prop, receiver) => {
		let value = target[prop];
                let offset = trapCheck(prop);
		
		if (typeof value === "function") {
		    const func = value;
		    
                    if (offset >= 0) {
			return (...args) => {
                            return traps(offset)(proxy, target, func, args);
			}
                    }
		    
                    return (...args) => {
			return func.apply(target, args);
                    }
		} else if (offset >= 0) {
		    return traps(offset)(proxy, value);
		}
		return value;
            },

            set: (target, prop, value) => {
		let offset = trapCheck(prop);
		if (offset >= 0) {
		    traps(offset)(proxy, target, prop, value);
		} else {
		    target[prop] = value;
		}
            }
	}
    };

    const constructHandler = (traps, trapCheck) => {
	return {
            construct: (target, args) => {
		let instance = new (target.bind.apply(target, args));
		return new Proxy(instance, instanceHandler(traps, trapCheck));
            }
	}
    };

    TrapClass = (clazz, traps, trapCheck) => {
	return new Proxy(class, constructHandler(traps, trapCheck));
    };
})();

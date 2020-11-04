
export class Helpers {
    
    private hasOwnProperty = Object.prototype.hasOwnProperty;
    private toString       = Object.prototype.toString;
    private toLocaleString = Object.prototype.toLocaleString;
    
    public hasProperty(o : any, property: any) {
        return this.hasOwnProperty.call(o, property);
    }
    
    toSstring (o: any) {
        return this.toString.call(o);
    }
    
    isString(str : any) : boolean {
		return this.toString.call(str) === "[object String]";
	}
	
    isArray(arr : any[]) : boolean {
        return this.toString.call(arr) === "[object Array]";   
    }
    
    isObject(obj : any) : boolean {
        return obj !== null && typeof obj === 'object';
    }
    
    isDate(obj : any) : boolean {
        return this.toString.call(obj) === ["object Date"]; 
    }
    
    isNumber(num: any): boolean {
        return typeof num === 'number';
    }
    
    isBoolean(bool: any) : boolean {
        return typeof bool === 'boolean';
    }
    
	isUndefined(obj : any) : boolean {
		return typeof(obj) === 'undefined';
	}

    isDefined(obj: any) : boolean {
        return !this.isUndefined(obj);
    }
		
	isFunction(func : any) : boolean {
		return typeof(func) === 'function';
	}	
}
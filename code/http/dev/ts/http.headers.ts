import { IDictionary, IDictionaryPair, Dictionary }  from '../../../collections/dev/ts/dictionary';
import {Helpers} from '../../../common/dev/ts/utils';

const helper = new Helpers();

/**
 * HttpHeader
 */
export class HttpHeaders {

    private headers: IDictionary<string, string>;

    constructor(headers?: Dictionary<string, string>) {
        this.headers = this.isDictionary(headers) ? headers : new Dictionary<string, string>();
    };

    addHeader(key: string, value: string): void {
        if (helper.isDefined(key) && helper.isDefined(value)) {
            this.headers.setValue(key, value);    
        }
    }

    removeHeader(key: string): void {
        if (helper.isDefined(key) && this.headers.contains(key)) {
            this.headers.remove(key);
        }
    }

    updateHeader(key: string, value: string): void {
        if (helper.isDefined(key) && helper.isDefined(value)) {
            this.headers.setValue(key, value);
        }
    }

    all() : Object {
        let heads = {};
        this.headers.forEach((key, value) => { heads[key] = value; });
        return heads;
    }

    hasHeaders() : boolean {
        return this.headers.length() > 0;
    }
        
    /**Private helpers */
    private isDictionary(dic): boolean {
        return helper.isObject(dic) &&  dic instanceof Dictionary;
    }
}
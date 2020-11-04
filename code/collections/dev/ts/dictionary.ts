import {Helpers} from '../../../common/dev/ts/utils';

const helper = new Helpers();

/** */
export interface IDictionaryPair<K, V> {
	key: K;
	value: V;
}

/** */
export interface IDictionary<K, V> {
	getValue(key: K): V;
	setValue(key: K, value: V): V;
	remove(key: K): V;
	keys(): Array<K>;
	values(): Array<V>;
	length(): number;
	clear(): void;
	contains(key: K): boolean;
	forEach(func: (key: K, value: V) => any): void;
}

/** */
export class Dictionary<K, V> implements IDictionary<K, V> {

	hashTable: { [key: string]: IDictionaryPair<K, V> };
	elementsCounter: number;

	constructor() {
		this.hashTable = {};
		this.elementsCounter = 0;
	}

	getValue(key: K): V {
		var pair: IDictionaryPair<K, V> = this.hashTable[key.toString()];
		if (helper.isUndefined(pair))
			return undefined;
		return pair.value;
	}

	setValue(key: K, value: V): V {
		if (helper.isUndefined(key) || helper.isUndefined(value))
			return undefined;

		var returnedValue: V;
		var k = key.toString();
		var existingElement: IDictionaryPair<K, V> = this.hashTable[k];
		if (helper.isUndefined(existingElement)) {
			this.elementsCounter++;
			returnedValue = undefined;
		}
		else {
			returnedValue = existingElement.value;
		}
		this.hashTable[k] = {
			key: key,
			value: value
		};
		return returnedValue;
	}

	remove(key: K): V {
		var k = key.toString();
		var existingElement: IDictionaryPair<K, V> = this.hashTable[k];
		if (!helper.isUndefined(existingElement)) {
			this.elementsCounter--;
			delete this.hashTable[k];
			return existingElement.value;
		}
		return undefined;
	}

	keys(): Array<K> {
		var keysCollection: K[] = [];
		for (var key in this.hashTable) {
			if (helper.hasProperty(this.hashTable, key)) {
				var element: IDictionaryPair<K, V> = this.hashTable[key];
				keysCollection.push(element.key);
			}
		}
		return keysCollection;
	}

	values(): Array<V> {
		var valuesCollection: V[] = [];
		for (var key in this.hashTable) {
			if (helper.hasProperty(this.hashTable, key)) {
				var element: IDictionaryPair<K, V> = this.hashTable[key];
				valuesCollection.push(element.value);
			}
		}
		return valuesCollection;
	}

	length(): number {
		return this.elementsCounter;
	}

	clear(): void {
		this.elementsCounter = 0;
		this.hashTable = {};
	}

	contains(key: K): boolean {
		return !helper.isUndefined(this.getValue(key));
	}

	forEach(func: (key: K, value: V) => any): void {
		for (var key in this.hashTable) {
			if (helper.hasProperty(this.hashTable, key)) {
				var element: IDictionaryPair<K, V> = this.hashTable[key];
				if (helper.isFunction(func)) {
					var returned = func.call(this, element.key, element.value);
				}
			}
		}
	}
}

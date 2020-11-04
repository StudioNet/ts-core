import { Helpers } from "../../../common/dev/ts/utils";
import { IComparer, IEqualer, basicEqualer, basicComparer } from "./base";


const helper = new Helpers();

export interface ICollection {
	//Methods of the collection interface
	count(): number;
	clear(): void;
	add(item: any): void;
	updateAt(idx: number, item: any): void;
	returnAt(idx: number): any;
	removeAt(idx: number): void;
	removeAtAndOut(idx: number): any;
	indexOf<T>(item: any, equalityMethod?: IEqualer<T>): number;
	lastIndexOf<T>(item: any, equalityMethod?: IEqualer<T>): number;
	isEmpty(): boolean;
	forEach(func: (scope: any, item: any, idx: number) => any, scope: any): void;
	filter(func: (scope: any, item: any, idx: number) => any, scope: any): Array<any>;
}

export class Collection implements ICollection {
	source: Array<any>;
	capacity: number;

	constructor() {
		this.source = [];
	}

	exist<T>(item: any, equalityMethod?: IEqualer<T>): boolean {
		var equals = equalityMethod || basicEqualer;
		for (var index = 0; index < this.source.length; index++) {
			var element = this.source[index];
			if (equals(item, element)) {
				return true;
			}
			continue;
		}
		return false;
	}

	count() {
		return this.source.length;
	}

	clear() {
		this.source = [];
	}

	add(item: any) {
		if (!this.exist(item)) {
			this.source.push(item);
		}
		else {
			var idx = this.indexOf(item, basicEqualer);
			if (idx >= 0) {
				this.updateAt(idx, item);
			}
		}
		this.capacity = this.source.length;
	}

	updateAt(idx: number, item: any) {
		if (idx > -1 && idx < this.capacity) {
			this.source[idx] = item;
		}
	}

	returnAt(idx: number) {
		if (idx > -1 && idx < this.capacity) {
			return this.source[idx];
		}
		return null;
	}

	removeAt(idx: number) {
		var removedItem = null;
		switch (idx) {
			case 0: {
				removedItem = this.source.shift()
				break;
			}
			case -1: {
				removedItem = this.source.pop();
				break;
			}
			default: {
				removedItem = this.source[idx];
				var leftArray = this.source.slice(0, idx);
				var rightArray = this.source.slice(idx + 1);
				this.source = leftArray.concat(rightArray);
			}
		}
		return removedItem;
	}

	removeAtAndOut(idx: number): any {
		return this.removeAt(idx);
	}

	indexOf<T>(item: any, equality?: IEqualer<T>): number {
		var equals = equality || basicEqualer;
		var returnIndex = -1;
		var i = 0;
		while (i < this.capacity) {
			if (equals(this.source[i], item)) {
				returnIndex = i;
				break;
			}
			i++;
		}
		return returnIndex;
	}

	lastIndexOf<T>(item: any, equality?: IEqualer<T>): number {
		var equals = equality || basicEqualer;
		var returnIndex = -1;
		var i = this.capacity;
		while (i >= 0) {
			if (equals(this.source[i], item)) {
				returnIndex = i;
				break;
			}
			i--;
		}
		return returnIndex;
	}

	isEmpty(): boolean {
		return this.source.length == 0;
	}

	forEach(func: (scope: any, item: any, idx: number) => any, scope: any): void {
		var currentScope = scope || window;
		for (var i = 0, j = this.source.length; i < j; ++i) {
			if (!helper.isFunction(func))
				continue;
			func.call(currentScope, this.source[i], i, this);
		}
	}

	filter(func: (scope: any, item: any, idx: number) => any, scope: any): Array<any> {
		var currentScope = scope || window;
		var tempSource = [];
		for (var index = 0, jIdx = this.source.length; index < jIdx; ++index) {
			if (!helper.isFunction(func)) {
				continue;
			}
			if (!func.call(currentScope, this.source[index], index)) {
				continue;
			}
			tempSource.push(this.source[index]);
		}
		return tempSource;
	}
} 	
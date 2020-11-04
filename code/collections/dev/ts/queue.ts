import {ICollection, Collection} from "./collection"; 

export interface IQueue extends ICollection {
	queueLength: number;
	length() : number;
	push(item : any) : void;
	pop () : any;								
}
	
//<source>
//Represent standart data structure for queue (FIFO) management
//</source>
export class Queue extends Collection implements IQueue {
	queueLength : number = 0;
	
	constructor(){
		super();
	}
	
	length() : number {
		return this.queueLength;
	}
	
	push(item : any) : void {
		this.source.push(item);
		this.queueLength = this.count();
	}
	
	pop() : any {
		return this.source.shift();												
	}
}
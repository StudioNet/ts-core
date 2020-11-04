import {Collection} from "./collection"; 
import {IQueue}  from "./queue";

export class Stack extends Collection implements IQueue {
	queueLength : number = 0;
	
	constructor(){
		super();
	}
	
	length() : number {
		return this.queueLength;
	}
	
	push(item : any) : void {
		this.source.push(item);
	}
	
	pop() : any {
		return this.source.pop();												
	}	
}
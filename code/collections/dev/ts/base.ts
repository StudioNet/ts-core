export interface IComparer<T> {
	(left: T, right: T) : number;
}
	
export interface IEqualer<T> {
	(left: T, right : T) : boolean;
}
	
export function basicComparer<T>(left : IComparer<T>, right : IComparer<T>) : number {
	if(left < right)
		return -1;
	else if (left === right)
		return 0;
	else 
		return 1;
}

export function basicEqualer<T>(left : any, right : any): boolean { 
	return left === right 
}


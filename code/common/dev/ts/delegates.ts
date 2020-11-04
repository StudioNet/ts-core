export interface IAction<T> {
	(method: T): void;
}

export interface IFunc<T, TResult> {
	(method: T): TResult;
}
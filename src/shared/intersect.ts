// https://stackoverflow.com/a/50375286
export type Intersect<T> = (
	T extends unknown ? (t: T) => void : never
) extends (t: infer R) => void
	? R
	: never;

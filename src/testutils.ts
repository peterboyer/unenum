export type Expect<T extends true> = T;

// prettier-ignore
export type Equal<A, B> = (
	<T>() => T extends A ? 1 : 2) extends
		(<T>() => T extends B ? 1 : 2)
	? true
	: false;

// prettier-ignore
export type NotEqual<A, B> = Equal<A, B> extends true
	? false
	: true;

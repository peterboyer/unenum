import type { EnumBase, Empty } from "./enum.utils";

/**
 * Creates a union of mutually exclusive, discriminable variants.
 *
 * @example
 * ```ts
 * type Foo = Enum<{
 * 	A: { a: string };
 * 	B: { b: number };
 * 	C: undefined;
 * }>;
 * -> | { A:  true ; B?: never; C?: never; a: string }
 *    | { A?: never; B:  true ; C?: never; b: number }
 *    | { A?: never; B?: never; C:  true             }
 *
 * const foo: Foo = { A: true, a: "abc" };
 * const foo: Foo = { B: true, b: 12345 };
 * const foo: Foo = { C: true           };
 *
 * if      (foo.A) { foo.a -> string }
 * else if (foo.B) { foo.b -> number }
 * else            { ... }
 * ```
 */
// prettier-ignore
export type Enum<T extends Record<string, object | undefined>> = {
	[V in keyof T]-?:
		& (T[V] extends undefined ? Empty : T[V])
		& { [K in V]-?: true }
		& { [K in Exclude<keyof T, V>]+?: never };
}[keyof T] & EnumBase<T>;

import type {
	EnumRoot,
	EnumMerge,
	EnumPick,
	EnumOmit,
	EnumKeys,
	EnumValues,
} from "./enum.utils";

export namespace Enum {
	export type { EnumRoot as Root };
	export type { EnumMerge as Merge };
	export type { EnumPick as Pick };
	export type { EnumOmit as Omit };
	export type { EnumKeys as Keys };
	export type { EnumValues as Values };
}

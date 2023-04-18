// @ts-expect-error It's okay for this .d.ts file to have this const.
const Empty = {};
type Empty = typeof Empty;

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
 * -> | { is: "A"; a: string }
 *    | { is: "B"; b: number }
 *    | { is: "C"            }
 *
 * const $foo: Foo = { is: "A", a: "abc" };
 * const $foo: Foo = { is: "B", b: 12345 };
 * const $foo: Foo = { is: "C"           };
 *
 * if   ($foo.is === "A") {
 * 	return $foo.a; -> string
 * } else {
 * 	return $foo.is === "B" ? $foo.b : undefined; -> number | undefined
 * }
 * ```
 */
// prettier-ignore
export type Enum<TVariants extends Record<string, object | undefined>> = {
	[Variant in keyof TVariants]-?: Flatten<
		& { is: Variant }
		& (TVariants[Variant] extends undefined ? Empty : TVariants[Variant])
	>;
}[keyof TVariants];

export namespace Enum {
	export type { EnumKeys as Keys };
	export type { EnumValues as Values };
	export type { EnumPick as Pick };
	export type { EnumOmit as Omit };
	export type { EnumMerge as Merge };
}

/**
 * Merges intersections.
 *
 * @example
 * ```
 * Flatten<{ is: "Data" } & { value: string }>
 * -> { is: "Data"; value: string }
 * ```
 */
// https://stackoverflow.com/a/49683575
type Flatten<T> = T extends object ? { [K in keyof T]: T[K] } : never;

/**
 * Infers all possible variants keys of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * Enum.Keys<Foo>
 * -> "A" | "B" | "C"
 * ```
 */
type EnumKeys<TEnum> = TEnum extends { is: string } ? TEnum["is"] : never;

/**
 * Infers all possible variant values of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * Enum.Values<Foo>
 * -> | { a: string }
 *    | { b: string }
 * ```
 */
type EnumValues<TEnum> = TEnum extends { is: string }
	? Omit<TEnum, "is"> extends infer Values
		? keyof Values extends never
			? never
			: Values
		: never
	: never;

/**
 * Narrows a given Enum by including only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * Enum.Pick<Foo, "A" | "C">
 * -> | { is: "A"; a: string }
 *    | { is: "C" }
 * ```
 */
type EnumPick<TEnum, TVariant extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariant;
}
	? TEnum
	: never;

/**
 * Narrows a given Enum by excluding only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * Enum.Omit<Foo, "A" | "C">
 * -> | { is: "B"; b: number }
 * ```
 */
type EnumOmit<TEnum, TVariant extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariant;
}
	? never
	: TEnum;

/**
 * Combines all given Enums into a new Enum.
 *
 * @example
 * ```ts
 * type A = Enum<{ A1: { a: string }; A2: undefined }>;
 * type B = Enum<{ B1: { b: number }; B2: undefined }>;
 * Enum.Merge<A | B>
 * -> Enum<{
 * 	A1: { a: string }; A2: undefined;
 * 	B1: { b: number }; B2: undefined;
 * }>
 * ```
 */
type EnumMerge<TEnum> = TEnum extends { is: string } ? TEnum : never;

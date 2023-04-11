/**
 * Infers the base definition of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * Enum.Infer<Foo>;
 * -> {
 * 	A: { a: string };
 * 	B: { b: number };
 * 	C: undefined;
 * }
 * ```
 */
export type EnumInfer<U extends EnumBase> = U extends never
	? Empty
	: NonNullable<U[""]>;

/**
 * Combines all given Enums into a new Enum.
 *
 * @example
 * ```ts
 * type A = Enum<{ A1: { a: string }; A2: undefined }>;
 * type B = Enum<{ B1: { b: number }; B2: undefined }>;
 * Enum.Merge<A | B>
 * -> Enum<{
 * 	A1: { a: string };
 * 	A2: undefined;
 * 	B1: { b: number };
 * 	B2: undefined;
 * }>
 * ```
 */
export type EnumMerge<U extends EnumBase> = Enum<Intersect<EnumInfer<U>>>;

/**
 * Narrows a given Enum by including only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * Enum.Pick<Foo, "A" | "C">
 * -> | { A: true; a: string }
 *    | { C: true }
 * ```
 */
export type EnumPick<U extends EnumBase, K extends EnumKeys<U>> = Enum<
	Pick<EnumInfer<U>, K>
>;

/**
 * Narrows a given Enum by excluding only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * Enum.Omit<Foo, "A" | "C">
 * -> | { B: true; b: number }
 * ```
 */
export type EnumOmit<U extends EnumBase, K extends EnumKeys<U>> = Enum<
	Pick<EnumInfer<U>, Exclude<EnumKeys<U>, K>>
>;

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
export type EnumKeys<U extends EnumBase> = U extends never
	? never
	: keyof EnumInfer<U>;

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
export type EnumValues<U extends EnumBase> = U extends never
	? never
	: NonNullable<EnumInfer<U>[keyof EnumInfer<U>]>;

////////////////////////////////////////////////////////////////////////////////

/**
 * @internal
 *
 * Workaround to store original type information on Enum without it showing in
 * intellisense/autocomplete. Inspired by:
 * https://github.com/react-navigation/react-navigation/blob/90874397e653a6db642822bff18014a3e5980fed/packages/core/src/types.tsx#L156-L168
 */
export class EnumBase<T> {
	private ""?: T;
}

////////////////////////////////////////////////////////////////////////////////

const Empty = {};
/**
 * Represents an object with no keys or values.
 */
export type Empty = typeof Empty;

/**
 * Create an intersection of all union members.
 *
 * @example
 * ```
 * Intersect<{ A: string } | { B: string } | { C: string }>
 * -> { A: string, B: string, C: string }
 * ```
 */
type Intersect<T extends object> = (
	T extends unknown ? (t: T) => void : never
) extends (t: infer R) => void
	? R
	: never;

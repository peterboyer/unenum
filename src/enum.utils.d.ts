import type { EnumBase } from "./enum";

/**
 * Retrives the root definition of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooRoot = Enum.Root<Foo>;
 * -> { A: { a: string }; B: { b: number }; C: undefined }
 * ```
 */
export type EnumRoot<T extends EnumBase> = T extends never
	? Empty
	: NonNullable<T[""]>;

/**
 * Intersects all given Enums into a new Enum.
 *
 * @example
 * ```ts
 * type A = Enum<{ A1: { a: string }; A2: undefined }>;
 * type B = Enum<{ B1: { b: number }; B2: undefined }>;
 * type AB = Enum.Merge<A | B>;
 * -> Enum<{
 *   A1: { a: string };
 *   A2: undefined;
 *   B1: { b: number };
 *   B2: undefined;
 *  }>
 * ```
 */
export type EnumMerge<T extends EnumBase> = Enum<Intersect<EnumRoot<T>>>;

/**
 * Narrows a given Enum by including only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooPick = Enum.Pick<Foo, "A" | "C">;
 * -> { A: true; a: string } | { C: true }
 * ```
 */
export type EnumPick<T extends EnumBase, K extends EnumKeys<T>> = Enum<
	Pick<EnumRoot<T>, K>
>;

/**
 * Narrows a given Enum by excluding only the given variant keys.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooOmit = Enum.Omit<Foo, "A" | "C">;
 * -> { B: true; b: number }
 * ```
 */
export type EnumOmit<T extends EnumBase, K extends EnumKeys<T>> = Enum<
	Pick<EnumRoot<T>, Exclude<EnumKeys<T>, K>>
>;

/**
 * Infers all possible variants keys of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooKeys = Enum.Keys<Foo>;
 * -> "A" | "B" | "C"
 * ```
 */
export type EnumKeys<T extends EnumBase> = T extends never
	? never
	: keyof EnumRoot<T>;

/**
 * Infers all possible variant values of the given Enum.
 *
 * @example
 * ```ts
 * type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
 * type FooValues = Enum.Values<Foo>;
 * -> { a: string } | { b: string }
 * ```
 */
export type EnumValues<T extends EnumBase> = T extends never
	? never
	: NonNullable<EnumRoot<T>[keyof EnumRoot<T>]>;

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

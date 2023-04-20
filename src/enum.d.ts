/**
Creates a union of mutually exclusive, discriminable variants.

```ts
import "unenum/global.enum"; // global
import type { Enum } from "unenum"; // imported

type Foo = Enum<{
	A: undefined;
	B: { b: string };
	C: { c: number };
}>;
-> | { is: "A" }
   | { is: "B"; b: string }
   | { is: "C"; c: number }
```
 */
// prettier-ignore
export type Enum<TVariants extends Record<string, Record<string, unknown> | undefined>> = {
	[Variant in keyof TVariants]-?: Identity<
		& { is: Variant }
		& (TVariants[Variant] extends undefined ? Empty : TVariants[Variant])
	>;
}[keyof TVariants];

export namespace Enum {
	export type { EnumKeys as Keys };
	export type { EnumValues as Values };
	export type { EnumProps as Props };
	export type { EnumPick as Pick };
	export type { EnumOmit as Omit };
}

// @ts-expect-error It's okay for this .d.ts file to have this const.
const Empty = {};
type Empty = typeof Empty;

/**
 * Merges intersections.
 *
 * @example
 * ```
 * Identity<{ is: "Data" } & { value: string }>
 * -> { is: "Data"; value: string }
 * ```
 */
// https://stackoverflow.com/a/49683575
type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : never;

/**
Infers all possible variants' keys of the given Enum.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Keys<Foo>
-> "A" | "B" | "C"
```
 */
type EnumKeys<TEnum> = TEnum extends { is: string } ? TEnum["is"] : never;

/**
Infers all possible variants' values of the given Enum.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Values<Foo>
-> | { b: string }
   | { c: number }
```
 */
type EnumValues<TEnum> = TEnum extends { is: string }
	? Omit<TEnum, "is"> extends infer Values
		? keyof Values extends never
			? never
			: Values
		: never
	: never;

/**
Infers only _common_ variants' properties' names of the given Enum. If `TAll`
is `true`, then _all_ variants' properties' names are inferred.

```ts
type Foo = Enum<{ A: undefined; B: { x: string }; C: { x: string; y: number } }>;

Enum.Props<Foo>
-> "x"

Enum.Props<Foo, true>
-> "x" | "y"
```
 */
type EnumProps<TEnum, TAll extends boolean = false> = [TEnum] extends [never]
	? never
	: TAll extends true
	? TEnum extends unknown
		? keyof Omit<TEnum, "is">
		: never
	: [TEnum] extends [{ is: string }]
	? keyof Intersect<Omit<TEnum, "is">>
	: never;

/**
 * Create an intersection of all union members.
 *
 * @example
 * ```
 * Intersect<{ A: string } | { B: string } | { C: string }>
 * -> { A: string, B: string, C: string }
 * ```
 */
type Intersect<T> = (T extends unknown ? (t: T) => void : never) extends (
	t: infer R
) => void
	? R
	: never;

/**
Narrows a given Enum by including only the given variants by key.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Pick<Foo, "A" | "C">
-> | { is: "A" }
   | { is: "C"; c: number }
```
 */
type EnumPick<TEnum, TVariantKey extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariantKey;
}
	? TEnum
	: never;

/**
Narrows a given Enum by excluding only the given variants by key.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: string }
```
 */
type EnumOmit<TEnum, TVariantKey extends EnumKeys<TEnum>> = TEnum extends {
	is: TVariantKey;
}
	? never
	: TEnum;

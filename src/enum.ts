export type Enum<TEnum extends Record<string, unknown>> = {
	[Type in keyof TEnum]: Identity<
		{ type: Type } & (TEnum[Type] extends true
			? { data?: never }
			: { data: TEnum[Type] })
	>;
}[keyof TEnum];

import type { Equal } from "./testutils";

export function Enum<
	TType extends TEnum extends { type: string } ? TEnum["type"] : string,
	TData extends TEnum extends { type: TType; data: unknown }
		? TEnum["data"]
		: never,
	TDataUnknown = undefined,
	TEnum = Identity<
		{ type: TType } & (TDataUnknown extends undefined
			? { data?: TDataUnknown }
			: { data: TDataUnknown })
	>
>(
	type: TType,
	...args: Equal<TData, never> extends true
		? Equal<TDataUnknown, undefined> extends true
			? []
			: [data?: TDataUnknown]
		: [data: TData]
): TEnum {
	const [data] = args;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return { type, data } as any;
}

/**
Infers all variants' keys of the given Enum.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Keys<Foo>
-> "A" | "B" | "C"
```
 */
// prettier-ignore
export type EnumKeys<TDiscriminant extends string, TEnum> =
	TEnum extends Record<TDiscriminant, string>
		? TEnum[TDiscriminant]
		: never;

/**
Infers all variants' unit and data definitions of the given Enum.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Unwrap<Foo>
-> | { A: true; B: { b: string }; C: { c: number } }
```
 */
// prettier-ignore
export type EnumUnwrap<
	TDiscriminant extends string,
	TEnum
> =
	Identity<
		Intersect<
			TEnum extends Record<TDiscriminant, string>
				? {
						[key in TEnum[TDiscriminant]]:
							Exclude<keyof TEnum, TDiscriminant> extends never
								? true
								: Identity<Omit<TEnum, TDiscriminant>>;
					}
				: never
		>
	>;

/**
Narrows a given Enum by including only the given variants by key.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Pick<Foo, "A" | "C">
-> | { is: "A" }
   | { is: "C"; c: number }
```
 */
// prettier-ignore
export type EnumPick<
	TDiscriminant extends EnumDiscriminant,
	TEnum,
	TKeys extends EnumKeys<TDiscriminant, TEnum>
> =
	Extract<TEnum, Record<TDiscriminant, TKeys>>

/**
Narrows a given Enum by excluding only the given variants by key.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: string }
```
 */
// prettier-ignore
export type EnumOmit<
	TDiscriminant extends EnumDiscriminant,
	TEnum,
	TKeys extends EnumKeys<TDiscriminant, TEnum>
> =
	Exclude<TEnum, Record<TDiscriminant, TKeys>>;

/**
Merges a union of Enums' variants and properties into a new Enum.

@example
```ts
type Foo = Enum<{ A: true; B: true; C: { c1: string } }>;
type Bar = Enum<{ B: { b1: string }; C: { c2: number }; D: true }>;

Enum.Merge<Foo | Bar>
-> Enum<{
  A: true;
  B: { b1: string };
  C: { c1: string; c2: number };
  D: true;
}>
```
*/
// prettier-ignore
export type EnumMerge<
	TDiscriminant extends EnumDiscriminant,
	TEnums
> =
	Enum<
		TDiscriminant,
		TrueOrObj<Intersect<TrueAsEmpty<TEnums extends unknown ? EnumUnwrap<TDiscriminant, TEnums> : never>>>
	>;

/**
@internal
 */
// prettier-ignore
type TrueOrObj<T> =
	{
		[K in keyof T]: keyof T[K] extends never
			? true
			: Identity<T[K]>
	};

/**
@internal
 */
// prettier-ignore
type TrueAsEmpty<T> =
	{
		[K in keyof T]: T[K] extends true
			? Record<never, never>
			: T[K]
	};

/**
Merges new additional variants and properties into a new Enum.

@example
```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Extend<Foo, { D: true }>
-> Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
  D: true;
}>
```
 */
// prettier-ignore
export type EnumExtend<
	TDiscriminant extends EnumDiscriminant,
	TEnum,
	TVariants extends EnumVariants
> =
	EnumMerge<
		TDiscriminant,
		TEnum | Enum<TDiscriminant, TVariants>
	>;

/**
Merges intersections.

@internal

@example
```
Identity<{ is: "Data" } & { value: string }>
-> { is: "Data"; value: string }
```
 */
// https://stackoverflow.com/a/49683575
// prettier-ignore
type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : never;

/**
Create an intersection of all union members.

@internal

@example
```
Intersect<{ A: string } | { B: string } | { C: string }>
-> { A: string, B: string, C: string }
```
 */
// prettier-ignore
type Intersect<T> = (T extends unknown ? (t: T) => void : never) extends (t: infer R) => void ? R : never;

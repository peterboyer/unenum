import type * as $Enum from "./enum";
import type * as $Result from "./result";
import type * as $Future from "./future";
import * as $match from "./match";
import * as $safely from "./safely";

export const Discriminant = "is";
export type Discriminant = typeof Discriminant;

// prettier-ignore
export type Enum<TVariants extends $Enum.EnumVariants> = $Enum.Enum<Discriminant, TVariants>;

// prettier-ignore
export namespace Enum {
	export type Keys<TEnum> = $Enum.EnumKeys<Discriminant, TEnum>;
	export type Unwrap<TEnum> = $Enum.EnumUnwrap<Discriminant, TEnum>;
	export type Pick<TEnum, TKeys extends $Enum.EnumKeys<Discriminant, TEnum>> = $Enum.EnumPick<Discriminant, TEnum, TKeys>;
	export type Omit<TEnum, TKeys extends $Enum.EnumKeys<Discriminant, TEnum>> = $Enum.EnumOmit<Discriminant, TEnum, TKeys>;
	export type Merge<TEnums> = $Enum.EnumMerge<Discriminant, TEnums>;
	export type Extend<TEnum, TEnums extends $Enum.EnumVariants> = $Enum.EnumExtend<Discriminant, TEnum, TEnums>;
}

// prettier-ignore
export type Result<TValue = never, TError = never> = $Result.Result<Discriminant, TValue, TError>;

// prettier-ignore
export type Future<TValue = never> = $Future.Future<Discriminant, TValue>;

// prettier-ignore
export namespace Future {
	export type Enum<TEnum> = $Future.FutureEnum<Discriminant, TEnum>;
}

export const safely = $safely.safely(Discriminant);

export const match = $match.match(Discriminant);

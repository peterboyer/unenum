/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Enum } from "./enum";
import type { Identity } from "./shared/identity";

export const Value = <
	TEnum extends Enum.Any<TDiscriminant>,
	TVariant extends Enum.Keys<TEnum, TDiscriminant>,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
>(
	variant: TVariant,
	...args: [
		Exclude<
			keyof PickRequired<Enum.Pick<TEnum, TVariant, TDiscriminant>>,
			TDiscriminant
		>
	] extends [never]
		? []
		: [
				data: Identity<
					Omit<Enum.Pick<TEnum, TVariant, TDiscriminant>, TDiscriminant>
				>
		  ]
): TEnum => ({ _type: variant, ...args[0] } as any);

type PickRequired<T> = {
	[K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

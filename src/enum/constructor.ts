import type { Enum } from "../enum.js";
import type { Identity } from "../shared/identity.js";
import type { Intersect } from "../shared/intersect.js";

export const constructor = <
	TEnum extends Enum.Any<TDiscriminant>,
	TMapper extends Partial<
		Identity<
			Intersect<
				TEnum extends unknown
					? {
							[Key in TEnum[TDiscriminant]]: (
								...args: any[]
							) => Omit<TEnum, TDiscriminant>;
						}
					: never
			>
		>
	>,
	TDiscriminant extends keyof TEnum & string = keyof TEnum &
		Enum.Discriminant.Default,
>(
	_value: TEnum,
	mapper?: TMapper,
	discriminant?: TDiscriminant,
): Identity<
	Intersect<
		TEnum extends unknown
			? {
					[Key in TEnum[TDiscriminant]]: Key extends keyof TMapper
						? TMapper[Key] extends (...args: any[]) => any
							? (...args: Parameters<TMapper[Key]>) => TEnum
							: Fn<TEnum, TDiscriminant>
						: Fn<TEnum, TDiscriminant>;
				}
			: never
	>
> => {
	return new Proxy({} as any, {
		get: (_, key: string) => {
			type LooseMapper = Partial<Record<string, (...args: any[]) => any>>;
			const dataFn = (mapper as unknown as LooseMapper | undefined)?.[key];
			return (...args: any[]) => {
				const data = dataFn ? dataFn(...args) : args[0];
				return { [discriminant ?? "_type"]: key, ...data };
			};
		},
	});
};

type Fn<
	TEnum extends Enum.Any<TDiscriminant>,
	TDiscriminant extends Enum.Discriminant,
> = TEnum extends unknown
	? [Exclude<keyof TEnum, TDiscriminant>] extends [never]
		? () => TEnum
		: [keyof PickRequired<Omit<TEnum, TDiscriminant>>] extends [never]
			? (data?: Identity<Omit<TEnum, TDiscriminant>>) => TEnum
			: (data: Identity<Omit<TEnum, TDiscriminant>>) => TEnum
	: never;

type PickRequired<T> = {
	[K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

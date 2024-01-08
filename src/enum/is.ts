import type { Enum } from "../enum.js";

export function is<
	TEnum extends Enum.Any<TDiscriminant>,
	TKey extends Enum.Keys<TEnum, TDiscriminant>,
	TDiscriminant extends keyof TEnum & string = keyof TEnum &
		Enum.Discriminant.Default,
>(
	value: TEnum,
	matcher: TKey | TKey[],
	discriminant?: TDiscriminant,
): value is Enum.Pick<TEnum, TKey, TDiscriminant> {
	const key = value[discriminant ?? ("_type" as TDiscriminant)];
	if (Array.isArray(matcher)) {
		return matcher.includes(key as TKey);
	}
	return key === matcher;
}

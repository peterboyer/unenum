import type { Enum } from "../enum.js";

export function is<TEnum extends Enum.Any, TKey extends Enum.Keys<TEnum>>(
	value: TEnum,
	matcher: TKey | TKey[],
): value is Enum.Pick<TEnum, TKey> {
	return is_(value, "_type", matcher);
}

export function is_<
	TEnum extends Enum.Any<TDiscriminant>,
	TKey extends Enum.Keys<TEnum, TDiscriminant>,
	TDiscriminant extends keyof TEnum & string = keyof TEnum &
		Enum.Discriminant.Default,
>(
	value: TEnum,
	discriminant: TDiscriminant,
	matcher: TKey | TKey[],
): value is Enum.Pick<TEnum, TKey, TDiscriminant> {
	const key = value[discriminant];
	if (Array.isArray(matcher)) {
		return matcher.includes(key as TKey);
	}
	return key === matcher;
}

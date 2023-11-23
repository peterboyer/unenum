import type { Enum } from "../enum";

export type Pick<
	TEnum extends Enum.Any<TDiscriminant>,
	TKeys extends Enum.Keys<TEnum, TDiscriminant>,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Extract<TEnum, Record<TDiscriminant, TKeys>>;

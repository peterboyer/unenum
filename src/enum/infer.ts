import type { Enum } from "../enum";
import type { Identity } from "./shared/identity";
import type { Intersect } from "./shared/intersect";

export type Infer<
	TEnum,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Identity<
	Intersect<
		TEnum extends Record<TDiscriminant, string>
			? {
					[key in TEnum[TDiscriminant]]: Exclude<
						keyof TEnum,
						TDiscriminant
					> extends never
						? true
						: Identity<Omit<TEnum, TDiscriminant>>;
			  }
			: never
	>
>;

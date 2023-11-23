import type { Enum } from "../enum";
import type { Identity } from "./shared/identity";
import type { Intersect } from "./shared/intersect";

export type Merge<
	TEnums extends Enum.Any<TDiscriminant>,
	TDiscriminant extends Enum.Discriminant = Enum.Discriminant.Default
> = Enum<
	TrueOrObj<
		Intersect<
			TrueAsEmpty<
				TEnums extends unknown ? Enum.Infer<TEnums, TDiscriminant> : never
			>
		>
	>,
	TDiscriminant
>;

type TrueOrObj<T> = {
	[K in keyof T]: keyof T[K] extends never ? true : Identity<T[K]>;
};

type TrueAsEmpty<T> = {
	[K in keyof T]: T[K] extends true ? Record<never, never> : T[K];
};

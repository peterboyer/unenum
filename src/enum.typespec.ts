import type { Expect, Equal } from "./testutils";
import type { Enum } from "./enum";

const Empty = {};
type None = typeof Empty;
type Unit = { Unit: undefined };
type Data = { Data: { value: unknown } };
type Both = Unit & Data;
type Generic<T> = { Generic: { value: T } };

type ENone = Enum<None>;
type EUnit = Enum<Unit>;
type EData = Enum<Data>;
type EBoth = Enum<Both>;
type EGeneric<T> = Enum<Generic<T>>;

({}) as [
	Expect<Equal<ENone, never>>,
	Expect<Equal<ENone["is"], never>>,
	Expect<Equal<EUnit, { is: "Unit" }>>,
	Expect<Equal<EUnit["is"], "Unit">>,
	Expect<Equal<EData, { is: "Data"; value: unknown }>>,
	Expect<Equal<EData["is"], "Data">>,
	Expect<Equal<EBoth, { is: "Unit" } | { is: "Data"; value: unknown }>>,
	Expect<Equal<EBoth["is"], "Unit" | "Data">>,
	Expect<Equal<EGeneric<number>, { is: "Generic"; value: number }>>,
	Expect<Equal<EGeneric<number>["is"], "Generic">>,

	Expect<Equal<Enum.Keys<ENone>, never>>,
	Expect<Equal<Enum.Keys<EUnit>, "Unit">>,
	Expect<Equal<Enum.Keys<EData>, "Data">>,
	Expect<Equal<Enum.Keys<EBoth>, "Unit" | "Data">>,
	Expect<Equal<Enum.Keys<EGeneric<number>>, "Generic">>,

	Expect<Equal<Enum.Values<ENone>, never>>,
	Expect<Equal<Enum.Values<EUnit>, never>>,
	Expect<Equal<Enum.Values<EData>, { value: unknown }>>,
	Expect<Equal<Enum.Values<EBoth>, { value: unknown }>>,
	Expect<Equal<Enum.Values<EGeneric<number>>, { value: number }>>,

	Expect<Equal<Enum.Pick<ENone, never>, never>>,
	Expect<Equal<Enum.Pick<EUnit, never>, never>>,
	Expect<Equal<Enum.Pick<EUnit, "Unit">, EUnit>>,
	Expect<Equal<Enum.Pick<EData, never>, never>>,
	Expect<Equal<Enum.Pick<EData, "Data">, EData>>,
	Expect<Equal<Enum.Pick<EBoth, never>, never>>,
	Expect<Equal<Enum.Pick<EBoth, "Unit">, EUnit>>,
	Expect<Equal<Enum.Pick<EBoth, "Data">, EData>>,
	Expect<Equal<Enum.Pick<EBoth, "Unit" | "Data">, EBoth>>,
	Expect<Equal<Enum.Pick<EGeneric<number>, never>, never>>,
	Expect<Equal<Enum.Pick<EGeneric<number>, "Generic">, EGeneric<number>>>,

	Expect<Equal<Enum.Omit<ENone, never>, never>>,
	Expect<Equal<Enum.Omit<EUnit, never>, EUnit>>,
	Expect<Equal<Enum.Omit<EUnit, "Unit">, never>>,
	Expect<Equal<Enum.Omit<EData, never>, EData>>,
	Expect<Equal<Enum.Omit<EData, "Data">, never>>,
	Expect<Equal<Enum.Omit<EBoth, never>, EBoth>>,
	Expect<Equal<Enum.Omit<EBoth, "Unit">, EData>>,
	Expect<Equal<Enum.Omit<EBoth, "Data">, EUnit>>,
	Expect<Equal<Enum.Omit<EBoth, "Unit" | "Data">, never>>,
	Expect<Equal<Enum.Omit<EGeneric<number>, never>, EGeneric<number>>>,
	Expect<Equal<Enum.Omit<EGeneric<number>, "Generic">, never>>,

	Expect<Equal<Enum.Merge<never>, never>>,
	Expect<Equal<Enum.Merge<EUnit>, EUnit>>,
	Expect<Equal<Enum.Merge<EData>, EData>>,
	Expect<Equal<Enum.Merge<EBoth>, EBoth>>,
	Expect<Equal<Enum.Merge<EGeneric<number>>, EGeneric<number>>>,
	Expect<Equal<Enum.Merge<EUnit | EData>, EBoth>>,
	Expect<Equal<Enum.Merge<EUnit | EData>, EUnit | EData>>,
	Expect<
		Equal<
			Enum.Merge<EUnit | EData | EGeneric<number>>,
			EUnit | EData | EGeneric<number>
		>
	>
];

{
	type State = Enum<{
		Left: { value: string };
		Right: { value: string };
		None: undefined;
	}>;

	const getState = (): State => {
		if ("".toString()) return { is: "Left", value: "" };
		if ("".toString()) return { is: "Right", value: "" };
		return { is: "None" };
	};

	() => {
		const $state = getState();

		if ($state.is === "Left") {
			({}) as [Expect<Equal<typeof $state, { is: "Left"; value: string }>>];
			return;
		}
		if ($state.is === "Right") {
			({}) as [Expect<Equal<typeof $state, { is: "Right"; value: string }>>];
			return;
		}
		if ($state.is === "None") {
			({}) as [Expect<Equal<typeof $state, { is: "None" }>>];
			return;
		}

		({}) as [Expect<Equal<typeof $state, never>>];
	};
}

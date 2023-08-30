import type { Expect, Equal } from "./testutils";
import type { Enum } from "./enum";

type None = Record<never, never>;
type Unit = { Unit: true };
type Data = { Data: { value: unknown } };
type Both = Unit & Data;
type Generic<T> = { Generic: { value: T } };

type ENone = Enum<None>;
type EUnit = Enum<Unit>;
type EData = Enum<Data>;
type EBoth = Enum<Both>;
type EGeneric<T> = Enum<Generic<T>>;

type XNone = Enum<None, "$type">;
type XUnit = Enum<Unit, "$type">;
type XData = Enum<Data, "$type">;
type XBoth = Enum<Both, "$type">;
type XGeneric<T> = Enum<Generic<T>, "$type">;

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

	Expect<Equal<XNone, never>>,
	Expect<Equal<XNone["$type"], never>>,
	Expect<Equal<XUnit, { $type: "Unit" }>>,
	Expect<Equal<XUnit["$type"], "Unit">>,
	Expect<Equal<XData, { $type: "Data"; value: unknown }>>,
	Expect<Equal<XData["$type"], "Data">>,
	Expect<Equal<XBoth, { $type: "Unit" } | { $type: "Data"; value: unknown }>>,
	Expect<Equal<XBoth["$type"], "Unit" | "Data">>,
	Expect<Equal<XGeneric<number>, { $type: "Generic"; value: number }>>,
	Expect<Equal<XGeneric<number>["$type"], "Generic">>,

	Expect<Equal<Enum.Keys<ENone>, never>>,
	Expect<Equal<Enum.Keys<EUnit>, "Unit">>,
	Expect<Equal<Enum.Keys<EData>, "Data">>,
	Expect<Equal<Enum.Keys<EBoth>, "Unit" | "Data">>,
	Expect<Equal<Enum.Keys<EGeneric<number>>, "Generic">>,

	Expect<Equal<Enum.Keys<XNone, "$type">, never>>,
	Expect<Equal<Enum.Keys<XUnit, "$type">, "Unit">>,
	Expect<Equal<Enum.Keys<XData, "$type">, "Data">>,
	Expect<Equal<Enum.Keys<XBoth, "$type">, "Unit" | "Data">>,
	Expect<Equal<Enum.Keys<XGeneric<number>, "$type">, "Generic">>,

	Expect<Equal<Enum.Unwrap<ENone>, never>>,
	Expect<Equal<Enum.Unwrap<EUnit>, { Unit: true }>>,
	Expect<Equal<Enum.Unwrap<EData>, { Data: { value: unknown } }>>,
	Expect<Equal<Enum.Unwrap<EBoth>, { Unit: true; Data: { value: unknown } }>>,
	Expect<Equal<Enum.Unwrap<EGeneric<number>>, { Generic: { value: number } }>>,

	Expect<Equal<Enum.Unwrap<XNone, "$type">, never>>,
	Expect<Equal<Enum.Unwrap<XUnit, "$type">, { Unit: true }>>,
	Expect<Equal<Enum.Unwrap<XData, "$type">, { Data: { value: unknown } }>>,
	Expect<
		Equal<Enum.Unwrap<XBoth, "$type">, { Unit: true; Data: { value: unknown } }>
	>,
	Expect<
		Equal<
			Enum.Unwrap<XGeneric<number>, "$type">,
			{ Generic: { value: number } }
		>
	>,

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

	Expect<Equal<Enum.Pick<XNone, never, "$type">, never>>,
	Expect<Equal<Enum.Pick<XUnit, never, "$type">, never>>,
	Expect<Equal<Enum.Pick<XUnit, "Unit", "$type">, XUnit>>,
	Expect<Equal<Enum.Pick<XData, never, "$type">, never>>,
	Expect<Equal<Enum.Pick<XData, "Data", "$type">, XData>>,
	Expect<Equal<Enum.Pick<XBoth, never, "$type">, never>>,
	Expect<Equal<Enum.Pick<XBoth, "Unit", "$type">, XUnit>>,
	Expect<Equal<Enum.Pick<XBoth, "Data", "$type">, XData>>,
	Expect<Equal<Enum.Pick<XBoth, "Unit" | "Data", "$type">, XBoth>>,
	Expect<Equal<Enum.Pick<XGeneric<number>, never, "$type">, never>>,
	Expect<
		Equal<Enum.Pick<XGeneric<number>, "Generic", "$type">, XGeneric<number>>
	>,

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

	Expect<Equal<Enum.Omit<XNone, never, "$type">, never>>,
	Expect<Equal<Enum.Omit<XUnit, never, "$type">, XUnit>>,
	Expect<Equal<Enum.Omit<XUnit, "Unit", "$type">, never>>,
	Expect<Equal<Enum.Omit<XData, never, "$type">, XData>>,
	Expect<Equal<Enum.Omit<XData, "Data", "$type">, never>>,
	Expect<Equal<Enum.Omit<XBoth, never, "$type">, XBoth>>,
	Expect<Equal<Enum.Omit<XBoth, "Unit", "$type">, XData>>,
	Expect<Equal<Enum.Omit<XBoth, "Data", "$type">, XUnit>>,
	Expect<Equal<Enum.Omit<XBoth, "Unit" | "Data", "$type">, never>>,
	Expect<Equal<Enum.Omit<XGeneric<number>, never, "$type">, XGeneric<number>>>,
	Expect<Equal<Enum.Omit<XGeneric<number>, "Generic", "$type">, never>>,

	Expect<Equal<Enum.Extend<ENone, never>, ENone>>,
	Expect<Equal<Enum.Extend<ENone, { A: true }>, Enum<{ A: true }>>>,
	Expect<Equal<Enum.Extend<EUnit, never>, EUnit>>,
	Expect<Equal<Enum.Extend<EUnit, { A: true }>, Enum<{ Unit: true; A: true }>>>,
	Expect<Equal<Enum.Extend<EData, never>, EData>>,
	Expect<
		Equal<
			Enum.Extend<EData, { A: true }>,
			Enum<{ Data: { value: unknown }; A: true }>
		>
	>,
	Expect<Equal<Enum.Extend<EBoth, never>, EBoth>>,
	Expect<
		Equal<
			Enum.Extend<EBoth, { Unit: { value: unknown } }>,
			Enum<{ Unit: { value: unknown }; Data: { value: unknown } }>
		>
	>,
	Expect<Equal<Enum.Extend<EGeneric<number>, never>, EGeneric<number>>>,
	Expect<
		Equal<
			Enum.Extend<EGeneric<number>, { Generic: { foo: null } }>,
			Enum<{ Generic: { value: number; foo: null } }>
		>
	>,

	Expect<Equal<Enum.Extend<XNone, never, "$type">, XNone>>,
	Expect<
		Equal<Enum.Extend<XNone, { A: true }, "$type">, Enum<{ A: true }, "$type">>
	>,
	Expect<Equal<Enum.Extend<XUnit, never, "$type">, XUnit>>,
	Expect<
		Equal<
			Enum.Extend<XUnit, { A: true }, "$type">,
			Enum<{ Unit: true; A: true }, "$type">
		>
	>,
	Expect<Equal<Enum.Extend<XData, never, "$type">, XData>>,
	Expect<
		Equal<
			Enum.Extend<XData, { A: true }, "$type">,
			Enum<{ Data: { value: unknown }; A: true }, "$type">
		>
	>,
	Expect<Equal<Enum.Extend<XBoth, never, "$type">, XBoth>>,
	Expect<
		Equal<
			Enum.Extend<XBoth, { Unit: { value: unknown } }, "$type">,
			Enum<{ Unit: { value: unknown }; Data: { value: unknown } }, "$type">
		>
	>,
	Expect<
		Equal<Enum.Extend<XGeneric<number>, never, "$type">, XGeneric<number>>
	>,
	Expect<
		Equal<
			Enum.Extend<XGeneric<number>, { Generic: { foo: null } }, "$type">,
			Enum<{ Generic: { value: number; foo: null } }, "$type">
		>
	>,

	Expect<
		Equal<
			Enum.Merge<
				| Enum<{ A: true; B: true; C: { c1: string } }>
				| Enum<{ B: { b1: string }; C: { c2: number }; D: true }>
			>,
			Enum<{
				A: true;
				B: { b1: string };
				C: { c1: string; c2: number };
				D: true;
			}>
		>
	>,

	Expect<
		Equal<
			Enum.Merge<
				| Enum<{ A: true; B: true; C: { c1: string } }, "$type">
				| Enum<{ B: { b1: string }; C: { c2: number }; D: true }, "$type">,
				"$type"
			>,
			Enum<
				{
					A: true;
					B: { b1: string };
					C: { c1: string; c2: number };
					D: true;
				},
				"$type"
			>
		>
	>
];

{
	type State = Enum.Extend<
		Enum<{
			Left: { value: string };
			Right: { value: string };
		}>,
		{ None: true }
	>;

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

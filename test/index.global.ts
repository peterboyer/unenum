import "unenum/global";

type MyEnum = Enum<{
	A: undefined;
	B: { foo: string };
}>;

{
	const result = ((value: string): Result<MyEnum, "ValueInvalid"> => {
		if (!value) {
			return { Err: { value: "ValueInvalid" } };
		}
		if (value === "a") {
			return { Ok: { value: { A: true } } };
		}
		return { Ok: { value: { B: { value: { foo: value } } } } };
	})("foo");
	if (result.Err) {
		console.log(result.Err.value === "ValueInvalid");
	} else {
		if (result.Ok.value.A) {
			console.log(result.Ok.value.A === true);
		} else {
			console.log(typeof result.Ok.value.B.value.foo === "string");
		}
	}
}

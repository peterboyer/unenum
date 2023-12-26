export default {
	// project
	modulePathIgnorePatterns: ["dist"],
	// https://jestjs.io/docs/ecmascript-modules
	transform: {},
	// https://kulshekhar.github.io/ts-jest/docs/getting-started/presets
	preset: "ts-jest/presets/default-esm",
	// @workaround
	// > Cannot find module './[...].js' from 'src/[...].spec.ts'
	// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/#use-esm-presets
	moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
};

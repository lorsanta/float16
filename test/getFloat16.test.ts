import { expect } from "chai";
import { getFloat16 } from "../src/getFloat16";

describe("getFloat16", () => {

    const runTests = (exponentWidth: number, significandPrecision: number, tests: { arg: number, expected: number }[] )  => {
        tests.forEach(({arg, expected}) => {
            const dv = new DataView(new ArrayBuffer(2));
            dv.setInt16(0, arg);
            it(`interprets the bytes 0x${arg.toString(16)} as the float16 value ${expected}`, () => {
                const value = getFloat16(exponentWidth, significandPrecision)(dv.buffer, false);
                if (!Number.isFinite(expected)) {
                    if (Number.isNaN(expected))
                        expect(Number.isNaN(value)).equal(true);
                    else
                        expect(value).equal(expected);
                }
                else
                    expect(value).closeTo(expected, 0.001);
            })
        })
    }

    describe("when exponentWidth=5 and significandPrecision=10", () => {
        const tests = [
            { "arg": 0x3C00, "expected": 1},
            { "arg": 0xC000, "expected": -2},
            { "arg": 0x7BFF, "expected": 6.5504e4},
            { "arg": 0x0400, "expected": 6.10352e-5},
            { "arg": 0x0001, "expected": 5.96046e-8},
            { "arg": 0x0000, "expected": 0},
            { "arg": 0x8000, "expected": -0},
            { "arg": 0x3555, "expected": 0.33325},
            { "arg": 0x7C00, "expected": Infinity},
            { "arg": 0xFC00, "expected": -Infinity},
            { "arg": 0x7C01, "expected": NaN}
        ];

        runTests(5, 10, tests);

    })
    describe("when exponentWidth=8 and significandPrecision=7", () => {
        const tests = [
            { "arg": 0x3F80, "expected": 1},
            { "arg": 0xC000, "expected": -2},
            { "arg": 0x7F7F, "expected": (2**8 - 1) * 2**-7 * 2**127},
            { "arg": 0x0080, "expected": 1.1754e-38},
            { "arg": 0x0000, "expected": 0},
            { "arg": 0x8000, "expected": -0},
            { "arg": 0x3EAB, "expected": 0.33325},
            { "arg": 0x7F80, "expected": Infinity},
            { "arg": 0xFF80, "expected": -Infinity},
            { "arg": 0xFFC1, "expected": NaN},
            { "arg": 0xFF81, "expected": NaN},
        ]

        runTests(8, 7, tests);
    })
})
// calculateTotal.test.ts
import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
    it("should return 0 for empty input", () => {
        expect(calculateTotal("")).toBe(0);
    });

    it("should handle comma-separated values", () => {
        expect(calculateTotal("100,200,300")).toBe(600);
        expect(calculateTotal("1.5, 2.5, 3.5")).toBe(7.5);
    });

    it("should handle newline-separated values", () => {
        expect(calculateTotal("100\n200\n300")).toBe(600);
        expect(calculateTotal("1.5\n 2.5\n 3.5")).toBe(7.5);
    });

    it("should handle mixed comma and newline separators", () => {
        expect(calculateTotal("100,200\n300")).toBe(600);
        expect(calculateTotal("1.5, 2.5\n 3.5")).toBe(7.5);
    });

    it("should ignore empty values and whitespace", () => {
        expect(calculateTotal("100, , 200\n, 300")).toBe(600);
        expect(calculateTotal(",1.5,  ,2.5\n,3.5,")).toBe(7.5);
    });

    it("should return 0 if any value is invalid", () => {
        expect(calculateTotal("abc,def,ghi")).toBe(0);
        expect(calculateTotal("100,200,invalid300")).toBe(0);
    });

    it("should return number if some values start with number", () => {
        expect(calculateTotal("100,200,300aaa")).toBe(600);
        expect(calculateTotal("100,200,3aaa333")).toBe(303);
    });

    it("should handle single value", () => {
        expect(calculateTotal("100")).toBe(100);
        expect(calculateTotal("3.14")).toBe(3.14);
    });
});

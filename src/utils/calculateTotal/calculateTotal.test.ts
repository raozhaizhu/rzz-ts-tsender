import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
    it("空字符串返回0", () => {
        expect(calculateTotal("")).toBe(0);
    });

    it("单个数字字符串", () => {
        expect(calculateTotal("42")).toBe(42);
    });

    it("逗号分隔的数值", () => {
        expect(calculateTotal("10,20,30")).toBe(60);
    });

    it("换行符分隔的数值", () => {
        expect(calculateTotal("10\n20\n30")).toBe(60);
    });

    it("混合逗号和换行符", () => {
        expect(calculateTotal("10,20\n30")).toBe(60);
    });

    it("带空格和空元素", () => {
        expect(calculateTotal(" 10 ,, 20 \n 30 ")).toBe(60);
    });

    it("包含非数字时返回0", () => {
        expect(calculateTotal("10, abc, 20")).toBe(0);
    });

    it("部分无效数字时返回0", () => {
        expect(calculateTotal("10, 20, NaN")).toBe(0);
    });

    it("科学计数法支持", () => {
        expect(calculateTotal("1e3, 2.5e2")).toBe(1250);
    });

    it("仅分隔符返回0", () => {
        expect(calculateTotal(",\n, ,")).toBe(0);
    });

    it("小数计算", () => {
        expect(calculateTotal("0.1, 0.2")).toBeCloseTo(0.3);
    });

    it("大数字计算", () => {
        expect(calculateTotal("1000000, 2000000")).toBe(3000000);
    });
});

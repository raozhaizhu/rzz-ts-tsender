1. calculateTotal

这是我的代码,帮我测试一下他,我想使用 vitest,并且这个测试文件我希望他在同一文件夹下进行测试

```typescript
export const calculateTotal = (amounts: string): number => {
    if (!amounts) return 0;

    const amountArr = amounts
        .split(/[\n,]+/)
        .map((amt) => amt.trim())
        .filter((amt) => amt !== "")
        .map((amt) => parseFloat(amt));

    // console.log("*** amountArr:", amountArr, "***");

    if (amountArr.some(isNaN)) return 0;

    return amountArr.reduce((acc, current) => (acc += current), 0);
};

// let res = calculateTotal("100,200,300aaa");
// console.log("*** res:", res, "***");
```

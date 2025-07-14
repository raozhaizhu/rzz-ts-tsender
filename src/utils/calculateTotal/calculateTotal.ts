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

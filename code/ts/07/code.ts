const input = await Bun.file(`${import.meta.dir}/../../../input/7.txt`).text();

interface Equation {
    testValue: number;
    numbers: number[];
}

function parseInput(input: string): Equation[] {
    return input.split("\n").map(line => {
        const [testValue, numbers] = line.split(": ");
        return {
            testValue: parseInt(testValue),
            numbers: numbers.split(" ").map(n => parseInt(n)),
        };
    });
}

function generateOperatorCombinations(length: number): string[][] {
    const operators = ["+", "*"];
    const combinations: string[][] = [];

    function generate(current: string[]) {
        if (current.length === length) {
            combinations.push([...current]);
            return;
        }
        for (const op of operators) {
            generate([...current, op]);
        }
    }

    generate([]);
    return combinations;
}

function evaluateExpression(numbers: number[], operators: string[]): number {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const nextNum = numbers[i + 1];
        if (operator === "+") {
            result += nextNum;
        } else {
            result *= nextNum;
        }
    }
    return result;
}

export const sp1 = (input: string): string => {
    const equations = parseInput(input);
    let sum = 0;

    for (const eq of equations) {
        const operatorCount = eq.numbers.length - 1;
        const combinations = generateOperatorCombinations(operatorCount);

        const canBeSolved = combinations.some(
            operators => evaluateExpression(eq.numbers, operators) === eq.testValue,
        );

        if (canBeSolved) {
            sum += eq.testValue;
        }
    }

    return sum.toString();
};

function evaluateExpressionP2(numbers: number[], operators: string[]): number {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const nextNum = numbers[i + 1];
        if (operator === "+") {
            result += nextNum;
        } else if (operator === "*") {
            result *= nextNum;
        } else if (operator === "||") {
            // Convert both numbers to strings, concatenate, then back to number
            result = parseInt(result.toString() + nextNum.toString());
        }
    }
    return result;
}

function generateOperatorCombinationsP2(length: number): string[][] {
    const operators = ["+", "*", "||"]; // Added concatenation operator
    const combinations: string[][] = [];

    function generate(current: string[]) {
        if (current.length === length) {
            combinations.push([...current]);
            return;
        }
        for (const op of operators) {
            generate([...current, op]);
        }
    }

    generate([]);
    return combinations;
}

export const partone = sp1(input);

export const sp2 = (input: string): string => {
    const equations = parseInput(input);
    let sum = 0;

    for (const eq of equations) {
        const operatorCount = eq.numbers.length - 1;
        const combinations = generateOperatorCombinationsP2(operatorCount);

        const canBeSolved = combinations.some(
            operators => evaluateExpressionP2(eq.numbers, operators) === eq.testValue,
        );

        if (canBeSolved) {
            sum += eq.testValue;
        }
    }

    return sum.toString();
};

export const parttwo = sp2(input);

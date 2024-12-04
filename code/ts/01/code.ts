const input = await Bun.file(`${import.meta.dir}/../../../input/1.txt`).text();

const lines = input.split("\n");

const sp1 = (lines: string[]) => {
    const leftList: number[] = [];
    const rightList: number[] = [];

    lines.forEach(line => {
        if (line.trim()) {
            const [left, right] = line.trim().split(/\s+/).map(Number);
            leftList.push(left);
            rightList.push(right);
        }
    });

    leftList.sort((a, b) => a - b);
    rightList.sort((a, b) => a - b);

    let totalDistance = 0;
    for (let i = 0; i < leftList.length; i++) {
        totalDistance += Math.abs(leftList[i] - rightList[i]);
    }

    return totalDistance;
};

export const partone = sp1(lines);

const sp2 = (lines: string[]) => {
    // Create two arrays for left and right numbers
    const leftList: number[] = [];
    const rightList: number[] = [];

    // Parse input into two separate lists
    lines.forEach(line => {
        if (line.trim()) {
            const [left, right] = line.trim().split(/\s+/).map(Number);
            leftList.push(left);
            rightList.push(right);
        }
    });

    // Calculate frequency of numbers in right list
    const rightFrequency = new Map<number, number>();
    rightList.forEach(num => {
        rightFrequency.set(num, (rightFrequency.get(num) || 0) + 1);
    });

    // Calculate similarity score
    let similarityScore = 0;
    leftList.forEach(num => {
        const frequency = rightFrequency.get(num) || 0;
        similarityScore += num * frequency;
    });

    return similarityScore;
};

export const parttwo = sp2(lines);

const input = await Bun.file(`${import.meta.dir}/../../../input/4.txt`).text();

const lines = input.split("\n");

const sp1 = (lines: string[]) => {
    const height = lines.length;
    const width = lines[0].length;
    let count = 0;

    // Helper to check if coordinates are within bounds
    const isValid = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height;

    // All possible directions: horizontal, vertical, and diagonal
    const directions = [
        [1, 0], // right
        [0, 1], // down
        [1, 1], // diagonal down-right
        [-1, 1], // diagonal down-left
        [-1, 0], // left
        [0, -1], // up
        [-1, -1], // diagonal up-left
        [1, -1], // diagonal up-right
    ];

    // Check each starting position
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Try each direction from this position
            for (const [dx, dy] of directions) {
                if (isValid(x + 3 * dx, y + 3 * dy)) {
                    // Check if full word would fit
                    if (
                        lines[y][x] === "X" &&
                        lines[y + dy][x + dx] === "M" &&
                        lines[y + 2 * dy][x + 2 * dx] === "A" &&
                        lines[y + 3 * dy][x + 3 * dx] === "S"
                    ) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
};

export const partone = sp1(lines);

const sp2 = (lines: string[]) => {
    const height = lines.length;
    const width = lines[0].length;
    let count = 0;

    // Check each position as the center of potential X
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (lines[y][x] === "A") {
                // Check all possible combinations of MAS in X shape
                const topLeft = lines[y - 1][x - 1];
                const topRight = lines[y - 1][x + 1];
                const bottomLeft = lines[y + 1][x - 1];
                const bottomRight = lines[y + 1][x + 1];

                // Check if we have valid MAS combinations
                const isValidMAS = (start: string, middle: string, end: string) =>
                    (start === "M" && middle === "A" && end === "S") ||
                    (start === "S" && middle === "A" && end === "M");

                // Check both diagonals for MAS (forward or backward)
                if (
                    (isValidMAS(topLeft, lines[y][x], bottomRight) &&
                        isValidMAS(topRight, lines[y][x], bottomLeft)) ||
                    (isValidMAS(bottomRight, lines[y][x], topLeft) &&
                        isValidMAS(bottomLeft, lines[y][x], topRight))
                ) {
                    count++;
                }
            }
        }
    }

    return count;
};

export const parttwo = sp2(lines);

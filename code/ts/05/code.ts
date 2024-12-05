const input = await Bun.file(`${import.meta.dir}/../../../input/5.txt`).text();

const lines = input.split("\n");

const sp1 = (lines: string[]) => {
    // Split input into rules and updates
    const emptyLineIndex = lines.findIndex(line => line === "");
    const rules = lines.slice(0, emptyLineIndex);
    const updates = lines.slice(emptyLineIndex + 1).filter(line => line.trim());

    // Parse rules into a map of dependencies
    const dependencies = new Map<number, Set<number>>();
    rules.forEach(rule => {
        if (!rule) return;
        const [before, after] = rule.split("|").map(Number);
        if (!dependencies.has(before)) {
            dependencies.set(before, new Set());
        }
        dependencies.get(before)!.add(after);
    });

    // Function to check if an update is valid
    const isValidUpdate = (update: number[]): boolean => {
        for (let i = 0; i < update.length; i++) {
            for (let j = i + 1; j < update.length; j++) {
                const before = update[i];
                const after = update[j];
                // If there's a rule saying after should come before before, the update is invalid
                if (dependencies.get(after)?.has(before)) {
                    return false;
                }
            }
        }
        return true;
    };

    // Process each update
    let sum = 0;
    updates.forEach(update => {
        const numbers = update.split(",").map(Number);
        if (isValidUpdate(numbers)) {
            // Find middle number
            const middleIndex = Math.floor(numbers.length / 2);
            sum += numbers[middleIndex];
        }
    });

    return sum;
};

export const partone = sp1(lines);

const sp2 = (lines: string[]) => {
    const emptyLineIndex = lines.findIndex(line => line === "");
    const rules = lines.slice(0, emptyLineIndex);
    const updates = lines.slice(emptyLineIndex + 1).filter(line => line.trim());

    // Parse rules into a dependency graph
    const dependencies = new Map<number, Set<number>>();
    rules.forEach(rule => {
        if (!rule) return;
        const [before, after] = rule.split("|").map(Number);
        if (!dependencies.has(before)) {
            dependencies.set(before, new Set());
        }
        dependencies.get(before)!.add(after);
    });

    // Check if update is valid
    const isValidUpdate = (update: number[]): boolean => {
        for (let i = 0; i < update.length; i++) {
            for (let j = i + 1; j < update.length; j++) {
                const before = update[i];
                const after = update[j];
                if (dependencies.get(after)?.has(before)) {
                    return false;
                }
            }
        }
        return true;
    };

    // Sort update according to rules
    const sortUpdate = (update: number[]): number[] => {
        return [...update].sort((a, b) => {
            if (dependencies.get(b)?.has(a)) return 1;
            if (dependencies.get(a)?.has(b)) return -1;
            return 0;
        });
    };

    let sum = 0;
    updates.forEach(update => {
        const numbers = update.split(",").map(Number);
        if (!isValidUpdate(numbers)) {
            const sortedUpdate = sortUpdate(numbers);
            const middleIndex = Math.floor(sortedUpdate.length / 2);
            sum += sortedUpdate[middleIndex];
        }
    });

    return sum;
};

export const parttwo = sp2(lines);
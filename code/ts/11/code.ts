const input = await Bun.file(`${import.meta.dir}/../../../input/11.txt`).text();

function transformStone(stone: bigint): bigint[] {
    // Rule 1: If stone is 0, replace with 1
    if (stone === 0n) {
        return [1n];
    }

    // Rule 2: If stone has even number of digits, split it
    const digits = stone.toString();
    if (digits.length % 2 === 0) {
        const mid = Math.floor(digits.length / 2);
        const leftHalf = BigInt(digits.slice(0, mid));
        const rightHalf = BigInt(digits.slice(mid));
        return [leftHalf, rightHalf];
    }

    // Rule 3: Multiply by 2024
    return [stone * 2024n];
}

function countStonesAfterBlinks(initialStones: number[], totalBlinks: number): number {
    // Use string keys for BigInt values to avoid any potential issues with Map keys
    let stoneMap = new Map<string, number>();
    
    // Initialize with BigInt values
    for (const stone of initialStones) {
        const stoneBig = BigInt(stone).toString();
        stoneMap.set(stoneBig, (stoneMap.get(stoneBig) || 0) + 1);
    }

    // Process each blink
    for (let blink = 0; blink < totalBlinks; blink++) {
        const newStoneMap = new Map<string, number>();
        
        // Process each unique stone
        for (const [stone, count] of stoneMap.entries()) {
            const transformed = transformStone(BigInt(stone));
            
            // Add transformed stones to new map
            for (const newStone of transformed) {
                const newStoneStr = newStone.toString();
                newStoneMap.set(
                    newStoneStr, 
                    (newStoneMap.get(newStoneStr) || 0) + count
                );
            }
        }
        
        stoneMap = newStoneMap;
    }

    // Calculate final total
    return Array.from(stoneMap.values()).reduce((sum, count) => sum + count, 0);
}

export const sp1 = (input: string) => {
    const stones = input.trim().split(/\s+/).map(Number);
    return countStonesAfterBlinks(stones, 25);
};

export const sp2 = (input: string) => {
    const stones = input.trim().split(/\s+/).map(Number);
    return countStonesAfterBlinks(stones, 75);
};

export const partone = sp1(input);
export const parttwo = sp2(input);

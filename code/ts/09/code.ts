const input = await Bun.file(`${import.meta.dir}/../../../input/9.txt`).text();

interface Block {
    id: number;
    size: number;
}

function parseInput(input: string): {files: Block[], spaces: number[]} {
    const numbers = input.trim().split('').map(Number);
    const files: Block[] = [];
    const spaces: number[] = [];
    
    let fileId = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (i % 2 === 0) {
            files.push({ id: fileId++, size: numbers[i] });
        } else {
            spaces.push(numbers[i]);
        }
    }
    
    return { files, spaces };
}

interface DiskState {
    blocks: (number | null)[]; // null represents free space
}

function createInitialDiskState(files: Block[], spaces: number[]): DiskState {
    const blocks: (number | null)[] = [];
    let position = 0;
    
    for (let i = 0; i < files.length; i++) {
        // Add file blocks
        for (let j = 0; j < files[i].size; j++) {
            blocks[position++] = files[i].id;
        }
        
        // Add free space
        if (i < spaces.length) {
            for (let j = 0; j < spaces[i]; j++) {
                blocks[position++] = null;
            }
        }
    }
    
    return { blocks };
}

function compactDisk(state: DiskState): DiskState {
    const blocks = [...state.blocks];
    
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i] !== null) {
            // Find leftmost free space
            const freeSpaceIndex = blocks.findIndex(b => b === null);
            if (freeSpaceIndex === -1 || freeSpaceIndex > i) break;
            
            // Move block to free space
            blocks[freeSpaceIndex] = blocks[i];
            blocks[i] = null;
        }
    }
    
    return { blocks };
}

function calculateChecksum(state: DiskState) {
    return state.blocks.reduce((sum: number, block, position) => {
        if (block !== null) {
            return sum + (position * block);
        }
        return sum;
    }, 0 as number);
}

export const sp1 = (input: string) => {
    const { files, spaces } = parseInput(input);
    const initialState = createInitialDiskState(files, spaces);
    const compactedState = compactDisk(initialState);
    const checksum = calculateChecksum(compactedState);
    
    return checksum?.toString();
};

export const partone = sp1(input);

function findLeftmostFreeSpace(blocks: (number | null)[], size: number): number {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] === null) {
            // Check if we have enough consecutive free space
            let freeCount = 0;
            for (let j = i; j < blocks.length && blocks[j] === null; j++) {
                freeCount++;
            }
            if (freeCount >= size) return i;
        }
    }
    return -1;
}

function compactDiskWholeFiles(state: DiskState, files: Block[]): DiskState {
    const blocks = [...state.blocks];
    
    // Sort files by ID in descending order
    const sortedFiles = [...files].sort((a, b) => b.id - a.id);
    
    for (const file of sortedFiles) {
        // Find file's current position
        const fileStart = blocks.findIndex(b => b === file.id);
        if (fileStart === -1) continue;
        
        // Find leftmost suitable free space
        const targetStart = findLeftmostFreeSpace(blocks, file.size);
        if (targetStart === -1 || targetStart >= fileStart) continue;
        
        // Move the whole file
        for (let i = 0; i < file.size; i++) {
            blocks[targetStart + i] = file.id;
            blocks[fileStart + i] = null;
        }
    }
    
    return { blocks };
}

export const sp2 = (input: string): string => {
    const { files, spaces } = parseInput(input);
    const initialState = createInitialDiskState(files, spaces);
    const compactedState = compactDiskWholeFiles(initialState, files);
    const checksum = calculateChecksum(compactedState);
    
    return checksum.toString();
};

export const parttwo = sp2(input);

const input = await Bun.file(`${import.meta.dir}/../../../input/14.txt`).text();

export type Position = [row: number, column: number];

const lineRegex = /p=(?<px>\d+),(?<py>\d+)\sv=(?<vx>-?\d+),(?<vy>-?\d+)/gm;

type Robot = {
  position: Position;
  velocity: Position;
};

const evolve = (
  robotsPositionsAndVelocities: Robot[],
  width: number,
  height: number,
  iterations: number,
  checkForChrismasTree: (
    currentPosition: Robot[],
    width: number,
    height: number,
  ) => boolean,
) => {
  let currentIteration = 1;
  let currentPositions = robotsPositionsAndVelocities;
  let firstChrismaTreeIteration = 0;

  do {
    const newPositions = currentPositions.map((robot) => {
      const [px, py] = robot.position;
      const [vx, vy] = robot.velocity;

      const npx = px + vx;
      const npy = py + vy;

      let nnpx;
      let nnpy;

      if (npx < 0) {
        nnpx = height + npx;
      } else if (npx >= height) {
        nnpx = npx % height;
      } else {
        nnpx = npx;
      }

      if (npy < 0) {
        nnpy = width + npy;
      } else if (npy >= width) {
        nnpy = npy % width;
      } else {
        nnpy = npy;
      }

      return {
        position: [nnpx, nnpy],
        velocity: [vx, vy],
      } satisfies Robot;
    });

    if (firstChrismaTreeIteration === 0) {
      const result = checkForChrismasTree(newPositions, width, height);

      if (result) {
        firstChrismaTreeIteration = currentIteration;
      }
    }

    currentPositions = newPositions;
    currentIteration++;
  } while (currentIteration <= iterations);

  return [currentPositions, firstChrismaTreeIteration] as const;
};

const testForChristmasTree = (
  positions: Robot[],
  width: number,
  height: number,
) => {
  const array = Array.from({ length: height }, () => {
    return Array.from({ length: width }, () => ".");
  });

  positions.forEach((robot) => {
    const [px, py] = robot.position;
    array[px][py] = "#";
  });

  return array.some((row) => row.join("").includes("############"));
};

const getDimensions = (
  robotsPositionsAndVelocities: {
    position: [number, number];
    velocity: [number, number];
  }[],
) => {
  const { width, height } = robotsPositionsAndVelocities.reduce(
    (acc, robot) => {
      const [px, py] = robot.position;

      if (px > acc.height) {
        acc.height = px;
      }

      if (py > acc.width) {
        acc.width = py;
      }

      return acc;
    },
    { width: 0, height: 0 },
  );

  return { width: width + 1, height: height + 1 };
};

export const sp1 = (input: string[]): number | bigint => {
  const robotsPositionsAndVelocities = input.map((line) => {
    const all = [...line.matchAll(lineRegex)][0];
    const { px, py, vx, vy } = all.groups!;

    return {
      position: [Number(py), Number(px)],
      velocity: [Number(vy), Number(vx)],
    } satisfies Robot;
  });

  const { width, height } = getDimensions(robotsPositionsAndVelocities);

  const [finalPositions] = evolve(
    robotsPositionsAndVelocities,
    width,
    height,
    100,
    testForChristmasTree,
  );

  const middleHeight = Math.floor(height / 2);
  const middleWidth = Math.floor(width / 2);

  const firstQuadrant = finalPositions.filter((robot) => {
    const [px, py] = robot.position;
    return px < middleHeight && py < middleWidth;
  });

  const secondQuadrant = finalPositions.filter((robot) => {
    const [px, py] = robot.position;
    return px < middleHeight && py > middleWidth;
  });

  const thirdQuadrant = finalPositions.filter((robot) => {
    const [px, py] = robot.position;
    return px > middleHeight && py < middleWidth;
  });

  const fourthQuadrant = finalPositions.filter((robot) => {
    const [px, py] = robot.position;
    return px > middleHeight && py > middleWidth;
  });

  const quadrantsSizes = [
    firstQuadrant.length,
    secondQuadrant.length,
    thirdQuadrant.length,
    fourthQuadrant.length,
  ];

  return quadrantsSizes.reduce((acc, curr) => acc * curr);
};

export const partone = sp1(input.split("\n"));

export const sp2 = (input: string[]): number | bigint => {
  const robotsPositionsAndVelocities = input.map((line) => {
    const all = [...line.matchAll(lineRegex)][0];
    const { px, py, vx, vy } = all.groups!;

    return {
      position: [Number(py), Number(px)],
      velocity: [Number(vy), Number(vx)],
    } satisfies Robot;
  });

  const { width, height } = getDimensions(robotsPositionsAndVelocities);

  const [_, chrismatTreeSeconds] = evolve(
    robotsPositionsAndVelocities,
    width,
    height,
    10_000,
    testForChristmasTree,
  );

  return chrismatTreeSeconds;
};

export const parttwo = sp2(input.split("\n"));
#![allow(
    clippy::must_use_candidate,
    clippy::missing_panics_doc,
    clippy::cast_lossless
)]

pub fn part1(_input: &str) -> u32 {
    0
}

pub fn part2(_input: &str) -> u32 {
    0
}

pub fn main() {
    let input = std::fs::read_to_string("../../input/1.txt").expect("Input file not found");
    println!("Part 1 : {}", part1(&input));
    println!("Part 2 : {}", part2(&input));
}

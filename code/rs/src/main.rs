#![allow(clippy::must_use_candidate, clippy::missing_panics_doc)]

#[allow(clippy::wildcard_imports)]
use aoc_20xx::*;

fn main() {
    let mains = [
        d1::main,
    ];

    let now = std::time::Instant::now();

    for (day, main) in mains.iter().enumerate() {
        println!("-- Day {} --", day + 1);
        main();
        println!();
    }

    println!("Execution time: {:?}\n", now.elapsed());
}

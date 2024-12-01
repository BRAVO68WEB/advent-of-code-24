#!/bin/bash
day=$(date +%d)
echo $day
ls
cd ts && mkdir -p $day && cd $day && bun init -y
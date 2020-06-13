---
layout: project
type: project
image: images/cache-simulator/cache-simulator.png
title: Cache and Memory Hierarchy Simulator
permalink: projects/cache-simulator
# All dates must be YYYY-MM-DD format!
date: 2019-10-03
labels:
  - C++
  - Microprocessor Architecture
  - Cache
summary: A flexible cache and memory hierarchy simulator built to study impact of design parameters on memory performance.
---
 
The main memory in modern computers is optimized for density (cost), not speed. It is large and retains lots of data but is slow when compared to today's processors. A cache is a small, interim, fast storage component which can be combined with large slow memory to provide the appearance of a large fast memory at low cost.

The simulator was developed to study impact of various design parameters on overall performance of memory hierarchy. It is configurable in terms of cache size, associativity, and block size which are specified at the beginning of simulation.

## Configurable Parameters
* Number of bytes in a block.
* Size and associativity of L1 cache.
* Size and associativity of L2 cache.
* Number of address tags and number of data blocks in a sector when using L2 as a decoupled sectored cache.
* Path to input trace file.

## Simulation Output
<img class="ui large rounded image" src="/images/cache-simulator/simulation-results-sample.png" alt="Simulation Results Screenshot">

## Observations
<img class="ui large rounded image" src="/images/cache-simulator/cache-size-vs-miss-rate.png" alt="Cache Size vs Miss Rate">
Increasing cache size reduces miss rate till a certain point, increasing it further yields diminishing returns.

<img class="ui large rounded image" src="/images/cache-simulator/associativity-vs-miss-rate.png" alt="Associativity vs Miss Rate">
Increasing associativity reduces miss rate till a certain point, increasing it further yields diminishing returns.

<img class="ui large rounded image" src="/images/cache-simulator/cache-size-vs-average-access-time.png" alt="Cache Size vs Average Access Time">
Increasing cache size reduces the average access time till a certain point after which it starts to increase again.
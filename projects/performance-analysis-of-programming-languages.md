---
layout: project
type: project
image: images/performance-analysis-of-programming-languages/language-logos.png
title: Performance Analysis of Languages on Raspberry Pi
permalink: projects/performance-analysis-of-programming-languages
# All dates must be YYYY-MM-DD format!
date: 2020-01-28
labels:
  - Python
  - Raspberry Pi
  - Linux
summary: Compared runtime of N-body gravitational simulator (5,000,000 iterations) when implemented in different programming languages.
published: false
---

Compared runtime of N-body (gravitational interaction of planets) benchmark implemented in different programming languages (C/C++, C++11, Haskell, Python, Java). All the benchmarks use five million iterations of same algorithm and differ only in terms of the language used to write the program. 

## Hardware Configuration
The benchmarks were run on Raspberry Pi 4 Model B Rev 1.1, Rev c03111 with 4 GB ram. The single board computer was run in headless mode, without case and heatsink.

## Run-Time Performance
The total execution time of each benchmark was recorded with the governor in on-demand, performance, and powersave modes.

| Language |     Type     | On-Demand | Performance | Powersave  |
|----------|--------------|-----------|-------------|------------|
| C/C++    | Compiled     |    1.759s |      1.743s |     4.362s |
| C++11    | Compiled     |    1.524s |      1.513s |     3.782s |
| Haskell  | Compiled     |    2.658s |      2.649s |     6.663s |
| Java     | Just-In-Time |    2.885s |      2.453s |     6.063s |
| Python   | Interpreted  |  158.393s |    158.263s |   401.476s |
{: class="ui basic compact table"}

## Monitoring CPU Frequency and Temperature
An additional program was written using python and matplotlib to measure CPU frequency and Temperature while the benchmarks ran. This was also used to check whether the CPU thermal throttled in any benchmark.

### Python benchmark with performance governor
<img class="ui large rounded image" src="/images/performance-analysis-of-programming-languages/frequency-temperature-python-performance.png" alt="CPU frequency and temperature during Python benchmark | Governor Performance">
The benchmark started at 48s mark and ran for 158.26 seconds.

### C/C++ benchmarks with performance governor 
<img class="ui large rounded image" src="/images/performance-analysis-of-programming-languages/frequency-temperature-C++-performance.png" alt="CPU frequency and temperature during C++ benchmark | Governor Performance">
CPU frequency is fixed at 1.5 GHz. The benchmark started at 17.5s mark and ran for 1.74 seconds.

### C/C++ benchmarks with on-demand governor
<img class="ui large rounded image" src="/images/performance-analysis-of-programming-languages/frequency-temperature-C++-on-demand.png" alt="CPU frequency and temperature during C++ benchmark | Governor On-Demand">
CPU frequency is dynamic and is adjusted based on utilization.

### C/C++ benchmarks with powersave governor
<img class="ui large rounded image" src="/images/performance-analysis-of-programming-languages/frequency-temperature-C++-powersave.png" alt="CPU frequency and temperature during C++ benchmark | Governor Powersave">
CPU frequency is fixed at 600 MHz.

## Observations
1. The thermal limit of Raspberry Pi 4 is 85°C. As our tests never approached this limit, the benchmarks did not throttle.
2. Compiled code runs much faster than interpretted code.

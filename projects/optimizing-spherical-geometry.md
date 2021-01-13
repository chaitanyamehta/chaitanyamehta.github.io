---
layout: project
type: project
image: images/optimizing-spherical-geometry/spherical-geometry.png
title: Optimizing Linux based Embedded System
permalink: projects/optimizing-spherical-geometry
# All dates must be YYYY-MM-DD format!
date: 2020-09-04
labels:
  - C
  - Perf
  - Embedded Systems
  - Linux
summary: Achieved a 5.2X improvement in speed of C program that computes the nearest waypoint (weather station) to a location.
---

Spherical geometry code finds the nearest waypoint to the entered location from a list of waypoints, by using trigonometric functions to calculate distance and bearing angle between points.

The aim of this project was to reduce execution time of program by using trignometric approximation instead of standard library function. 
Application was profiled using perf and appropriate optimizations were applied to acheive a speed up of 5.2X.

## Accuracy table for approximations

### Original code

| Approximation used | # of distance errors     | # of bearing errors | # of waypoint name errors |
|--------------------|--------------------------|---------------------|---------------------------|
| cos_32             | 1024                     | 286                 | 6                         |
| cos_52             | 94                       | 3                   | 0                         |
| cos_73             | 37                       | 0                   | 0                         |
| cos_121            | 0                        | 0                   | 0                         |
{: class="ui basic compact table"}

### Optimized code

| Approximation used | # of distance errors     | # of bearing errors | # of waypoint name errors |
|--------------------|--------------------------|---------------------|---------------------------|
| cos_32             | 1024                     | 286                 | 6                         |
| cos_52             | 93                       | 3                   | 0                         |
| cos_73             | 37                       | 0                   | 0                         |
| cos_121            | 0                        | 0                   | 0                         |
{: class="ui basic compact table"}

## Run-time performance

### Original code

| Cosine function used | Program execution time | Ex. time for single call to Find Nearest Waypoint | Cycles per point |
|----------------------|------------------------|---------------------------------------------------|------------------|
| library              | 1268544477 ns          | 12.685 µs                                         | 116.737          |
| cos_32               | 1678266346 ns          | 16.782 µs                                         | 154.441          |
| cos_52               | 1732018856 ns          | 17.320 µs                                         | 159.388          |
| cos_73               | 1766489441 ns          | 17.664 µs                                         | 162.560          |
| cos_121              | 1938057308 ns          | 19.380 µs                                         | 178.348          |
{: class="ui basic compact table"}

### Optimized code

| Cosine function used | Program execution time | Ex. time for single call to Find Nearest Waypoint | Cycles per point |
|----------------------|------------------------|---------------------------------------------------|------------------|
| library              | 721200217 ns           | 7.212 µs                                          | 66.368           |
| cos_32               | 209287463 ns           | 2.093 µs                                          | 19.259           |
| cos_52               | 241992516 ns           | 2.420 µs                                          | 22.269           |
| cos_73               | 319922738 ns           | 3.199 µs                                          | 29.440           |
| cos_121              | 394043721 ns           | 3.940 µs                                          | 36.261           |
{: class="ui basic compact table"}

### Perf report before applying optimizations

<div class="ui big rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-load-store/report-before.png" alt="perf report before optimizations">
</div>

### Perf report after applying optimizations

<div class="ui big rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/strcmp/report-after.png" alt="perf report after optimizations">
</div>

* Initial program run time: 1732.018856 ms
* Program run time of optimized code: 242.054610 ms (2.420 μs per test)

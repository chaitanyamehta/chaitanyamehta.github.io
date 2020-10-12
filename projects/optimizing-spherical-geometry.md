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

## Optimizations applied
### Remove unnecessary loads and stores using compiler optimizations (-Og)

Perf report and annotate before applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-load-store/report-before.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-load-store/annotate-before.png" alt="perf annotate">
</div>

Here we can see that cos_52 has the highest execution time. Annotating the function reveals that most of the time is consumed by stores and loads. R3 is stored at location [fp, #-8] and then the subsequent location is a load from the same location. These loads and stores can be reduced by performing memory to register promotion. Selecting -Og removes these loads and stores and promotes memory locations to register.

Note: -Og optimizes for debugging experience rather than speed or time. Generated source code is easy to understand and further optimize. I switched it to -O3 later.

Perf report and annotate after applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-load-store/report-after.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-load-store/annotate-after.png" alt="perf annotate">
</div>

cos_52 still has the highest sample count, but the number of loads and stores have reduced significantly.
* Initial program run time: 1732.018856 ms
* Program run time of optimized code: 855.369088 ms

### Using Single precision operations instead of Double precision operations

Perf report and annotate before applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/single-precision/report-before.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/single-precision/annotate-before.png" alt="perf annotate">
</div>

In the annotate profile we can see vector convert (vcvt) operations from f64 to f32 and f32 to f64.Function fmod requires 
double precision inputs and returns double precision values. The variable x which is passed to this function and later used 
to store return value is of single precision type. Replacing fmod with fmodf should remove these operations.

Besides this double precision constants were changes to single precision constants.

Perf report and annotate after applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/single-precision/report-after.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/single-precision/annotate-after.png" alt="perf annotate">
</div>

In the after screenshots we can see that vector converts (vcvt) are no longer present.
* Initial program run time: 855.369088 ms
* Program run time of optimized code: 765.864663 ms

### Replace <code>If(x<0)x =-x;</code> with a faster operation

Perf report and annotate before applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/fabsf/report-before.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/fabsf/annotate-before.png" alt="perf annotate">
</div>

The code <code>If(x<0)x =-x;</code> results in a compare operation followed by a branch and negate instruction (vneg).
This line can be replaced with <code>x = fabsf(x)</code> which should result in much less instructions.

Perf report and annotate after applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/fabsf/report-after.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/fabsf/annotate-after.png" alt="perf annotate">
</div>

As predicted the compare, branch and negate instructions are replaced with a single fabsf instruction.
*	Initial program run time: 765.864663 ms
*	Program run time of optimized code: 705.022373 ms

## Reduce calls to fmodf

Perf report and annotate before applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-fmodf/report-before.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-fmodf/annotate-before.png" alt="perf annotate">
</div>

```c
# before
x=fmodf(x, twopi_sp);       // Get rid of values > 2* pi
x=fabsf(x);                 // cos(-x) = cos(x)
```

```c
# after
x=fabsf(x);                   // cos(-x) = cos(x)
if (x>twopi_sp)
  x=fmodf(x, twopi_sp);       // Get rid of values > 2* pi
```

Perf report and annotate after applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-fmodf/report-after.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/reduce-fmodf/annotate-after.png" alt="perf annotate">
</div>

Looking at the after report, we can see there are no __fmodf samples.
*	Initial program run time: 694.875962 ms
*	Program run time of optimized code: 510.166922 ms

## Replace SWITCH in cos_52 with IF ELSE

Perf report and annotate before applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/replace-switch-case/report-after.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/replace-switch-case/annotate-after.png" alt="perf annotate">
</div>

After applying all previous optimizations cos_52 still has the highest sample count. Annotating this function reveals LDRLS 
(load routine address into PC) to be its hottest instruction. Load instructions have a latency of 4 cycles, in addition if 
PC is the destination, it results in a ‘Branch form’ which has an added latency of 2 cycles.

Switch case results in a load instruction whose destination register is PC. We can replace this with a set of If-Else 
statements and check if it results in any improvement. While we do this, we can also remove multiply code to calculate 
quadrant and write if logic to compare 'x' directly with a float value.

Perf report and annotate after applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/replace-switch-case/report-before.png" alt="perf report">
  <img class="ui image" src="/images/optimizing-spherical-geometry/replace-switch-case/annotate-before.png" alt="perf annotate">
</div>

The sample count of cos_52 reduced drastically.
* Initial program run time: 510.166922 ms
* Program run time of optimized code: 470.900758 ms

## Change while loop condition to <code>i < NUM_OF_WAYPOINTS</code>

Perf report before applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/strcmp/report-before.png" alt="perf annotate">
</div>

Function strcmp has 5.44% samples, the length of waypoints is fixed, so we can remove strcmp from while loop and add a condition 
to loop till the time variable 'i' is less than waypoint length.

Perf report after applying optimizations.
<div class="ui medium rounded images">
  <img class="ui image" src="/images/optimizing-spherical-geometry/strcmp/report-after.png" alt="perf report">
</div>

*	Initial program run time: 470.900758 ms
*	Program run time of optimized code: 388.821369 ms

## Change compiler flag to -O3 and remove -ggdb
* Initial program run time: 388.821369 ms
* Program run time of optimized code: 242.054610 ms (2.420 μs per test)

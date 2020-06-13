---
layout: project
type: project
image: images/optimizing-jpeg-decoder-for-speed/jpeg-decoder.jpg
title: Optimizing JPEG Decoder for Speed
permalink: projects/optimizing-jpeg-decoder
# All dates must be YYYY-MM-DD format!
date: 2020-03-06
labels:
  - C
  - Embedded Systems
  - picoJPEG
  - Cortex M0+
summary: Achieved 4.8x improvement in execution time of program which decodes and displays on LCD all jpeg images in the root directory of a μSD card.
---
<div class="ui small rounded images">
  <img class="ui image" src="/images/optimizing-jpeg-decoder-for-speed/profile-before.jpg" alt="Profile Before Optimization">
  <img class="ui image" src="/images/optimizing-jpeg-decoder-for-speed/profile-after.jpg" alt="Profile After Optimization">
</div>

The goal of this project was to reduce execution time of a program which reads JPEG images from the root directory of μSD card (formatted as FAT32), decodes them and then displays the image on 320x240 pixel LCD.

The program includes three major components:
1. picoJPEG to decode images
2. PetitFatFS to navigate file system
3. uLibSD to communicate with SD card over SPI.

The program also includes a built in profiler which uses Periodic Interval Timer to take one sample every micro second.

The following optimiaztions were made:
1. Configure SPI to run at maximum possible baud rate.
2. Add pre processor directives to disable GPIO debug pin when not debugging.
3. Use fast GPIO instead of normal GPIO.
4. Cache last sector read from μSD card. 
5. Reduced if and switch branches by using calculative mathematical expression wherever possible.
6. Selecting -O3 -OTime compiler arguments.
7. Improved Huffman decode logic by processing two bits at a time instead of one bit at a time.

| Code Version | Samples before Optimization | Samples after Optimization | Improvement | Cumulative Improvement |
|--------------|-----------------------------|----------------------------|-------------|------------------------|
|            1 |                       38300 |                      16608 |         2.3 |                    2.3 |
|            2 |                       16608 |                      14929 |        1.11 |                   2.55 |
|            3 |                       14929 |                      14528 |        1.03 |                   2.63 |
|            4 |                       14528 |                      12822 |        1.13 |                   2.98 |
|            5 |                       12822 |                      11033 |        1.16 |                   3.46 |
|            6 |                       11033 |                       8446 |         1.3 |                   4.53 |
|            7 |                        8446 |                       7932 |        1.06 |                   4.83 |
{: class="ui basic compact table"}
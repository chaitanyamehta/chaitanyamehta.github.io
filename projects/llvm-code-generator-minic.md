---
layout: project
type: project
image: images/llvm-code-generator-minic/compiler.png
title: LLVM Code Generator for Mini C
permalink: projects/llvm-code-generator-minic
# All dates must be YYYY-MM-DD format!
date: 2020-03-17
labels:
  - C++
  - LLVM
  - Compiler
  - Lexer
  - Parser
summary: "LLVM bitcode generator for a subset of the C programming language using parser generators: Flex & Bison."
---

This project is based on a subset of the C programming language called Mini C. Most programs in Mini C can be interpreted as having the same meaning they would have in C.

## Supported Features
1. Mini C supports three declared types int, int * and void.
  * void may be only used with functions, which have a void return type.
  * There are no explicitly declared arrays, however pointers may be used as  base address of arrays.
2. Each source file supports global variables and multiple function declarations.
  * Functions may have parameters and local variables.
  * Variables are declared on a line by itself and may optionally be  initialized.
  * Functions may call other functions, including themselves.
3. Relational operators (!=, ==, <=, <, >, >=) produce a single bit Boolean  value.
4. Control flow statements include if-then-else, switch-case, while, do-while,  for, break and continue.
  * if always has a matching else.
  * Statement’s may be arbitrarily nested.
5. Pointer and operations on pointers, like dereferencing (*) and address-of (&).
  * Implicit conversion between integer and pointer types is not allowed. The  programmer must explicitly perform type conversions in the source code.

## How it works
The code generator takes Mini C source file as input and creates an LLVM bitcode file using parser generators written using Flex & Bison. This bitcode (LLVM IR) can then be compiled into an executable using LLVM static compiler.

{::options parse_block_html="true" /}
<div class="ui segment">
### Input File
```c
int max(int x, int y)
{
  int ret;	
  if (x > y)
    ret = x;
  else
    ret = y;
  return ret;
}
```
### Generated LLVM IR
```llvm
define i64 @max(i64, i64) {
entry:
  %2 = alloca i64
  store i64 %0, i64* %2
  %3 = alloca i64
  store i64 %1, i64* %3
  %ret = alloca i64
  %4 = load i64, i64* %2
  %5 = load i64, i64* %3
  %6 = icmp sgt i64 %4, %5
  br i1 %6, label %if.then, label %if.else

if.then:                                          ; preds = %entry
  %7 = load i64, i64* %2
  store i64 %7, i64* %ret
  br label %if.join

if.else:                                          ; preds = %entry
  %8 = load i64, i64* %3
  store i64 %8, i64* %ret
  br label %if.join

if.join:                                          ; preds = %if.else, %if.then
  %9 = load i64, i64* %ret
  ret i64 %9
}
```
</div>
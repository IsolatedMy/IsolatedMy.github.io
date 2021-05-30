---
title: cmake笔记
comments: true
mathjax: true
layout: articles
toc: true
tags: ["cmake", "note"]
---

这篇文章记录的在CMake学习以及运用过程中遇到的问题，并记录在网上找到的解决方案。

<!--more-->

使用的**CMake版本**: 3.16.3

#### No package 'uuid' found

解决办法：执行`sudo apt-get install uuid`安装uuid包，再不行的话执行`sudo apt-get install uuid-dev`包（虽然我感觉这与CMake无关）。`uuid`的源码安装参考[博客](https://blog.csdn.net/weixin_37569048/article/details/82867552)。


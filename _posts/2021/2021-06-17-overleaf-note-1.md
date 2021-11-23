---
title: 从零开始在overleaf上写latex(二)
comments: true
mathjax: true
layout: articles
toc: true
tags: ["latex", "note"]

---

这篇文章记录的是使用latex过程中遇到的问题。下面所使用的编译器无特别说明都是`pdfLatex`。

<!--more-->

#### [Tips]Texlive安装

Mac用户可以到[清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/mac/mactex/)上下载。

#### [Tips]为数学公式增加颜色

需要在公式中插入带有颜色的符号。在网上查找到的使用`\color{}{}`的方法，但是这个方法存在下面的问题：

+ 使用时，需要通过`{\color{red}{<text>}}`的方法将`<text>`染色的同时避免将其他部分染色；
+ 在我的使用例中，由于是对下标中的某个元素着色，这一指令导致染色部分的后面的排版出现问题；

之后发现将`\color`指令替换成`\textcolor`指令即可。


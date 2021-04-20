---
title: 从零开始在overleaf上写latex(一)
comments: true
mathjax: true
layout: articles
toc: true
tags: ["overleaf", "latex"]
---

这篇文章记录的是在overleaf上写latex时，我作为一个latex新手遇到的问题。

<!--more-->

#### 页面大小和页面边距

默认页面大小为A4纸。如果想要其他的页面大小，只需要在`\document[]{}`的`[]`中填入需要的页面大小。除此之外，在`[]`内还能够设置文档的字体大小。

```latex
% default size(A4)
\documentclass[]{article}
% self-defined size
\documentclass[a5paper]{article}
% font size
\documentclass[10pt, a5paper]{article}
```

需要使用geometry宏包以自由设置页面属性。该宏包可以让我们自由设置上下左右的页面边距。其中left, right, top, bottom分别代表左右上下的页面边距。

```latex
\geometry{left=3.0cm, right=2.0cm, top=2.5cm, bottom=2.5cm}
```

#### 数学符号

在使用如下公式时，XeLatex产生错误`Undefined control sequence`。大意是编译器无法理解使用的某些指令，问题出在`\mathbb`指令上

```latex
$\alpha, \beta \in \mathbb{C}$
```

在添加了`\usepackage{amsfonts}`指令导入`amsfonts`包后问题解决

#### 导入图片

在导入图片时，XeLatex产生错误`Undefined control sequence`。这次问题出在`\includegraphics`：

```latex
\begin{figure}
	\centering
	\includegraphics[scale=0.4]{1.png}
	\caption{The display of one simple example}
\end{figure}
```

如果想要使用`includegraphics`指令， 需要导入`graphics`包。需要注意的是，如果这里选择导入的是`graphicx`包，会导致出现`Runaway Argumnent?`错误。

#### 图片无法显示

在导入图片时，在图片路径正确的情况下出现图片无法展示而只是展示了路径的字符串的问题：

<div align=center><img src="{{ site.baseurl }}/assets/images/2021/overleaf-1.png" style="zoom:100%"></div>

此时需要检查overleaf是否处于`draft`模式下，需要检查的地方有两点：

1. 检查Overleaf的编译模式是否是在Fast[draft]下，这一点参考[官方网站](https://www.overleaf.com/learn/how-to/Images_not_showing_up)；
2. 检查文档的定义是否添加了[draft]选项。我遇到的情况是`\documentclass[drast]{example}`，在删去[draft]后，图片就能够正常显示了。

#### 算法缩进出现问题

这个问题是在pdfLatex下出现的，相同的代码在XeLatex下不会出现问题。问题如下所示，算法的缩进产生了问题。

<div align=center><img src="{{ site.baseurl }}/assets/images/2021/overleaf-2.png" style="zoom:100%"></div>

[论坛](https://tex.stackexchange.com/questions/126279/indentation-missing-for-algorithm-package-in-documentclassminimal)中也有人出现了相同的问题，虽然问题的产生原因看起来与我的并不相同（我的documentclass是导入外部cls文件获得的）。其将下面语句设置为默认：

```latex
\setlength{\skiptext}{10pt}
\setlength{\skiprule}{5pt}
```

但是利用它的方法可以修复这个问题

<div align=center><img src="{{ site.baseurl }}/assets/images/2021/overleaf-3.png" style="zoom:120%"></div>

但随之产生的新的问题是，在双栏环境下代码有可能会超出当前所在栏的边界。为了知道修改的量是什么去搜索这些量但是得到的搜索结果少的可怜，而且大部分都与此无关。

#### 表格制作

由于生成的表格内容过多，利用[Excel2Latex项目](https://github.com/krlmlr/Excel2LaTeX)提供的工具直接将表格转换成了latex格式，但是在使用时对于其中使用到的`\midrule`和`\rowcolor`指令会产生`Undefined control sequence`错误。其中`\midrule`指令产生的错误可以通过使用包`booktabs`解决，即使用指令`\usepackage{booktabs}`。而虽然查找到的导入`\rowcolor`指令的方法是`\usepackage[table]{xcolor}`，但是在使用时一直会产生`option clash for package xcolor`的问题。最后，找到[有人提到](https://tex.stackexchange.com/questions/74921/how-to-resolve-option-clash-for-package-xcolor)使用包`colortbl`即可解决`\rowcolor`指令产生的问题。

#### 首行缩进

跟在`\section`或者`\subsection`等命令后的第一段文字不会缩进。这一点的解决办法参考了[博客](https://blog.csdn.net/MineralterMan/article/details/8832782)。在文档的导言区添加：

```latex
\usepackage{identfirst}
\setlength{\parindent}{2em}
```

从而实现首段内容2个字符缩进。
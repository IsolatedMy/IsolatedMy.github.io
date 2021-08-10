---
title: python学习笔记
comments: true
mathjax: true
layout: articles
toc: true
tags: ["python", "note"]
---

之前利用shell都是利用的可执行程序批量处理文件，但是如果使用shell处理字符串或者保存变量会比较麻烦。所以想在python中直接完成功能实现以及批量处理。下面是我不会的部分所需python功能，在此记录以作备忘：

<!--more-->

使用**Python版本**：3.8.3

#### 逐行读取文件

参考的是[python逐行读取文件内容的三种方法](https://blog.csdn.net/zhengxiangwen/article/details/55148287)。第一种方法是利用变量保存文件对象：

```python
f = open("foo.txt")			# 返回一个文件对象
line = f.readline() 		# 调用文件的 readline() 方法
while line:
	print(line)
	line = f.readline()
f.close()
```

第二种方法，直接将返回的内容直接使用：

```python
for line in open("foo.txt"):
	print(line)
```

其余方法请参考原博客。如果是多次访问同一文件，采用第一种方法的需要注意将文件指针重新指向开头。具体方法是使用

```python
f.seek(0)
```

#### 命令行参数调用

利用`sys`包中的`argv`变量：

```python
import sys

if __name__ = '__main__':
  main(sys.argv)
```




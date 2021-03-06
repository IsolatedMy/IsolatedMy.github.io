---
title: 个人博客搭建(一)
comments: true
mathjax: true
layout: articles
toc: true
tags: ["website", "jekyll", "Mac"]
---

这篇文章的主要目的是记录笔者在搭建博客中遇到的问题，希望能够在之后遇到相关问题时起到帮助。除此之外还充当了备忘录，同时也记录了博客的搭建过程。主要的内容包括jekyll的使用和自身遇到问题的记录。

<!--more-->

本博客搭建并不是利用html+javascript实现，而是基于Jekyll框架搭建。而网站的部署不仅需要网页的源代码，还需要服务器和域名。然而让Github托管网页可以省去这一步骤。

| 工作环境 | 版本 |
| -------- | ---- |
| 操作系统 | MacOS High Sierra 10.13.6 |
| CPU | 2.7 GHz Intel Core i5 |
| 核数 | 2 |
| 内存 | 8 GB 1867 MHz DDR3 |
| 图形卡 | Intel Iris Graphics 6100 1536 MB |


# 准备工作

Github Pages的配置过程在网上有很多，并且包含大量图片。本文并不会介绍相关操作，读者如果感兴趣可以上网查看，或者在参考链接中也有提供相关的博客。

## Jekyll 安装
Jekyll是一个Ruby程序，所以在搭建网站之前，你需要在你的机器上安装Ruby。Jekyll的环境在本地电脑上安装就可以了，不需要部署到服务器，同时也可以在本地调试。写博客的流程是在本地电脑写markdown文件，之后静态编译生成静态web文件(生成的网页一般会保存在/_site/路径下)。将这些文件部署到服务器上的web容器(nginx,tomcat等)运行即可实现将网站上传到网上，在本文中则是利用Github Pages实现。Ruby的安装见参考链接。

安装ruby之后，可以通过在终端运行`gem install jekyll bundle`安装jekyll。

## 静态页面创建

利用jekyll生辰静态页面的方法有两种，推荐第一种方法。第一种方法如下：

在终端执行下列指令，以获取最简单的Jekyll模板以生成静态页面并运行：
```
~ $ jekyll new myblog
~ $ cs myblog
~/myblog $ bundle exec jekylll serve
```
如果你希望把jekyll安装到当前目录，可以运行`jekyll new .`。如果当前目录非空，需要添加`--force`选项，即执行`jekyll new . --force`。

接下来讨论第二种方法。首先执行`bundle init`在当前目录下创建Gemfile；之后修改Gemfile，添加jekyll为新的依赖：
```
gem "jekyll"
```
最后运行`bundle install`为你的项目安装jeykll。

在执行`bundle install`时可能长时间没有反应。这是因为我们在此过程中直接从rubygems.org直接下载gem文件。我们可以将ruby源更换为国内源：

```sh
# 查看gem源
gem sources

# 删除默认的gem源
gem sources --remove https://rubygems.org/

# 添加rubyChina作为gem源
gem sources -a https://gems.ruby-china.org/
```
现在你可以将教程中的所有jekyll指令以`bundle exec`作为前缀，以确保你使用的jekyll版本是你在`Gemfile`中定义的版本（例如`bundle exec jekyll serve`）。

# 基本用法

## jekyll 语句

在创建基本的jekyll文件夹之后，就可以在命令行中使用jekyll语句了：

```sh
$ jekyll build
# => 当前文件夹的内容将会生成到 ./_site 文件夹中

$ jekyll build --destination <destination>
# => 当前文件夹的内容将会生成到目标文件夹<destination>中

$ jekyll build --source <source> --destination <destination>
# => 指定源文件夹<source>中的内容将会生成到目标文件夹<destination>中

$ jekyll build --watch
# => 当前文件夹中的内容将会生成到 ./_site 文件夹中，
#    查看改变，并且自动再生成。
```

​	Jekyll同时也集成了一个开发用的服务器，可以让你使用浏览器在本地进行预览：

```sh
$ jekyll serve
# => 一个开发服务器将会运行在 http://localhost:4000/
# Auto-generation (自动再生成文件)开启。使用`--watch`选项关闭

$ jekyll serve --detach
```

## 博客上传

关于评论系统、访问统计等其他功能可以参考参考链接[4]。接下来介绍如何在网站上显示自己的博客。

博客文章保存在根目录下的`_posts`目录（如果没有需要自己创建）。博客文件的文件名具有一个特殊的格式：发布日期、文章标题加上扩展名。例如，这篇文章的文件名为`2021-02-08-build-my-own-blog.md`。

具体内容可以参考[官网给出的教程](https://jekyllrb.com/docs/step-by-step/08-blogging/)。

## 主题选择

jekyll官网提供了大量的博客模板，可以先挑选一个自己喜欢的模板，并在此基础上修改。需要注意的是某些博客模板可能存在缺少Gemfile等特别的问题，所以在选择时需要额外注意。

## 问题集锦

1. Github Pages的解释器与通常使用的解释器并不相同，通常使用的是Kramdown，这一部分可以通过`_config.yml`中的`markdown`项设置;
2. 如果需要在网页中使用数学公式，需要额外调用Mathjax插件。在_config.yml中添加`mathjax: true`，或者在博客头事项(Front Matter)中设置`mathjax: true`；
3. 修改网站layout应该对`_layout`和`_includes`文件夹下的相应文件做修改，而不是直接修改`_site`下的文件；
4. 本博客的评论区使用的是Disqus。在`_config.yml`文件做相应修改的同时，还需要在`_layouts`文件夹下的html文件中添加代码，该代码在Disqus提供的教程中会提供。此外，如果不能访问外网，Disqus评论栏不会显示；
5. 每次提交之后github上的网页都需要一段时间更新，如果出现问题github会给邮箱发送邮件

参考链接：
1. [TeXt Theme-快速开始](https://tianqi.name/jekyll-TeXt-theme/docs/zh/quick-start)
2. [Jekyll-Quick Start](https://jekyllrb.com/docs/)
3. [基于Jekyll搭建自己的博客系统](http://www.machengyu.net/tech/2019/04/18/how-to-use-jekyll.html)
4. [Github+Jekyll 搭建个人网站详细教程](https://www.jianshu.com/p/9f71e260925d)
5. [ruby镜像源更改以及安装](https://www.jianshu.com/p/879fdfa15ddf)
6. [bundle install无响应问题](https://cj1406942109.github.io/2018/11/17/bundle-install-no-response/)
7. [Github+Jekyll个人博客搭建的小问题](https://jackgittes.github.io/2017/08/28/problems-on-jekyll-blogs/)

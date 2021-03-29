---
title: 有向图上的VF2算法
comments: true
mathjax: true
layout: articles
toc: true
tags: ["algorithm", "c++", "isomorphism"]

---

这篇博客首先简单概括VF2原论文的内容，之后讨论在有向图上如何实现VF2算法。

<!--more-->

## 论文分析

VF2算法原论文A (Sub)Graph Isomorphism Algorithm for Matching Large Graphs中简单提到了算法的设计，但是其中一部分具体内容需要到文章的第一个版本中Performance Evalution of the VF Graph Matching Algorithm找。

### VF2算法

+ 两个图之间$G_1=(N_1,B_1)$和$G_2=(N_2,B_2)$的匹配过程指的是确定映射$M$，使$G_1$中的节点与$G_2$中的节点联系起来，反之亦然；

+ 通常来说，映射$M$以有序对$(n,m)$的集合表示，其中$n\in G_1, m\in G_2$，每个有序对表示$n\in G_1$和$m \in G_2$之间的映射；

+ 匹配过程中的每个状态$s$都可以与一个部分映射解(partial mapping solution)$M(s)$，其中仅包含$M$的一个子集(笔者：所谓的状态空间描述我也不太清楚，根据引用看来应该是人工智能里的方法)；

+ M明确的标记出$G_1$和$G_2$的子图，分别称为$G_1(s)$和$G_2(s)$，通过从$G_1$和$G_2$中仅选择$M(s)$中包含的节点以及连接节点的分支获得。接下来会用$M_1(s),M_2(s)$和$B_1(s),B_2(s)$分别表示$G_1(s)$和$G_2(s)$的节点集以及对应的分支(即边集)。

+ 所谓一致性条件(consistency condition)，指的是与$M(s)$相关联的$G_1(s)$和$G_2(s)$是同构的；

+ 算法引入了一系列用于验证一致性条件的规则。这种方法不仅使得在匹配过程中仅生成满足一致性条件的状态，在过程中还能够通过添加一系列规则(向前k步规则)提前检查在$k$步之后是否一致性状态$s$具有一致性后继实现更深一层的剪枝。所有提及的规则都被称为可行性规则(feasibility rule)；

+ 为了方便起见，定义可行性函数$F(s,n,m)$，如果有序对$(n,m)$添加到状态$s$后满足所有可行性规则，其为真；

+ 对于具有节点属性以及分支属性的输入图，这些属性也必须作为可行性规则的一部分。因此，可行性函数的一般形式如下。其中句法可行性$F_{syn}$(syntactic feasibility)仅依赖于图的结构，语义可行性$F_{sem}$依赖于这些属性：
	$$
	F(s,n,m) = F_{syn}(s,n,m) \wedge F_{sem}(s,n,m)
	$$
	

### 算法流程

下图中给出了算法的简单框架。在初始态$s_0$，映射函数不包含任何组件，即$M(s_0)$为空集。对于每个中间状态，算法会计算节点有序对组成的$P(s)$，作为添加到当前状态的候选集。对于属于$P(s)$的每一个有序对，会根据可行性规则进行评价：如果可行性规则成立即$F(s,n,m)$为真，计算后继状态$s' =s\cup p$，整个过程递归地作用下去。

<img src="{{ site.baseurl }}/assets/images/2021/VF2-1.png" style="zoom:50%">

### P(s)的计算

节点集$T_1^{out}(s)$和$T_2^{out}(s)$分别表示未在部分映射$M(s)$中，但是是从$G_1(s)$和$G_2(s)$开始的分支的目标节点；相似地，节点集$T_1^{in}(s)$和$T_2^{in}(s)$分别表示未在部分映射$M(s)$中，但是是到$G_1(s)$和$G_2(s)$的分支的起点节点。下图展示了一张简单的说明图。

<img src="{{ site.baseurl }}/assets/images/2021/VF2-2.png" style="zoom:50%">

集合$P(s)$的组成有以下几种可能：

+ 由有序节点对$(n,m)$组成，其中$n\in T_1^{out}(s), m \in T_2^{out}(s)$；
+ 如果$T_1^{out}(s)$和$T_2^{out}(s)$其中有一个为空，则由有序节点对$(n,m)$组成，其中$n\in T_1^{in}(s), n\in T_2^{in}(s)$；
+ 在非连通图中，有可能以上集合均为空的。这时考虑选择既不在$G_1(s)$又不在$G_2(s)$中的有序节点对$P^d(s)$

### 可行性规则

#### 句法可行性

文章中针对同构问题提出了五种可行性规则$R_{pred}, R_{succ},R_{in},R_{out}$以及$R_{new}$。前两个规则检查部分解在$M(s)$中添加有序对$(n,m)$之后得到的$M(s')$是否满足一致性条件。剩余的规则用于在搜索树中实现剪枝：$R_{in}$和$R_{out}$在查询过程中向前看一步，而$R_{new}$实现的是向前看两步。因此，句法的可行性函数为：


$$
F_{syn}(s,n,m) = R_{pred} \wedge R_{succ} \wedge R_{in} \wedge R_{out} \wedge R_{new}
$$


给定一个图$G(N,B)$以及节点$n\in N$，$\mathrm{Pred}(G,n)$和$\mathrm{Succ}(G,n)$分别表示包含结点$n$的前驱和后继结点所组成的集合。另外，在下面的定义中，我们会使用集合$T_1(s) = T_1^{in}(s)\cup T_1^{out}(s)$以及$\tilde{N}_1(s) = N_1 - M_1(s) - T_1(s)$。相似地定义$T_2$和$\tilde{N}_2$集合。

以下是子图-图同构问题中五条可行性规则的正式定义(原文中$R_{new}$规则有误，把$n$改成$m$即可)：


$$
\begin{align}
R_{pred} (s,n,m)  \Leftrightarrow & (\forall n'\in M_1(s) \cap \mathrm{Pred}(G_1,n),\exists m'\in \mathrm{Pred}(G_2, m) | (n', m')\in M(s)) \wedge \notag\\
& (\forall m' \in M_2(s) \cap \mathrm{Pred}(G_2,m),\exists n'\in \mathrm{Pred}(G_1,n)| (n',m') \in M(s))\\
R_{succ}(s,n,m) \Leftrightarrow & (\forall n'\in M_1(s) \cap \mathrm{Succ}(G_1, n),\exists m'\in \mathrm{Succ}(G_2,m)|(n',m')\in M(s)) \wedge \notag\\
& (\forall m' \in M_2(s) \cap \mathrm{Succ}(G_2,m),\exists n'\in \mathrm{Succ}(G_1,n)| (n',m') \in M(s))\\
R_{in}(s,n,m)\Leftrightarrow & (\mathrm{Card}(\mathrm{Succ}(G_1,n) \cap T_1^{in}(s))\ge \mathrm{Card}(\mathrm{Succ}(G_2,m) \cap T_2^{in}(s))) \wedge \notag\\
& (\mathrm{Card}(\mathrm{Pred}(G_1,n)\cap T_1^{in}(s))\ge \mathrm{Card}(\mathrm{Pred}(G_2,m)\cap T_2^{in}(s)))\\
R_{out}(s,n,m)\Leftrightarrow & (\mathrm{Card}(\mathrm{Succ}(G_1,n) \cap T_1^{out}(s))\ge \mathrm{Card}(\mathrm{Succ}(G_2,m) \cap T_2^{out}(s))) \wedge \notag\\
& (\mathrm{Card}(\mathrm{Pred}(G_1,n)\cap T_1^{out}(s))\ge \mathrm{Card}(\mathrm{Pred}(G_2,m)\cap T_2^{out}(s)))\\
R_{new}(s,n,m) \Leftrightarrow & \mathrm{Card}(\tilde{N_1}(s) \cap \mathrm{Pred}(G_1,n)) \ge \mathrm{Card}(\tilde{N_2}(s)\cap \mathrm{Pred}(G_2, m)) \wedge \notag\\
& \mathrm{Card}(\tilde{N_1}(s) \cap \mathrm{Succ}(G_1,n))\ge \mathrm{Card}(\tilde{N_2}(s) \cap \mathrm{Succ}(G_2,m))
\end{align}
$$
​		

对于图同构问题，规则$R_{pred}$和$R_{succ}$保持相同的形式，而对于规则$R_{in}, R_{out}$和$R_{new}$，其中的$\ge$必须应该被替换为$=$。

#### 语义可行性

当考虑带有属性的图的时候，匹配算法中的语义可行性可以按照如下定义，其中$\approx$为属性之间的二元关系。对于某些应用，$\approx$与相等符号并没有差别，而在其他情况下可能需要一个更加具有包容性的定义：


$$
F_{sem} \Leftrightarrow n\approx m\\
\wedge \forall(n',m')\in M(s), (n,n')\in B_1 \Rightarrow (n,n')\approx(m,m') \\
\wedge \forall(n',m')\in M(s), (n',n)\in B_1 \Rightarrow(n',n)\approx(m',m)
$$

## 算法实现

在这篇文章中，我们先讨论无向图上的实现思路以及对规则的理解，之后考虑节点有向图上的子图-图同构算法实现。算法的设计最初受到[博客](https://blog.csdn.net/mmc2015/article/details/49833713)的影响，但在实现过程发现他的实现方法中存在不理解的地方，因此最后还是选择参考论文实现。最后测试用例是我自己设计的，可能存在没有覆盖到的地方，以致程序中存在漏洞，请多海涵。

### 无向图算法

对于无向图问题，需要对可行性规则做相应调整，其中$\mathrm{Adj}(G_1,n)$代表节点$n$在$G_1$中相邻节点所构成的集合，对于$\mathrm{Adj}(G_2,m)$定义类似。$R_{pred}$和$R_{succ}$合并成一条规则$R_1$：


$$
\begin{align}
R_{1} (s,n,m)  \Leftrightarrow & (\forall n'\in M_1(s) \cap \mathrm{Adj}(G_1,n),\exists m'\in \mathrm{Adj}(G_2, m) | (n', m')\in M(s)) \wedge \notag\\
 & (\forall m' \in M_2(s) \cap \mathrm{Adj}(G_2,m),\exists n'\in \mathrm{Adj}(G_1,n)| (n',m') \in M(s))\\
\end{align}
$$


该规则用于证明添加了有序对$(n,m)$后状态$s'$的一致性。对于$n$在$G_1$和$M_1$中的相邻节点$n'$，那么应该在$G_2$中找到对应的$m'$，其与$m$之间的关系应与$n$和$n'$之间的关系相同。同样，$m$和$m'$的关系也应该在$G_1$中找到对应。$R_{in}$和$R_{out}$简化成一条规则$R_{2}$：


$$
\begin{align}
R_2(s,n,m)\Leftrightarrow  \mathrm{Card}(\mathrm{Adj}(G_1,n) \cap T_1(s))\ge \mathrm{Card}(\mathrm{Adj}(G_2,m) \cap T_2(s))
\end{align}
$$


这一条规则表达的是，在子图-图匹配问题中，$G_1$中既是$n$的邻接点又未在$M(s)$在$G_1$中投影$M_1(s)$的顶点数量应该大于在$G_2$中具有对应性质的顶点，否则加入$(n,m)$就是不合法的。而在图匹配问题中，这两个应该相等。至于最后一条规则$R_{new}$，需要修改成


$$
R_3(s,n,m) \Leftrightarrow \mathrm{Card}(\tilde{N_1}(s) \cap \mathrm{Adj}(G_1,n)) \ge \mathrm{Card}(\tilde{N_2}(s)\cap \mathrm{Adj}(G_2, m)) \notag\\
$$


因为状态$s$中并没有包含$(n,m)$所代表的映射关系，所以$\mathrm{Adj}(G_1,n)$中的节点中有一部分不在$\tilde{N_1}(s)$中也不在$M(s)$中。同样图中这部分的节点数量应当大于模式中这些节点的数量。但我认为这个规则同样也只是往前看一步，因为在添加了$(n,m)$之后，$\tilde{N_1}(s)$中的节点与$T_1(s)$中的节点是同等地位的。不过如果将其看做是在加入$(n,m)$后再应用$R_2$规则，那么就是向前看$1+1=2$步。

在这篇文章中并不考虑无向图算法的实现，有兴趣者可以参考有向图的版本自行设计。

### 数据结构

接着讨论在有向图版本中VF2算法需要使用到的数据结构。

在问题中，虽然顶点和边都具有标签，但是顶点上需要保存的相邻的边的信息显然比边上保存的信息要多，因此本程序实现中边的结构比较简单，相对于利用一个结构集中地保存，这里采用的是将边分散到结点上保存：

```c++
struct Edge {
    int v;					
    int label;
    Edge() {
        v = 0;
        label = 0;
    }
    Edge(int d, int l): v(d), label(l) {

    }
};


struct Node {
    int u;
    int label;
    std::set<Edge> predEdgeSet;
    std::set<Edge> succEdgeSet;
    std::bitset<MAX_NODE_NUM> predAdj;
    std::bitset<MAX_NODE_NUM> succAdj;
    size_t edgeNum() {
        return predEdgeSet.size() + succEdgeSet.size();
    }
    size_t predEdgeNum() {
        return predEdgeSet.size();
    }
    size_t succEdgeNum() {
        return succEdgeSet.size();
    }
};
```

由于边结构仅在顶点结构的`predEdgeSet`和`succEdgeSet`成员变量中保存，边的某一端的顶点自然已经被确定，所以`Edge`结构中仅包含了另一端顶点的索引以及标签值。

在代表结点的`Node`结构中，除了保存顶点id值的成员变量`u`以及保存顶点属性的`label`，`predEdgeSet`和`succEdge`集合分别包含前向边和后继边，`std::bitset`类型的`predAdj`和`succAdj`保存的是前驱结点以及后继结点。

由于`set`是有序容器，所以需要重载`Edge`结构的运算符。因为事实上顺序并不重要，所以可以随便定义：

```c++
bool operator<(const Edge & lhs, const Edge & rhs) {
    int lhs_v = lhs.v, rhs_v = rhs.v;
    int lhs_label = lhs.label, rhs_label = rhs.label;
    if (lhs_v < rhs_v) {
        return true;
    }
    else if (lhs_v == rhs_v && lhs_label < rhs_label) {
        return true;
    }
    else return false;
}
```

在定义了顶点和边之后，还需要定义一个图结构`Graph`保存用于查找的模式以及存在某个子图与模式同构的图。因为边信息已经分散到各个顶点上，所以图结构中只需要保存顶点集合即可。除此之外，还提供了两个分别返回图中顶点和边数量的方法。

```c++
struct Graph {
    int graphID;
    std::vector<Node> nodeSet;
    int v_size() { return nodeSet.size(); }
    int e_size() {
        int sum = 0;
        for (auto be = nodeSet.begin(), en = nodeSet.end(); be != en; ++ be) {
            sum += be->edgeNum();
        }
        return sum/2;
    }
};
```

除了图的基本数据结构，算法的本身还需要一个保存匹配的结构，即子图和图顶点之间的相互映射关系，对应于原论文的`core_1`和`core_2`。

```c++
struct Match {
    // the mapping from subgraph(graph) to graph, i.e, from pattern to graph
    std::map<int, int> core_1;
    // the mapping from graph to subgraph(graph)
    std::map<int, int> core_2;
} match;
```

### 算法实现

VF2算法的本质上也是回溯算法+剪枝，因此算法的实现思路与回溯算法相差无几。我的算法实现分为两个部分，一个是可行性规则的判断函数，另一个是递归部分的函数。

判断可行性规则是否成立的函数`feasibilityRules`的实现就像之前讨论的那样，分别对向前看0,1和2步的规则进行实现。如果想偷懒，可以只实现向前看0步的规则，因为剩余的几个规则是为了剪枝，删去并不影响算法的正确性。但是针对顶点和边的语义判断不可删除。

```c++
bool feasibilityRules(Graph & pattern, Graph & graph, int n, int m) {
    auto p_n = pattern.nodeSet[n];
    auto g_m = graph.nodeSet[m];
    // semantic feasibility on node
    if (p_n.label != g_m.label) {
        return false;
    }
    if (match.core_1.size() == 0) {
        return true;
    }
    // semantic feasibility on edge
    for (auto p_begin = p_n.succEdgeSet.cbegin(), p_end = p_n.succEdgeSet.cend(); p_begin != p_end; ++ p_begin) {
        auto p_edge = *p_begin;
        auto p_dest = p_edge.v;
        if (match.core_1.find(p_dest) != match.core_1.cend()) {
            auto g_dest = match.core_1[p_dest];
            bool find = false;
            for (auto g_begin = g_m.succEdgeSet.cbegin(), g_end = g_m.succEdgeSet.cend(); g_begin != g_end; ++ g_begin) {
                auto g_edge = *g_begin;
                if (g_edge.v == g_dest && g_edge.label == p_edge.label) {
                    find = true;
                    break;
                }
            }
            if (!find) return false;
        }
    }
    for (auto p_begin = p_n.predEdgeSet.cbegin(), p_end = p_n.predEdgeSet.cend(); p_begin != p_end; ++ p_begin) {
        auto p_edge = *p_begin;
        auto p_src = p_edge.v;
        if (match.core_1.find(p_src) != match.core_1.cend()) {
            auto g_src = match.core_1[p_src];
            bool find = false;
            for (auto g_begin = g_m.predEdgeSet.cbegin(), g_end = g_m.predEdgeSet.cend(); g_begin != g_end; ++ g_begin) {
                auto g_edge = *g_begin;
                if (g_edge.v == g_src && g_edge.label == p_edge.label) {
                    find = true;
                    break;
                }
            }
            if (!find) return false; 
        }
    }
    // Rule R_pred
    for (auto p_begin = p_n.predEdgeSet.cbegin(), p_end = p_n.predEdgeSet.cend(); p_begin != p_end; ++ p_begin) {
        auto v = p_begin->v;
        if (match.core_1.find(v) == match.core_1.cend()) continue;
        auto w = match.core_1.at(v);
        if (!g_m.predAdj.test(w)) {
            return false;
        } 
    }
    for (auto g_begin = g_m.predEdgeSet.cbegin(), g_end = g_m.predEdgeSet.cend(); g_begin != g_end; ++ g_begin) {
        auto v = g_begin->v;
        if (match.core_2.find(v) == match.core_2.cend()) continue;
        auto w = match.core_2.at(v);
        if (!p_n.predAdj.test(w)) {
            return false;
        }
    }
    // Rule R_succ
    for (auto p_begin = p_n.succEdgeSet.cbegin(), p_end = p_n.succEdgeSet.cend(); p_begin != p_end; ++ p_begin) {
        auto v = p_begin->v;
        if (match.core_1.find(v) == match.core_1.cend()) continue;
        auto w = match.core_1.at(v);
        if (!g_m.succAdj.test(w)) {
            return false;
        }
    }
    for (auto g_begin = g_m.succEdgeSet.cbegin(), g_end = g_m.succEdgeSet.cend(); g_begin != g_end; ++ g_begin) {
        auto v = g_begin->v;
        if (match.core_2.find(v) == match.core_2.cend()) continue;
        auto w = match.core_2.at(v);
        if (!p_n.succAdj.test(w)) {
            return false;
        }
    }
    return true;
}
```

实现算法本体的函数`recursiveMatch`以递归为基本思路。这里简化了原算法中的操作。原算法中，$P(s)$中的有序对$(n,m)$满足$n\in T_1^{in},m\in T_2^{in}$或者$n\in T_1^{out}, m\in T_2^{out}$。但是在我的实现中，算法的搜索思路是依序对模式中的每个顶点寻找其在图中的映射顶点，显然这种思路会带来更大的开销，但是比较简单。如果需要按照原算法实现，我认为需要额外考虑两个地方：

1. 往$M(s)$中添加的第一个有序对的选择；
2. $T_i^{in}$和$T_i^{out},i=1,2$的维护

第一个问题可以从$P^d(s)$中选择，或者可以考虑在模式中找到对应顶点最少的某一标签值$l$，首先为标签值为$l$的顶点找到其在图中的对应。第二个问题的维护也比较简单。

```c++
void recursiveMatch(Graph & pattern, Graph & graph, int i) {
    int size_1 = pattern.v_size();
    if (match.core_1.size() == pattern.v_size()) {
        total ++;
        std::cout << "Match find:" << std::endl;
        std::cout << "\t";
        for (auto cb = match.core_1.begin(), ce = match.core_1.end(); cb != ce; ++ cb) {
            std::cout << "(" << cb->first << "," << cb->second << ") ";
        }
        std::cout << std::endl;
        return;
    }
    int j;
    int size_2 = graph.v_size();
    for (j = 0; j < size_2; j ++) {
        if (match.core_2.count(j) != 0) continue;
        if (feasibilityRules(pattern, graph, i, j)) {
            match.core_1[i] = j;
            match.core_2[j] = i;
            recursiveMatch(pattern, graph, i + 1);
            match.core_1.erase(i);
            match.core_2.erase(j);
        }
    }
}
```

至此，VF2算法的实现就告一段落。图的读取可以自行设计，或者参考我之前提到的那篇博客。


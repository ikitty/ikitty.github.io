---
layout: post
title: "CSS命名规则"
description: "由于历史原因及个人习惯引起的DOM结构、命名规则不统一，导致不同成员在维护同一页面时，无从下手，效率低下，迭代、维护成本极高。经过一段时间的摸索和反复修改，和小组成员统一定下了如下规则，提升团队整体效率。"
category: Python
tags: [python]
---
{% include JB/setup %}

###Introduction


###背景：

由于历史原因及个人习惯引起的DOM结构、命名规则不统一，导致不同成员在维护同一页面时，无从下手，效率低下，迭代、维护成本极高。经过一段时间的摸索和反复修改，和小组成员统一定下了如下规则，提升团队整体效率。团队成员 (Feeling, Levin, Joy, Reeqi, Alex, Hugo)

###CSS命名：

1.基于姓氏命名法（继承+外来），如下图：

![css_name](/images/css_name_1.jpg)

2.说明：

2.1 在子孙模块数量可预测的情况下，继承祖先模块的命名前缀

    如：banner
    banner_img
    banner_opition；

2.2 当子孙模块数量较多，且无法预估时，可以选择采用继承“祖先+父”模块的命名前缀，以保证模块之间的独立、和其他模块解藕

    如：floor
    floor_ad
        floor_ad_ul
        floor_ad_li
    floor_tag
        floor_tag_ul
        floor_tag_li

2.3子模块中，可以嵌套其他模块，可理解为“娶了媳妇、嫁了郎”

    如：hotsales 模块中包含商品模块
    hotsales_li
        mod_goods
            mod_goods_price
            mod_goods_tit
            mod_goods_promo

###DOM层级命名：

页面结构层（以`ic`作前缀，ic是icson的缩写）

    工具条		ic_toolbar
    头部		ic_header
    主体内容	ic_content
    指引信息	ic_footer
    版权信息	ic_copyright

布局层（以`grid_c`开头）

    //行：
    grid_c1（一列）
    grid_c2a（两列，侧栏/主要区域）
    grid_c2b（两列，主要区域/侧栏）
    grid_c3a（三列，侧栏/主要区域/扩展栏）

    //列：
    gird_s（侧栏，定宽）
    grid_m（主体区域，自适应宽度）
    grid_e（扩展栏，定宽）
          
    //模块区域
    //全站公共模块
    以”mod_“开头，如：mod_goods

    //业务公共模块
    以”业务名_mod_“开头，如：sy_mod_f

    //私有模块
    任意单个单词或拼音，如：f1、slider
			
###案例分析（以首页楼层1为例）

如图：

![css_name](/images/css_name_2.jpg)
	
代码分析：

![css_name](/images/css_name_3.png)
![css_name](/images/css_name_4.png)
	
   
###建议

1.减少DOM层级和元素: 按照现有结构，为提高渲染效率，建议基于ic_content之后，层级最多不能超过8层
	
2.减少ClassName层级: 建议不要超过4级，如：vip_mod_banner_lists, 如果层级确实较多，命名可能会较长，可以采用如下方式进行简化： `vip_mod_banner_lists_name -> vip_mod_banner_lname`

3.减少直接定义标签样式: 因浏览器从右向左遍历解析，为提高渲染效率，建议减少定义标签，通过添加class来定义样式，如：`vip_mod_banner_lists_li`
	
4.避免空class
	
5.禁用通配符

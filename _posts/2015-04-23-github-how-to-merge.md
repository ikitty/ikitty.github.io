---
layout: post
title: "Github merge 记录"
description: "当和其他人一起使用Github协作的时候，我们需要使用merge来将每个人的分支代码合并到主干上。这里主要记录了merge时各种冲突的解决方法。"
tags: [ github ]
category: frontend
---
{% include JB/setup %}

当和其他人一起使用Github协作的时候，我们需要使用merge来将每个人的分支代码合并到主干上。这里主要记录了merge时各种冲突的解决方法。

常见的几种场景：

###普通merge

在Github网站上可以点击自动合并即可，这种情况只适用于无冲突的纯添加代码。

###有新的request，而本地又更新了

首先在Github网站上点击自动合并，然后在本地提交代码（`git ci . -m 'commit msg'`)，然后使用`git pull`命令来merge。

###有新的request，在web端不能自动merge

别人的request是基于比较老的版本进行的修改，无法自动merge。而我本地也新增了文件，这种情况如何merge呢？

在本地新增一个分支（用来放别人提交的request的内容）

    //此命令在新建分支后会自动切换到新的分支
    git checkout -b otherMaster master
    //此时使用 git branch 命令，即可看到多了一个otherMaster分支

    //然后将别人的分支内容拉取到本地并merge：
    git pull https://github.com/Other/HerosData.git master
    
pull时执行了一次merge，会提示有冲突，在新分支中会包含有冲突的代码。打开有冲突的文件，处理好冲突代码。搜索`<<< `和`>>>`之类代码即可找到冲突处。

    <<<<<<HEAD
    //这里是旧版本
    ======
    //这里是新版本
    >>>>>> 版本编号

手动解决完冲突后，使用`git status`命令可以看到提示：

    # On branch otherMaster
    # You have unmerged paths.
    #   (fix conflicts and run "git commit")
    #
    # Unmerged paths:
    #   (use "git add <file>..." to mark resolution)
    #
    #       both modified:      HerosData.js
    #
    no changes added to commit (use "git add" and/or "git commit -a")
    
提示已经很清晰了，github让我们处理完冲突后，使用`git add`来标记已解决冲突。

我们一步一步来，执行完命令后再使用`git status`命令查看，发现状态确实变化了，但仍要处于merge状态，这时使用`git commit`来完成merge。

    # On branch otherMaster
    # All conflicts fixed but you are still merging
    #   (use "git commit" to conclude merge)
    #
    nothing to commit, working directory clean
   
执行`git commit`后会进入一个填写commit内容的文件：

    Merge branch 'master' of https://github.com/Other/HerosData into Other-master
    Conflicts:
    	HerosData.js
    #
    # It looks like you may be committing a merge.
    # If this is not correct, please remove the file
    #	.git/MERGE_HEAD
    # and try again.
    
    
    # Please enter the commit message for your changes. Lines starting
    # with '#' will be ignored, and an empty message aborts the commit.
    # On branch otherMaster
    # All conflicts fixed but you are still merging.
    #   (use "git commit" to conclude merge)
    #

github让我们在这里输入提交的备注，我们在第一行后面附加上merge的信息方便后续查看记录，比如：

    Merge branch 'master' of https://github.com/Other/HerosData into Other-master -m 'merge信息'
    
然后保存退出。这样就完成了merge过程。

update：我在上一步ci的时候秀逗了，在ci的时候附加上msg就可以免去进入文件编辑ci信息的过程了。`git commit -m 'mergeMsg'`。

现在，切换到自己的分支:

    git checkout master
    //禁用fast forward模式
    git merge --no-ff otherMaster

这次的merge操作是把上面merge好的新分支合并到主干上，同理，我们仍然要记录好merge信息：

    merge OtherMaster -m 'Merge 信息'

然后将本地master推送到服务器端：

    git push origin master

    //最后删除别人的分支：
    git branch -D otherMaster
    
###小结

最近在和别人协作的时候，发现有些人总喜欢直接在主干上直接修改代码，而且很久才提交一次代码，merge他的request的时候冲突不断。这样真不是一个好习惯。所以还是建议保持master干净，自己新开分支进行修改，定期从upstream更新，保证和原始代码同步。

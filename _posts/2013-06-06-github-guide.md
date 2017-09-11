---
layout: post
title: "Github笔记"
description: "记录了一些Github新手常遇到的问题，好记性不如写Blog。"
tags: [ github]
category: Frontend
---
{% include JB/setup %}

记录了一些Github新手常遇到的问题，好记性不如写Blog。学会使用帮助 `git commit -h`

###下载安装

- 安装，不推荐win的gui客户端，建议使用[msysgit] (http://msysgit.github.io/) 客户端

###配置config

打开配置文件`vi ~/.gitconfig`, 常规设置如：

    [http]
        proxy = 'proxy address'
    [user]
        name = githubUsername
        email = githubUserEmail
    [core]
        editor = gvim
    [alias]
        ll = ls -l
        go = push origin master
        ci = commit
        s = status
        dt = difftool
        mt = mergetool
    [gui]
        encoding = utf-8
    [diff]
        tool = bc3
    [difftool]
        prompt = false
    [difftool "bc3"]
         cmd = \"D:/BCompare.exe\" \"$LOCAL\" \"$REMOTE\"
    [merge]
         tool = bc3
    [mergetool]
         prompt = false
         keepBackup = false
    [mergetool "bc3"]
         cmd = \"D:/BCompare.exe\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
         trustExitCode = true

###配置git

文件路径：setup\etc\git-completion.bash, 新增如下部分：

    alias ls='ls --show-control-chars --color=auto'
    alias ll='ls -l'
    alias gb='cd /d/github/'

###保持登录凭据（for https in win）

如果使用https clone了仓库，你可以使用[git-credential-winstore](https://gitcredentialstore.codeplex.com/ 'view it') 来保存登录凭据，免去每次和github通信时都要输入用户名密码的麻烦。(基于https连接的密码就是GH的登录密码哈)

###配置SSH(for Mac OS)

`cd ~/.ssh`进入ssh目录。如果有ssh key，先备份`mkdir key_bak; mv id_rsa* key_bak`，如果没有key，创建一个key: `ssh-keygen -t rsa -C "email@email.com"`，连续两次输入**密码**(后续每次连接时都要输入这个密码的)。然后在github网站上添加ssh-key（rsa.pub内容）即可。

测试ssh配置是否正常：`ssh -T git@github.com`

###利用github pages创建blog

在github上新建个仓库，仓库名必须是这种格式: githubUsername.github.io，然后clone到本地，创建一个index.html文件，提交后几分钟就可以看到生成的静态页面了。

###常用方法

remote:

    //"origin" is the local name of the remote repository(secondPool.git).
    git remote add origin git@github.com:colinvivy/secondPool.git  

    //查看远程仓库名字 默认是origin
    git remote 

    //删除远程仓库对应的别名
    git remote rm originTest

    //为远程仓库xxx.git设置一个别名upstream
    git remote add upstream git://github.com/hoster/xxx.git
    //如果要修改upstream对应的仓库地址使用：
    git remote set-url upstream <new url>

branch:

    //查看当前本地分支，默认是master
    git branch
    // create a branch
    git branch bName
    // del a branch
    git branch -d bName
    //switch branch
    git checkout newBranch

    //合并分支
    git checkbox master
    git merge myBranch

    git push origin master
    //remote-branch 为空时，默认推送到远程和本地同名的分支(master)，

    //推送分支到remote的branch_x分支
    git push origin branch_x

    //推送本地的branch_x到remote的master分支
    git push origin branch_x:master


fetch

    git fetch upstreamg

    //fetch and merge
    git pull

    //查看远程分支
    git remote -v 

### pull request

当你ci了自己的分支之后，可以去github网站到创建的仓库去申请合并分支——pull request

###todo: git 合作开发的常用操作

to be continued...

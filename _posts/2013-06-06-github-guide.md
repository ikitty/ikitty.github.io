---
layout: post
title: "Github笔记"
description: "记录了一些Github新手常遇到的问题，好记性不如写Blog。"
tags: [ github]
category: Frontend
---
{% include JB/setup %}

记录了一些Github新手常遇到的问题，好记性不如写Blog。

###常规
- 安装，不推荐win的gui客户端，建议使用mingw32客户端
- 配置, `vi ~/.gitconfig` 常规设置如：

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
    [credential]
        helper = !'C:\\Users\\alextang.TENCENT\\AppData\\Roaming\\GitCredStore\\git-credential-winstore.exe'

- 学会使用帮助 `git commit -h`
- OSX下面配置ssh，win下面使用https就不需要配置了

设置SSH
cd ~/.ssh
检查是否有key，如果有的话先备份 mkdir key_bak ； mv id_rsa* key_bak
如果没有key，
创建一个key：ssh-keygen -t rsa -C "email@email.com"
输入密码（twice）
在github网站上添加ssh-key（rsa.pub内容） ，由于win没有使用ssh登录验证密码，所以win下面的提交密码就是gh的login密码



###备份配置
- gitSetup\etc\
- gitSetup\etc\git-completion.bash 新增：

    alias ls='ls --show-control-chars --color=auto'
    alias ll='ls -l'
    alias gb='cd /d/github/'
    alias kty='cd /d/github/kty/'





测试: ssh -T git@github.com //输入密码验证
 
配置git config (~/.gifconfig)
git config --global user.name "colinvivy"
git config --global user.email ""

直接编辑文件更好 vi ~/.gitconfig

[http]
     proxy = http://web-proxy.oa.com:8080
[user]
     name = /*name*/
     email = /*email*/
[core]
     editor = vim
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
     cmd = \"D:/tool/develop/Beyond Compare/BCompare.exe\" \"$LOCAL\" \"$REMOTE\"
[merge]
     tool = bc3
[mergetool]
     prompt = false
     keepBackup = false
[mergetool "bc3"]
     cmd = \"D:/tool/develop/Beyond Compare/BCompare.exe\" \"$LOCAL\" \"$REMOTE\" \"$MERGED\"
     trustExitCode = true
[credential]
     helper = !'C:\\Documents and Settings\\alextang\\Application Data\\GitCredStore\\git-credential-winstore.exe'


查看git 配置文件
cat ~/.gitconfig
git config --global user.name

创建个人blog
在gb上新建个仓库，仓库名必须的是自己的用户名作为二级域名，如 username.github.io
然后创建个index.html ci下试试
实例

1. 在网上新建仓库
2. 接下来的操作网上都有 （最简单的 git clone）

//"origin" is the local name of the remote repository. （添加一个叫origin的远程仓库）
git remote add origin git@github.com:colinvivy/secondPool.git  

// 常用命令
git remote 查看远程仓库
git branch 查看本地分支
// 用此命令删除远程仓库对应的本地别名
git remote rm originTest


git push <remote> <local-branch>:<remoet-branch>
remote-branch 为空时，默认推送到远程和本地同名的分支，如果local-branch为空，则会尝试删除远程分支

5. fork other repo
git clone git@github.com:userName/xxx.git

cd ~/xxx
// 貌似是为远程仓库xxx.git设置一个别名upstream
git remote add upstream git://github.com/hoster/xxx.git
如果要修改upstream对应的仓库地址使用：
git remote set-url upstream <new url>
git fetch upstreamg
git pull (拉取并合并)
git merge upstream/master //如果远程分支updated，用merge命名合并
git remote -v //查看远程分支

git push origin master

6. use branch
本地默认分支为master，你可以根据需要新建分支
git branch myBranch
git checkout myBranch //make ti activity，切换当前分支

上面两行可以合并为 git checkout -b myBranch

合并分支
git checkbox master
git merge myBranch
git branch -d myBranch

7 pull request

// merge
如果本地分支是master，创建一个新分支ikitty，并切换到ikitty
将主干的分支拉去本地master分支 git pull https://...
merge   git mergetool 
git commit 


将创建者的分支设置upstream 保持和upstreame的同步
git remote upstream gitUrl

git fetch upstream master 


---
layout: post
title: Editplus一键同步到FTP
tags: [ Javascript, edptplus ]
category: PHP
description: 在Dreamweaver中，可以将正在编辑的文件一键同步到FTP服务器中，很是便利。如果Editplus也能快捷同步就好了，想到在Editplus可以调用外部程序或者命令，于是用php写了个同步到FTP的脚本文件，并作为工具添加到Editplus中。
---


在Dreamweaver中，可以将正在编辑的文件一键同步到FTP服务器中，很是便利。如果Editplus也能快捷同步就好了，想到在Editplus可以调用外部程序或者命令，于是用php写了个同步到FTP的脚本文件，并作为工具添加到Editplus中。

原理很简单：首先定义FTP的相关参数，比如主机名，用户名，密码等；再指定FTP的路径和本地环境的路径，以便于将本地环境中的文件上传到FTP上对应路径，然后通过php的相关函数连接FTP服务器，并上传文件。

脚本配置很简单（脚本地址在文章底部，当然你可以去googleCode上获取）：

    <?php
    // 定义FTP参数
    $ftp_host = '192.168.0.1';
    $ftp_user = 'username';
    $ftp_pass = 'password';
    $ftp_port = 21;
    $pasv_mode = true;

    // 定义开发环境路径
    $remote_root_dir = '/domains/xxx.com/public_html/blog' ;

    // 定义本地上传路径(此路径等价于开发环境路径)
    $local_root_path = 'D:/www/blog' ;


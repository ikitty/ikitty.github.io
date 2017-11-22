---
layout: post
title: "MongoDB + Node.js构建webApp小结"
description: "MongoDB常驻系统服务的设置，常规操作，安全设置。pm2的使用，反向代理设置等"
tags: [mongoDB]
category: frontend
---
{% include JB/setup %}



## 将MongoDB注册为系统服务

mongoDB的服务器默认是要通过命令行启动的，每次启动mongoDB都要敲一次命令，确实麻烦，所以通过下面的方法将mongoDB注册为系统服务常驻。

### windows系统

在mongodb的安装目录下新建一个配置文件`serve.cfg`，内容如下：

    systemLog:
        destination: file
        path: D:\soft\MongoDB\log\mongod.log
    storage:
        dbPath: D:\soft\MongoDB\Data

以管理员权限运行cmd，进入mongodb的bin目录，执行下面命令：

    //安装服务
    mongod --config "D:\\soft\\MongoDB\\serve.cfg" --install
    
    //开启服务
    net start MongoDB

然后执行bin目录中的`mongo`程序就可以连接数据库进行测试了。
    

### Mac系统

创建配置文件`serve.cfg`

    port=27017
    dbpath=Data
    logpath=log/mongodb.log
    logappend=true  
    fork=true

运行命令

    ./bin/mongod -f serve.cfg
    
可以通过命令查看是否启动成功

    ps aux | grep mongod
    
关闭mongoDB服务

    ./mongo
    use admin
    db.shotdownServer()

## MongoDB常规操作

进入bin目录，运行`mongo`命令连接数据库：

    //查看所有数据库
    show dbs
    
    //进入某个数据库，如果不存在，则创建数据库
    use dbName
    
    //查看当前库中的所有表
    show tables
    
    //如果忘记当前是在哪个数据库了，通过db命令查看当前所在数据库
    db
    
    //insert data into users table
    db.users.insert({json})
    
    //get length of users
    db.users.count()
    
    //get data of users and format
    db.users.find().pretty()
    
    //remove
    db.user.remove({})  
    db.user.drop()

如果要是用mongoDB开发中小应用，使用命令行终究不方便。这里推荐一个软件“**nosql manager for mongodb**”，可用于mongoDB的可视化管理，GUI非常人性化，其操作就不多描述了。


## 安全

默认的mongoDB是没有设置访问权限的。我们可以自己创建用户进行权限设置。
    
    //进入admin库
    use admin
    
    //创建用户
    db.createUser(
       {
         user: "appAdmin",
         pwd: "password",
         roles:
           [
             { role: "readWrite", db: "config" },
             "clusterAdmin"
           ]
       }
    )
    
    //login
    db.auth(user, pwd)

注意，在设置好权限后，运行mongod来启动服务时要加上`--auth`参数才生效




## Node.js常驻

使用pm2，配置好pm2_config.js ,内容：

    {
        "apps": [{
            "name": "brand",
            "cwd": "/data/website/xxx/xxx/brand",
            "script": "app.js",
            "log_date_format": "YYYY-MM-DD HH:mm Z",
        }]
    }

pm2的日志默认在`~/.pm2/logs/`, 常用命令：

    //查看所有五福
    pm2 list

    //启动或重启服务
    pm2 start / restart serverName

## 设置反向代理

vh文件路径: `/data/websites/vhosts`

注意设置反向代理后，每个域名都要设置vh，否则同ip的域名都会被反向代理

    <VirtualHost *:80>
    	ServerName b.qq.com
        ProxyRequests off 

        #<Proxy *> 
            #Order deny,allow 
            #Allow from all 
        #</Proxy> 

        ProxyPass / http://localhost:3000/ 
        ProxyPassReverse / http://localhost:3000/ 
    </VirtualHost>

其他参数解释：

    <VirtualHost *:80>
    	DocumentRoot "E:\www"
    	ServerName a.qq.com
    	<Directory "E:\www">
    		Options FollowSymLinks Indexes ExecCGI

            #允许htaccess指令覆盖
    		AllowOverride All

            #表示后面两个规则顺序，就像像启用黑名单，再启用白名单
    		Order deny,allow
    		Allow from all

    		Require all granted
    	</Directory>
    </VirtualHost>
    
注意：apache要访问文件，必须在第三位有x的权限。有一种特例，网站目录下的软链访问控制，软链访问受目标目录的父级目录权限限制。如果desktop中的某个目录的权限是777，而desktop的第三位没有x权限，建立的软链也是无法访问的。
    
    

## 其他常见问题

- 先登录虚拟机，然后使用scrt登录。（或者使用samba服务用文件管理器操作）
- scrt使用mongodb shell 无法删除字符。解决方法：`会话选项 - 终端 - 仿真 - 终端 - 选择 linux`


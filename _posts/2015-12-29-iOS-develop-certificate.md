---
layout: post
title: "iOS开发证书"
description: "一开始搞iOS开发时，对开发证书是各种不理解。查阅过各种文章，最终把适合自己情况的方案写下来。尽管XCode7已经不需要证书就可以真机测试了，但我还是写下来，记录当时苦逼的折腾时光。"
tags: [iOS, certificate]
category: mac
---
{% include JB/setup %}

一开始搞iOS开发时，对开发证书是各种不理解。查阅过各种文章，最终把适合自己情况的方案写下来。尽管XCode7已经不需要证书就可以真机测试了，但我还是写下来，记录当时苦逼的折腾时光。

###如何申请公司开发证书

- 在rdm平台注册产品
- 提供udid和appid（不支持通配符）给相关接口人
- 拿到证书(p12文件)和授权文件（mobileprivision）

当然更好的方案是让接口人邀请你加入开发者账号，但又不是正职开发，所以，这个可能有点难度。

###使用证书和mobileprovision

- 双击证书，输入系统密码，输入证书密码（在keychain中能看到刚添加的证书就表明成功了）
- 双击mobileprovion，连接iphone，打开Xcode，在window-orginazation中找到iphone设备，点击provisonning prifle，如果能找到刚添加的profile，并且status是valid profile即表示OK。
- 在Xcode的build setting中的code sign区域，选择profile为刚添加的profile

通过上面的三步，你应该可以在Xcode的模拟器区域选择iOS device了。然后点击run，应该就可以在iOS设备上调试文件了

###Xcode5.x导出ipa

- 在Xcode中,将模拟器切换到iOSDevice（经过验证的），选择product - archive，输入密码（尼玛一开始每次在这里都要我输入三次密码），点击distribute，选择 save for enterprise or ad hoc deployment （在keychain中将证书设置为允许任何应用程序访问就可以免去每次输入密码的麻烦）

如果出现下面的错误：

    code signing is required for product type 'Application' in SDK 'iOS 7.0'

请尝试调整deployment里面的版本号（一般情况下不会遇到）

###Xcode6导出ipa

Xcode6中按照之前的打包方式是需要开发者帐号的。所以我找到了命令行的打包方法：

右击archive的文件，进入的archive目录（ /users/userName/library/developer/Xcode/archivie），然后执行下面的命令：

    Xcodebuild -exportArchive -exportFormat ipa -archivePath $archivePath -exportPath ~/desktop/xx.ipa -exportProvisioningProfile 'DaoFeng.._dev'

###真机测试

在target中选择app，在basic中设置deployment的版本为手机ios版本，在build settings中，设置签名为对应的签名即可。

Xcode6真机测试的时候，可能于遇到这样的报错：appId和bundle identifier不一致。仔细一看，发现Xcode给bundle identifier加了一个tests后缀（com.tc.apptests）。这种情况可能是我们在给项目选择签名文件的时候，
tests项目也自动添加了这个签名。所以导致真机测试的时候会出现问题。

解决：在Xcode的testTarget中，将code sign改为自动即可。记得在project中设置deployment target的版本和真机的ios版本一致


###安装ipa到device

- 这步需要用到itunes，打开itunes，双击ipa文件，然后在itunes的应用程序中会看到你刚添加到app，点击安装，然后点击右下角的同步按钮，即可将ipa安装到device
- 最近在发现一个更简单的方法， 在Xcode中安装（省去各种同步的时间消耗）。点击Xcode中的device，然后点击加号，选择对应的ipa安装即可。
 
###桌面显示名称

在info.plist中加 Bundle Dis

###add pch file 

cmd N create a pch
click project ,select your app , choose build settings , search prefix header
enter pch path : $ProjectName/name.pch  (DF/tj.pch)

preprocessor 不要乱改。 这个bug找了好久

###发布到rdm

http://rdm.wsd.com/sign.jsp 

将导出的ipa进行重签名，然后在rdm新建一个内部体验，将重签名的ipa上传发布即可。

### 问题

接口人直接给我p12和授权文件（Appid不支持通配符，每次创建一个新的App都要重新申请）
另外一种方式，让接口人邀请你加入开发者。估计这样会自由度大一点

###更换bundleID
在target的packaging的product name中更新bundleid就好。
更新后，最好重新安装证书，并且先删除就的provision文件，然后安装新的provision文件，把codeSigh下的所有选项（debug和release）都选择最新的provision文件。并重新打包

更换bid之后如果build不成功，在targets中的test项目选项下，将hostAPplication选择为主项目，再试试

###Xcode7免证书

打开Xcode的设置，在account中添加好自己的账户。
然后在项目的target中，在team中选择刚添加的账户，然后点击FixIssue，再次选择自己的账户即可。

###other

数字证书是一个经**证书授权中心数字签名**的**包含公开密钥拥有者信息以及公开密钥的文件**。最简单的证书包含一个公开密钥、名称以及证书授权中心的数字签名。 具有时效性。

Provisioning Profile 配置授权文件，包含证书，appid和设备信息。创建一个provisioning profile时，需要指定appid（单选），证书和设备信息，可在网站上删除provisioning profile。它决定用哪个证书（公钥）/私钥组合签名app。在打包时被嵌入ipa，设备通过该文件来鉴权。


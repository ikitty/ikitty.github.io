---
layout: post
title: "iOS开发问题记录"
description: "记录iOS开发中遇到的困惑"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}
记录iOS开发中遇到的困惑

###UIView的exclusiveTouch属性

通过设置`[selfsetExclusiveTouch:YES]`;可以达到同一界面上多个控件接受事件时的排他性，从而避免一些问题。

 

###scrollView不返回的情况

UIScrollView和UITableView嵌套时点击statusBar，scrollView不返回。苹果在UIScrollView头文件的注释可以清楚的解决我们的困惑

    // When the user taps the status bar, the scroll view beneath the touch which is closest to the status bar will be scrolled to top, but only if its `scrollsToTop` property is YES, its delegate does not return NO from `shouldScrollViewScrollToTop`, and it is not already at the top.

    // On iPhone, we execute this gesture only if there's one on-screen scroll view with `scrollsToTop` == YES. If more than one is found, none will be scrolled.

    @property(nonatomic) BOOL  scrollsToTop;          // default is YES.

 
###JSON Kit数据转换问题

json是很常用的网络数据包格式，客户端和服务端之间经常使用json来传输数据。对于一些字典类型的数据，如果某项数据为空，则会传'<null>'，使用JsonKit转换以后会生出相应的`[NSNull null]`对象，而这种对象对于iOS来说并不是十分安全的，例如约定好商品的某一项字段为string类型，结果JSON Kit转换为`[NSNull null]`，这个时候如果不加判断就当做是NSString处理就会存在问题。所以对于这种数据类型直接转换为nil会更加安全，转换方法如下:

    #define PASS_NULL_TO_NIL(instance) (([instance isKindOfClass:[NSNull class]]) ? nil : instance)

针对nil调用任何方法基本上都是安全的。


###iOS 7中系统自定义VC右滑返回特性不生效

iOS 7开始系统新增了UINavigationController中VC层级右滑返回上一级的特性，该特性默认是打开的。但是在项目中有一个自定义VC中该特性无效，排查半天定位到问题如下：

    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"navigation_bar_back.png"]
                                                                        　　  style:UIBarButtonItemStylePlain
                                                                            target:self
                                                                            action:@selector(backAction:)];

初一看这段代码没有任何问题，只是简单的自定义返回按钮。但是问题就处在这里，只要自定义了leftItem右滑返回上一层级就会实效。因为我这个VC中UI比较复杂，ScrollView，tableView各种嵌套，因此一开始还怀疑是不是手势冲突导致的，后来发现右滑返回属性压根就和我们能接触的手势无关。将上述代码修改为如下代码，问题就解决了。

    if (IS_IOS_6) {
        self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"navigation_bar_back.png"]
                                                                                 style:UIBarButtonItemStylePlain
                                                                                target:self
                                                                                action:@selector(backAction:)];
    }

只针对iOS 7之前的系统自定义返回按钮，iOS 7及以后直接使用系统的返回图标“<”。我们也可以直接获取这个手势“interactivePopGestureRecognizer”，做一些定制操作。
 
###UITableViewCell选中保持问题

UITableView中cell的选中态在调用ReloadData以后无法保持，为了做到选中态一直有效，我试着在cellForRowAtIndexPath中恢复选中态，代码如下：

    - (UITableViewCell*)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        static NSString *cellIdentifier = @"myAccountMenuCellIdentifier";
        UITableView *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
        if (!cell) {
            cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault
                                          reuseIdentifier:cellIdentifier];
        }
        
       ...
        
        // 恢复选中态
        if (_currentSelectedIndexPath
            && indexPath.row == _currentSelectedIndexPath.row
            && indexPath.section == _currentSelectedIndexPath.section) {
            [cell setSelected:YES animated:NO];
        }
        else {
            [cell setSelected:NO animated:NO];
        }

        return cell;
    }

但发现根本不起作用，还尝试着重载了自定义cell的

    - (void)setSelected:(BOOL)selected animated:(BOOL)animated;
    - (void)setHighlighted:(BOOL)highlighted animated:(BOOL)animated;

也是毫无进展，最后终于通过重载reloadData，代码如下：

    - (void)reInvokeCurrentMenuItem
    {
        [self selectRowAtIndexPath:_currentSelectedIndexPath
                          animated:NO
                    scrollPosition:UITableViewScrollPositionNone];
        
        [self tableView:self didSelectRowAtIndexPath:_currentSelectedIndexPath];
    }

即在每次reload以后都通做一次selectRowAtIndexPath的操作来恢复选中。问题虽然解决了但是这种方法也有潜在风险，比如reload的过程中数据源发生变化，可能之前选中的cell的indexPath已经改变，轻则选中不正确的cell，严重的话如果刷新以后cell个数减少，传入一个过大的indexPath就会造成崩溃。terrbile.

###UITextField当实现了textFieldDidBeginEditing方法以后， Clearbtn不响应

UITextField当实现了textFieldDidBeginEditing方法以后， Clearbtn不响应，原因是最简单的view覆盖导致事件被拦截了.如果必须实现delegate，则可以使用设置rightView的方式，这个问题我最后解决了，说来都不好意思，被别的View盖住了。悲催


###Block为空是调用会Crush

昨天碰到一个crash问题，查了一下发现是Block是nil，然后我调用了该Block，程序crash。开始怀疑是不是我的block是在dispatch_async导致的crash，后面测试发现，只要block为nil，调用这个block都会crash。

    // 定义一个block类型
    typedef void (^CompleteBlock) ();
        
    // 声明一个CompleteBlock类型的变量
    CompleteBlock cblock = nil;

    cblock();       // 调用会crash
    dispatch_async(dispatch_get_main_queue(), ^{
        cblock();   // 调用也会crash
    });

定义一个nil的block，无论怎么调用都会crash，不知道苹果为什么没有做保护，总之以后调用block之前还是先判断一下比较靠谱。

###UIImagePickerController黑屏问题

使用UIImagePickerController完成拍照选取时，发现在iOS8上黑屏，其他设备都正常。查了半天才发现原来测试在系统设置中把App的Camera权限关闭了，测试也没有注意到这点。我们一直以为这是iOS 8beta版本的bug，找了半天才发现原来原因很简单。话说回来既然iOS7之后用户可以控制Camera的权限，那么我们的App能不能做的更好，更友好呢，于是查了一下资料发现AVFoundation库提供了检测Camera授权状态的API，所以在网上找到个解决方案。

    + (void)takePhotoFromViewController:(UIViewController<UIImagePickerControllerDelegate, UINavigationControllerDelegate>*)controller
    {
        if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
            
            if ([[AVCaptureDevice class] respondsToSelector:@selector(authorizationStatusForMediaType:)]) {
                AVAuthorizationStatus authorizationStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
                if (authorizationStatus == AVAuthorizationStatusRestricted
                    || authorizationStatus == AVAuthorizationStatusDenied) {
                    
                    // 没有权限
                    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:nil
                                                                         message:@"Please enabled Camera Access (in Settings > Privacy > Camera)!"
                                                                        delegate:nil
                                                               cancelButtonTitle:@"OK"
                                                               otherButtonTitles:nil];
                    [alertView show];
                    return;
                }
            }
            
            UIImagePickerController *pickerController = [[UIImagePickerController alloc] init];
            pickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
            pickerController.cameraCaptureMode = UIImagePickerControllerCameraCaptureModePhoto;
            pickerController.cameraFlashMode = UIImagePickerControllerCameraFlashModeAuto;
            pickerController.cameraDevice = UIImagePickerControllerCameraDeviceRear;
            pickerController.delegate = controller;
            
            [controller presentViewController:pickerController animated:YES completion:nil];
        }
        else {
            // throw exception
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Warning"
                                                            message:@"The Device not support Camera"
                                                           delegate:nil
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
            [alert show];
        }
    }

代码中显示检测系统是否支持拍照，然后在检测App是否有拍照的权限，最后才是进入拍照界面，防止模拟器调试拍照时Crash，或者真机调试权限关闭时出现的拍照界面一直黑屏的情况。

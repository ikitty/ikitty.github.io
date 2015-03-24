---
layout: post
title: "iOS练习-使用Camera来获取图片"
description: "利用Camera或者直接访问相册来获取图片是很方便的，iOS提供了`UIImagePickerController`类来管理用户和Camera或图片库的交互。接下来就通过一个简单的demo来体验这个类的使用方法。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

利用Camera或者直接访问相册来获取图片是很方便的，iOS提供了`UIImagePickerController`类来管理用户和Camera或图片库的交互。接下来就通过一个简单的demo来体验这个类的使用方法。

###准备工作

创建一个单页app，加入一个UIImageView，两个button，并合理的排版。两个button的title分别为：takePhoto和selectPhoto。选中UIImageView，在右侧面板中取消`AutoLayout`，因为我们想保持现有的布局。将刚加入的三个UI控件和ViewController建立连接。

    @interface APPViewController : UIViewController
    @property (strong, nonatomic) IBOutlet UIImageView *imageView;
    - (IBAction)takePhoto:  (UIButton *)sender;
    - (IBAction)selectPhoto:(UIButton *)sender;
    @end

###调整ViewController

要实现和camera或图片库的交互，我们要通过delegate来实现，所以我们要遵循`UIImagePickerControllerDelegate`协议，另外我们使用模态形式展示camera或图片库，故我们还需要遵循`UINavigationControllerDelegate`协议。所以头文件的部分内容如下：

    @interface APPViewController : UIViewController <UIImagePickerControllerDelegate, UINavigationControllerDelegate>

为了实现拍照功能，我们要创建一个`UIImagePickerController`,并将它委托给AppViewController处理。可以通过指定image picker的`sourceType`属性来决定图片来源。当image picker创建后，我们可以通过它的presentViewController来展示它。

    - (IBAction)takePhoto:(UIButton *)sender {
        UIImagePickerController *picker = [[UIImagePickerController alloc] init];
        picker.delegate = self;
        picker.allowsEditing = YES;
        picker.sourceType = UIImagePickerControllerSourceTypeCamera;
        [self presentViewController:picker animated:YES completion:NULL];
    }
    //from photo library
    - (IBAction)selectPhoto:(UIButton *)sender {
        UIImagePickerController *picker = [[UIImagePickerController alloc] init];
        picker.delegate = self;
        picker.allowsEditing = YES;
        picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
        [self presentViewController:picker animated:YES completion:NULL];
    }

###实现图片捕获的委托

当用户拍照或者进行图片调整后，会触发`didFinishPickingMediaWithInfo `，第一个参数是方法的调用者（picker），当我们有多个imagePicker时特别有用。第二个参数包含了图片的相关信息。

    - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
        UIImage *chosenImage = info[UIImagePickerControllerEditedImage];
        self.imageView.image = chosenImage;
        [picker dismissViewControllerAnimated:YES completion:NULL];
    }
  
当用户取消拍照时会触发`imagePickerControllerDidCancel `，我们也要来实现这个方法：

    - (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
        [picker dismissViewControllerAnimated:YES completion:NULL];
    }
    
准备工作都差不多好了，现在，当我们buildAndRun的时候，发现报错了。这是因为模拟器中没有Camera，所以会报错。所以，我们将一个错误处理信息来保证体验的完整性。

    if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
            UIAlertView *myAlertView = [[UIAlertView alloc] initWithTitle:@"Error" message:@"Device has no camera" delegate:nil  cancelButtonTitle:@"OK" otherButtonTitles: nil];
            [myAlertView show];
    }


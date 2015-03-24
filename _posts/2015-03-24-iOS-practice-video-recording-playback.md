---
layout: post
title: "iOS练习-录制和播放视频"
description: "iOS提供了API来录制和播放视频，如果你要播放视频，你可以使用`MediaPlayer framework`，可以播放本地和远程视频哈，如果你要使用更高级的功能，你可以使用`AVFoundation framework`。这里我们先来练习简单点的。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

iOS提供了API来录制和播放视频，如果你要播放视频，你可以使用`MediaPlayer framework`，可以播放本地和远程视频哈，如果你要使用更高级的功能，你可以使用`AVFoundation framework`。这里我们先来练习简单点的。

MediaPlayer framework提供了主要的类来展示视频。使用`MPMoviePlayerController`来立即展示一个视频，视频会在当前视图中展示；使`MPMoviePlayerViewController`类可以全屏播放视频.
 
###准备工作

创建一个单页app,加入一个按钮置业底部的中间,命名为capture, 并创建一个连接. 

引入必要的库:

    #import <MediaPlayer/MediaPlayer.h>
    #import <MobileCoreServices/MobileCoreServices.h>

同之前的camera的demo, 我们也要遵循两个协议: UIImagePickerControllerDelegate 和 UINavigationControllerDelegate . 然后, 新增两个属性videoUrl 和 videoController,videoUrl用来存储视频地址.

    #import <MediaPlayer/MediaPlayer.h>
    #import <MobileCoreServices/MobileCoreServices.h>
    @interface VideoViewController : UIViewController <UIImagePickerControllerDelegate, UINavigationControllerDelegate>
    @property (strong, nonatomic) NSURL *videoURL;
    @property (strong, nonatomic) MPMoviePlayerController *videoController;
    - (IBAction)captureVideo:(id)sender;
    @end
    
###实现视频录制

当用户点击capture时, 会触发`captureVideo`,它负责创建,并展示imagePicker.

    - (IBAction)captureVideo:(id)sender {
        if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
            
            UIImagePickerController *picker = [[UIImagePickerController alloc] init];
            picker.delegate = self;
            picker.allowsEditing = YES;
            picker.sourceType = UIImagePickerControllerSourceTypeCamera;
            picker.mediaTypes = [[NSArray alloc] initWithObjects: (NSString *) kUTTypeMovie, nil];
            [self presentViewController:picker animated:YES completion:NULL];
        }
    }
    
大部分代码和之前的camera练习是一样的, 不过这里多了一个medieTypes属性, imgPicker根据不同的media类型来展示不同的接口. 一般情况下,我们设置mediaType为`kUTTypeMovie`, 表明是使用camera接口. 

###实现视频播放

当用户录制并保存视频后,这个app就能立即播放视频里. 要实现播放功能, 我们还得做一些处理. 

- 得到视频的url地址
- remove imgPickerController
- 使用内置的`MPMoviePlayerController`类来播放视频

前面我们了解到,当用户录制好视频后会触发`didFinishPickingMediaWithInfo`, 文件的url地址也会通过info参数传入.(我们并没有将视频保存到图片库中)

    - (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
        self.videoURL = info[UIImagePickerControllerMediaURL];
        [picker dismissViewControllerAnimated:YES completion:NULL];
        self.videoController = [[MPMoviePlayerController alloc] init];
        [self.videoController setContentURL:self.videoURL];
        [self.videoController.view setFrame:CGRectMake (0, 0, 320, 460)];
        [self.view addSubview:self.videoController.view];
        [self.videoController play];
    }

同样,我们也要处理用户临时退出视频录制的场景:
    
    - (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
        [picker dismissViewControllerAnimated:YES completion:NULL];
    }

###使用消息通知

MPMoviewPlayerContoller有个通知集合, 这样我们可以使用这个特性来控制视频播放。比如，当视频播放完成，就会发送MPMoviePlayerPlaybackDidFinishNotification 消息。在`[self.videoController play]之前添加如下代码:

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(videoPlayBackDidFinish:) name:MPMoviePlayerPlaybackDidFinishNotification object:self.videoController];
    
上面的代码中,它将告诉通知中心监听`MPMoviePlayerPlaybackDidFinishNotification`, 一旦事件发生,并执行videoPlayBackDidFinish方法. 在这个方法里面，要记得删除监听。和JS里面的 事件移除一样。

    - (void)videoPlayBackDidFinish:(NSNotification *)notification {
        
        [[NSNotificationCenter defaultCenter]removeObserver:self name:MPMoviePlayerPlaybackDidFinishNotification object:nil];
        
        // Stop the video player and remove it from view
        [self.videoController stop];
        [self.videoController.view removeFromSuperview];
        self.videoController = nil;
        
        // Display a message
        UIAlertView *alert = [[UIAlertView alloc]
                                        initWithTitle:@"Video Playback" message:@"Just finished the video playback. The video is now removed." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [alert show];
    }


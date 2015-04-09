---
layout: post
title: "iOS练习-CollectionView"
description: "UICollectionView和UITableView类似，也是管理着一个数据集合，并负责他们的展示，但比UITableView更强大，支持更丰富的格式表现。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}


UICollectionView和UITableView类似，也是管理着一个数据集合，并负责他们的展示，但比UITableView更强大，支持更丰富的格式表现。

主要有三个组件：

- Cells，负责单个数据的展示，如果使用了`UICollectionViewFlowLayout `,则会表现得像grid布局一样。
- Supplementary views，可选的，负责section的header和footer
- Decoration views，想象是另一种用于修饰的supplementary，仅用来装饰UI，和数据无关

###创建一个collectionView

新建一个singleApp，先删除默认的ViewController，增加一个CollectionViewController，将collection view的size设置为100x100，设置collection view cell的identifier为“Cell”（很重要，之前就是没设置这个导致bug，查询了很久），添加一个imageView到cell中，并设置tag值为100(此tag和DOM中的id类似，后续我们在代码中可以通过tag来获取到该元素)

###创建对应的类

新建一个class：myCollectionViewController，继承于UICollectionViewController，并将ViewController指派给这个类。
然后实现必要的方法：`numberOfItemsInSection`和`cellForItemAtIndexPath`

申明存储数据的变量：

    @interface RecipeCollectionViewController () {
        NSArray *recipePhotos;
    }
    - (void)viewDidLoad
    {
        [super viewDidLoad];
        recipeImages = [NSArray arrayWithObjects:@"aaa.jpg", @"bbb.jpg", @"ccc.jpg", nil];
    }
    //实现一些必要的方法
    - (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
        return recipeImages.count;
    }
    - (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
        //这里的identifier就是前面我们的storyBoard中设置的“cell”
        static NSString *identifier = @"Cell";
        UICollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:identifier forIndexPath:indexPath];
        UIImageView *recipeImageView = (UIImageView *)[cell viewWithTag:100];
        recipeImageView.image = [UIImage imageNamed:[recipeImages objectAtIndex:indexPath.row]];
        return cell;
    }
    
我们还可以设置单个grid的背景，它由三部分组成：

- background view
- selected background view
- content view (我们放的imageView就是contentView)

###在collectionView中使用群组

要使用collectionview展示多个区块(section)的数据，有三个方法要实现：

- section的数据
- 每个section中item的数量
- 单个item的数据

在数据方面，没什么可说的，就是使用二维数组去保持数据，取值的实现也注意下语法即可

###添加header和footer

选中collectionView，在属性面板中启用section header和section footer。启用后，你在storyBoard中就能看到header和footer模块。我们可以往header中拖入label或者img等。

为header和footer创建`UICollectionReusableView`的子类。并关联到header和footer上。

我们在主ViewController中引入刚创建的类，并加入下面的代码：

    //方法名真的好长
    - (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath
    {
        UICollectionReusableView *reusableview = nil;
        //header和footer都关联到这个类，所以要通过kind变量来判断是哪个对象
        if (kind == UICollectionElementKindSectionHeader) {
            //记得identifier和storyBoard中申明的一致
            RecipeCollectionHeaderView *headerView = [collectionView dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:@"HeaderView" forIndexPath:indexPath];
            NSString *title = [[NSString alloc]initWithFormat:@"Recipe Group #%i", indexPath.section + 1];
            headerView.title.text = title;
            reusableview = headerView;
        }
        if (kind == UICollectionElementKindSectionFooter) {
            UICollectionReusableView *footerview = [collectionView dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionFooter withReuseIdentifier:@"FooterView" forIndexPath:indexPath];
            reusableview = footerview;
        }
        return reusableview;
    }

CMD+R就能看到新增的header和footer了。


说完基本的东西，再来实践和CollectionView的交互

###实现图片详情

设计一个ViewController来展示图片详情，添加一个ViewController，一个imgview，一个带有close按钮的nav bar，然后将collection view cell和ViewController连接起来。segue类型选择modal，并设置好segue的id。

创建一个uiviewcontroller的子类，指派给刚建立的ViewController。

创建一个imageView和button的连接。

    @interface RecipeViewController : UIViewController

    @property (weak, nonatomic) IBOutlet UIImageView *recipeImageView;
    @property (weak, nonatomic) NSString *recipeImageName;
    - (IBAction)close:(id)sender;
    @end
    
当加载的时候要载入指定的图片。

    - (void)viewDidLoad
    {
        [super viewDidLoad];
        self.recipeImageView.image = [UIImage imageNamed:self.recipeImageName];
    }
    
我们如何选择图片，并且将其传递给detail呢？

    - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
        if ([segue.identifier isEqualToString:@"showRecipePhoto"]) {
            NSArray *indexPaths = [self.collectionView indexPathsForSelectedItems];
            RecipeViewController *destViewController = segue.destinationViewController;
            NSIndexPath *indexPath = [indexPaths objectAtIndex:0];
            destViewController.recipeImageName = [recipeImages[indexPath.section] objectAtIndex:indexPath.row];
            [self.collectionView deselectItemAtIndexPath:indexPath animated:NO];
        }
    }

#!/bin/sh
#用/bin/sh来执行本程序
echo start

#define
baseUrl="http://202.103.180.61:83/mmonly/2012/"
tempYear=2012
i=1
#上次更新到2012/10

#数字不足指定位数（默认为3），则在前面自动补0
fixNum()
{
    if [ -z $2 ];then
        niceLength=3
    else
        niceLength=$2
    fi

    numofchar=`expr "$1" : '.*'`  
    restNum=`expr $niceLength - $numofchar`
    rval=$1
    while [ $restNum -gt 0 ] ;do
        rval="0"$rval
        restNum=`expr $restNum - 1`
    done
    echo $rval
}

#获取下载记录
downLogK=`cat ./downLog.txt | awk '{print $1;}'`
downLogJ=`cat ./downLog.txt | awk '{print $2;}'`
isStartDown=0

#for循环爬目录-月份
if [ -z $downLogK ];then
    kLog=1
else
    kLog=$downLogK
fi

for((k=$kLog;k<=12;k++));do
    kFix=${tempYear}`fixNum $k 2`
    kUrl="${baseUrl}${kFix}"
    
    #for循环爬目录-序数
    dirNotExist=0

    if [ $isStartDown = 0 ] ;then
        if [ -z $downLogJ ] ;then
            jLog=1
        else
            jLog=$downLogJ
            isStartDown=1
        fi
    else
        jLog=1
    fi

    for((j=$jLog;;j++));do
        if [ $dirNotExist = 1 ]; then
            echo "End loop at j: "`expr $j - 1`
            break
        fi

        #record downloaded
        echo "${k} ${j}" > ./downLog.txt

        jFix=`fixNum $j`

        eachUrl="${kUrl}/${jFix}/${i}.jpg"
        localFixUrl="./${kFix}/${jFix}/${i}.jpg"

        #这里用while 循环不好 不能很好的自增加和初始化变量
        #当httpCode不为200时终止循环
        while [ `curl -s -w %{http_code} -m 5000 -o $localFixUrl --create-dirs $eachUrl` = 200 ];do
            echo ${eachUrl}

            i=`expr $i + 1`
            eachUrl="${kUrl}/${jFix}/${i}.jpg"
            localFixUrl="./${kFix}/${jFix}/${i}.jpg"
        done


        #如果第一个图片获取失败，则认为该目录不存在，终止循环
        if [ $i = 1 ] ; then
            dirNotExist=1
        fi

        rm $localFixUrl
        echo "removed not exsit data: $localFixUrl"
        i=1
    done

done

#todo 下载耗时
rm downLog.txt
echo complete 

#curl http://202.103.180.61:83/mmonly/2012/\[201209-201210\]/\[039-040\]/\[1-20\].jpg -o ./#1/#2/#3.jpg --create-dirs

#赋值时等号左右不要有空格
#baseUrl="http://202.103.180.61:83/mmonly/2012/201203/"
#尼玛这里一定要空格
#i=`expr $i + 1`
#numofchar=`echo -n "$1" | wc -c | sed 's/ //g' `
# fuckyou -111 > 0 returned true
#语法好贱啊，for两个括号
#http://61.146.178.120:8012/img2012/2013/08/01/012BT853/0060.jpg
#2013/04/15/017BT813/0084.jpg
http://www.umei.cc/tags/Vicni.htm
http://www.umei.cc/pic_l.htm?http://i8.umei.cc//img2012/2013/04/15/017BT813/0000.jpg&.htm

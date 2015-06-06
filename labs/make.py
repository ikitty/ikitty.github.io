#!/usr/bin/python
#coding:utf-8

print '\n===== make list page =======\n'

import os

htmlHd = '''
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<style type="text/css" media="screen">
     * {margin:0;padding:0;list-style:none;}
     ul {width:800px;margin:0 auto;padding-top:10px;line-height:30px;}
     li {float:left;width:30%;margin-right:20px;margin-bottom:20px;background-color:#f5f5f5;border-bottom:1px solid #eee;border-radius:4px;}
     li:hover {background-color:#eee;}
     a {color:#39f;display:block;text-decoration:none;text-indent:10px;}
     a:hover {color:#333;}
</style>
<title>Files</title>
</head>
<body>
'''
htmlFt = '''
</body>
</html>
'''

def makePage():
    #从根目录开始遍历
    f = open('index.html', 'w')
    strHtml = '<ul>\n'

    for dirname, dirnames, filenames in os.walk('./'):
        #for subdirname in dirnames:
            #print os.path.join(dirname, subdirname)


        for filename in filenames:
            if (dirname == './' and filename.find('.htm') > -1) or filename.find('index.htm') > -1 :
                filePath = os.path.join(dirname, filename)
                if filePath != './index.html':
                    strHtml += '<li><a target="_blank" href="' + filePath  + '">' + filePath + '</a></li>\n'

        # editing the 'dirnames' list will stop os.walk() from recursing into there.
        if '.git' in dirnames:
            dirnames.remove('.git')

    strHtml += '</ul>'
    f.write(htmlHd + strHtml + htmlFt)

makePage()


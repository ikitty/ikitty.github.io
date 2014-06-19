<?php
/**
 * FtpSync.php
 *
 * @author <colinvivy#gmail.com>
 * @description 使用PHP脚本上传文件到FTP服务器
 * @update 2011-12-13
 */

// 处理参数
// $file_info['-f'] 文件全路径
array_shift($argv) ;
$file_info = array() ;
for($i=0 , $length = count($argv);$i < $length ;$i+=2){
    $file_info[$argv[$i]] = $argv[$i+1] ;
}
$file_path = str_replace('\\', '/', $file_info['-f']);

/**
 * $ftp_config FTP参数名解释
 *
 * @remote_dir FTP远程目录
 * @local_full_path 本地可上传文件的完整路径(从盘符开始,和remote_dir对应)
 **/
$ftp_config = array();
$ftp_config['ppms'] = array(
    'host' => 'ip' ,
    'port' => '8080' ,
    'user' => 'user' ,
    'pass' => 'user' ,
    'remote_dir' => '' ,
    'local_full_path' => 'E:/x' 
);

// 根据上传文件路径判断目标FTP
$isValid = 0 ;
$ftp_target = array();
foreach($ftp_config as $k=>$v){
    if (strpos($file_path, $v['local_full_path']) !== false) {
        $ftp_target = $v ;
        $isValid = 1 ;
        break;
    }
}
// 不允许上传非指定目录下的文件
if ($isValid == 0) {
    echo 'You can upload file in define directory' ;
    exit() ;
}

// 检查文件是否合法
if(!is_file($file_path)) {
    echo "$file_path is bad file.\n";
    exit() ;
}

// 处理路径
$file_name = substr($file_path, strrpos($file_path, '/')+1) ;

// 本地路径中最深的文件夹 F:/www/ppms -> ppms
$local_deep_dir = substr($ftp_target['local_full_path'], strrpos($ftp_target['local_full_path'], '/') +1 );

// 本地上传路径 F:/www/ppms/php/test.php -> F:/www/ppms/php/
$local_path = substr($file_path, 0, strrpos($file_path, '/')+1) ;

// 远程上传路径 '' +  (F:/www/ppms/php/ -> /php/)
// 苦逼的拼路径是为了防止本地最深目录和FTP根目录命名不一致，比如本地最深目录为buy_static,FTP根目录为static,就要拼接路径保证本地buy_static对应FTP下static
$remote_path = $ftp_target['remote_dir'].substr($local_path, strpos($local_path, $local_deep_dir) + strlen($local_deep_dir)) ;

// for test
// echo "\n".$file_path."\n".$file_name."\n".$local_path."\n".$remote_path."\n" ;
// exit() ;

// FTP连接 上传
$ftp = getFtpConnection($ftp_target['host'], $ftp_target['port'], $ftp_target['user'], $ftp_target['pass']);
$files = array($file_name);
upload($ftp, $remote_path, $local_path, $files);
ftp_close($ftp);

/**
 * 连接FTP
 * @param $host {string} 主机名
 * @param $user {string} 用户名
 * @param $pass {string} 密码
 */
function getFtpConnection($host, $port, $user, $pass) {
    $ftp = @ftp_connect($host, $port);
    if($ftp === false) {
        echo "Connect to FTP Failed!\n";
        exit() ;
    }
    if(!@ftp_login($ftp, $user, $pass)) {
        echo "Login FTP Failed!\n";
        exit() ;
    }
    if(!@ftp_pasv($ftp, true)) {
        echo "Choose PASV mode Failed!\n";
        exit() ;
    }
    return $ftp;
}

/**
 * FTP上传文件
 * @param $ftp FTP连接标识符
 * @param $remote_path {string} 远程路径
 * @param $local_path {string} 本地路径
 * @param $uploadFiles {array} 要上传的文件
 */
function upload($ftp, $remote_path, $local_path, $uploadFiles) {
    if(count($uploadFiles) == 0) {
        echo "No file found.\n";
        exit() ;
    }
    // create dir not exits
    // checkDir($ftp, $remote_path);

    if(!@ftp_chdir($ftp, $remote_path)) {
        echo "Switch dir to $remote_path Failed!\n";
        exit() ;
    }
    foreach($uploadFiles as $f) {
        if(ftp_put($ftp, basename($f), $local_path.$f, FTP_BINARY)) {
            echo "\n"."$f uploaded Successfully At ".date('Y-m-d H:i:s', time()+8*60*60)."\n" ;
        } else {
            echo "$f upload Failed! \n";
        }
    }
}

/**
 * 递归获取未存在目录
 * @param $ftp
 * @param $dir
 **/
$dir_parents = array();
$dir_childs = array();
function checkDir($ftp, $dir){
    global $dir_parents, $dir_childs ;

    if (!@ftp_chdir($ftp, $dir)) {
        $dir_parent = substr($dir, 0, strrpos($dir, '/'));
        $dir_parents[] = $dir_parent ;
        $dir_childs[] = substr($dir, strrpos($dir, '/')+1);
        checkDir($dir_parent);
    }else {
        if (count($dir_parents) > 0) {
            $dir_parents = array_reverse($dir_parents);
            $dir_childs = array_reverse($dir_childs);
            createDir($ftp);
        }
    }
}

function createDir($ftp){
    global $dir_parents, $dir_childs ;

    foreach($dir_parents as $k=>$v){
        @ftp_chdir($ftp, $v);
        @ftp_mkdir($ftp, $dir_childs[$k]);
    }
}

?>

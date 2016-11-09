const fs = require('fs')

const clearEmptyDir = (path) => {
    fs.readdir(path, (err, fileArr) => {
        if (err) { return  ; }

        if (fileArr[0]) {
            fileArr.forEach( item => {
                var childPath = path + '/' + item
                console.log('detect child %s', childPath) ;
                isDir(childPath)
            })
        }else {
            fs.rmdir(path, (err) => {
                if (err) {
                    console.log('rmdir cause one Error') ;
                }else {
                    console.log('rmdir %s OK', path) ;
                }
            })
        }
    })
}

const isDir = (path) => {
    fs.stat(path, (err, ret) => {
        if (err) { return  ; }
        if (ret.isDirectory()) {
            console.log('%s is dir, reDetect', path) ;
            clearEmptyDir(path)
        }
    })
}

//clearEmptyDir('./')

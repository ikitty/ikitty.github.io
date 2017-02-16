#!/bin/sh

echo start build html

cp ~/GCode/babes/build/index.html ./
sed -i '' "s#/static#static#g" index.html

echo start build static

rm -r static
cp -r ~/GCode/babes/build/static ./
rm static/**/*.map

echo Done


#!/bin/bash

rm -rf layui/*
rm -rf mfizz/*
cp -fv ../public/layui/font/bak/iconfont.* ./layui/
cp -fv ../public/font-mfizz/bak/font-mfizz.* ./mfizz/

font-spider index.html

cp -fv layui/iconfont.* ../public/layui/font/
cp -fv mfizz/font-mfizz.* ../public/font-mfizz/

rm -rf layui/*
rm -rf mfizz/*


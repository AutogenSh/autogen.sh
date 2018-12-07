#!/bin/bash

rm -rf layui/*
rm -rf mfizz/*
cp -fv ../static/layui/font/bak/iconfont.* ./layui/
cp -fv ../static/font-mfizz/bak/font-mfizz.* ./mfizz/

font-spider index.html

cp -fv layui/iconfont.* ../static/layui/font/
cp -fv mfizz/font-mfizz.* ../static/font-mfizz/

rm -rf layui/*
rm -rf mfizz/*


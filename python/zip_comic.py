import os
import zipfile
import sys

ROOT = '..\\download\\wangxianglaoshi'

def zip_ya(start_dir, file_news):
    start_dir = start_dir  # 要压缩的文件夹路径

    z = zipfile.ZipFile(file_news, 'w', zipfile.ZIP_DEFLATED)
    for dir_path, dir_names, file_names in os.walk(start_dir):
        f_path = dir_path.replace(start_dir, '')  # 这一句很重要，不replace的话，就从根目录开始复制
        f_path = f_path and f_path + os.sep or ''  # 实现当前文件夹以及包含的所有文件的压缩
        for filename in file_names:
            z.write(os.path.join(dir_path, filename), f_path + filename)
    z.close()
    return file_news

def zip_one(src_path, dst_path):
    try:
        os.mkdir(dst_path)
    except:
        pass

    for i in os.listdir(src_path):
        _dst = os.path.join(dst_path, i)
        _dst += '.zip'
        if os.path.exists(_dst):
            continue

        _src = os.path.join(src_path, i)
        print(_dst, _src)
        zip_ya(_src, _dst)

def main():
    try:
        os.mkdir('out')
    except:
        pass

    for i in os.listdir('download'):
        path = os.path.join('download', i)
        dst_path = os.path.join('out', i)
        zip_one(path, dst_path)

if __name__ == '__main__':
    main()
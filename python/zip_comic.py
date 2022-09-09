import os
import zipfile
import sys
import urllib.parse
import shutil
import re


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

def get_file_name(ori_name):
    ret_name = re.sub(u"([^\u4e00-\u9fa5\u0030-\u0039\u0041-\u005a\u0061-\u007a])", "", urllib.parse.unquote(ori_name))
    return ret_name

def zip_one(src_path, dst_path):
    try:
        os.mkdir(dst_path)
    except:
        pass

    for i in os.listdir(src_path):
        file_name = get_file_name(i)

        _dst = os.path.join(dst_path, file_name)
        _dst += '.zip'
        # print(_dst)
        if os.path.exists(_dst):
            continue

        _src = os.path.join(src_path, i)
        #print(_dst, _src)
        zip_ya(_src, _dst)

def rec_path(path, func):
    for i in os.listdir(path):
        filename = os.path.join(path, i)
        func(filename)
        if os.path.isdir(filename):
            rec_path(filename, func)


class PicaCompresser(object):
    def __init__(self, root) -> None:
        self.root = root

    def find_original(self):
        origin_list = []
        def _func(filename):
            if filename.endswith('original'):
                origin_list.append(filename)

        rec_path(self.root, _func)
        return origin_list

    def compress_original(self, filename):
        dirname = os.path.dirname(filename)
        newpath = os.path.join(dirname, 'compressed')
        try:
            os.mkdir(newpath)
        except Exception as e:
            pass

        for i in os.listdir(filename):
            origin_name = os.path.join(filename, i)
            newname = os.path.join(newpath, '{}.zip'.format(i))
            zip_ya(origin_name, newname)

    def compress_all(self):
        originals = self.find_original()
        print(originals)
        for i in originals:
            self.compress_original(i)


def main():
    download_dir = os.path.join('output', 'download')
    zip_dir = os.path.join('output', 'zip')
    try:
        os.mkdir(zip_dir)
    except:
        pass

    for i in os.listdir(download_dir):
        path = os.path.join(download_dir, i)
        dst_path = os.path.join(zip_dir, i)
        zip_one(path, dst_path)

def encode_comic(comic_path):
    for i in os.listdir(comic_path):
        src_path = os.path.join(comic_path, i)
        if '%' not in i:
            dst_path = os.path.join(comic_path, urllib.parse.quote(i))
            try:
                os.rename(src_path, dst_path)
            except:
                pass
        elif '%25' in i:
            dst_path = os.path.join(comic_path, urllib.parse.unquote(i))
            try:
                os.rename(src_path, dst_path)
            except:
                pass



def encode_dir():
    download_dir = os.path.join('output', 'download')
    for i in os.listdir(download_dir):
        path = os.path.join(download_dir, i)
        encode_comic(path)


if __name__ == '__main__':
    if len(sys.argv) == 2:
        if sys.argv[1] == 'encode_dir':
            encode_dir()
        elif sys.argv[1] == 'test':
            pi = PicaCompresser(r'G:\shcomic\commies')
            pi.compress_all()
    else:
        main()


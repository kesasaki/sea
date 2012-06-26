import sys
import urllib
import re

bookmarks = ["http://www.yahoo.co.jp",
             "http://www.google.co.jp",
             "http://www.gree.co.jp",
             "http://www.facebook.com",
             "http://www.twitter.com",
             "http://lewuathe.sakura.ne.jp"]


def makeTree(url,depth):
    out = {}
    childs = []
    hasChild = 0
    res = urllib.urlopen(url)
    urlReg = re.compile('http://[^/]*')
    match = urlReg.findall(res.read())
    if depth > 0 :
        for child in match :
            if child in bookmarks:
                childObject = makeTree(child,depth-1)
                childs.append(childObject)
                hasChild = 1

    if not hasChild :
        out[url] = None
    else:
        out[url] = childs
    return out

        
            

        
    
    

if __name__ == "__main__":
    argvs = sys.argv
    length = len(argvs)
    print makeTree(argvs[1],4)



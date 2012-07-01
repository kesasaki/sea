import sys
import urllib
import re

bookmarks = ["http://www.yahoo.co.jp",
             "http://www.google.co.jp",
             "http://www.gree.co.jp",
             "http://www.facebook.com",
             "http://twitter.com",
             "http://m.twitter.com",
             "http://mixi.co.jp",
             "http://github.com",
             "http://fotologue.jp"
             "http://lewuathe.sakura.ne.jp",
             "http://www.w3.org",
             "http://www.yahoo.co.jp",
             "http://k.yimg.jp",
             "http://search.yahoo.co.jp",
             "http://eva.yahoo.co.jp",
             "http://shopping.yahoo.co.jp",
             "http://auctions.yahoo.co.jp",
             "http://travel.yahoo.co.jp",
             "http://b.www.yahoo.co.jp",
             "http://toolbar.yahoo.co.jp",
             "http://dailynews.yahoo.co.jp",
             "http://ard.yahoo.co.jp"]


def makeTree(url,depth,visited):
    out = {}
    childs = []
    hasChild = 0
    res = urllib.urlopen(url)
    visited.append(url)
    urlReg = re.compile('http://[^/]*')
    match = urlReg.findall(res.read())
    if depth > 0 :
        for child in match :
            if child in bookmarks and not child in visited:
                childObject = makeTree(child,depth-1,visited)
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
    visited = []
    print makeTree(argvs[1],4,visited)



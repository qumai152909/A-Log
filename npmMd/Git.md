# 冲突

## 编辑冲突的方法

### 直接编辑冲突文件

冲突产生后，文件系统中冲突了的文件（这里是test.txt）里面的内容会显示为类似下面这样：

~~~js
a123
<<<<<<< HEAD
b789
=======
b45678910
>>>>>>> 6853e5ff961e684d3a6c02d4d06183b5ff330dcc
c
~~~

其中：冲突标记<<<<<<< （7个<）与=======之间的内容是**我的修改**，

=======与>>>>>>>之间的内容是**别人的修改**。

此时，还没有任何其它垃圾文件产生。

 

**修改冲突的部分，重新提交。**

```
$ git add myfile.txt
$ git commit -m "合并issue3分支"
# On branch master
nothing to commit (working directory clean)
```



### rebase 冲突

rebase的时候，修改冲突后的提交不是使用commit命令，而是执行rebase命令指定 --continue选项。若要取消rebase，指定 --abort选项。

```bash
$ git add myfile.txt
$ git rebase --continue
Applying: 添加pull的说明
```

# rebase合并多次commit

git rebase -i HEAD~3  

# 将本地项目推送到github

  1， 在github，点击创建一个新仓库：

  2，建立本地仓库与远程仓库链接：

  + 在项目根目录右键命令行工具输入：

    *git remote add origin [https://github.com/XXXXXX/xxxxx.git](https://link.zhihu.com/?target=https%3A//github.com/tugenhua0707/testgit.git) (这里是你的仓库即项目地址）*

  3， 把项目推送到远程仓库：

  + 同样使用在根目录下的命令行工具输入：

    *git add .*             (点为全部的意思) 把项目所有文件加到缓存区

  + *输入：git commit -m '这里为注释，随便写'* ： 把缓存区里的文件提交到本地仓库

  + *输入：git pull --rebase origin master* 把远程仓库和本地仓库同步

  + *最后输入：git push -u origin master*  **把仓库中的文件推送到github仓库**

# error1：

  **[git远程库与本地联系报错fatal: Not a git repository (or any of the parent directories): .git](https://www.cnblogs.com/xinxin1994/p/8484725.html)**

  解决方法：git init

# 拉取远程分支到本地

  **git checkout -b version2 origin/origin2（dev为远程仓库的分支名）**

# 本地新建分支，关联远程

git checkout -b version-11-17

~~~bash
git checkout -b version-11-17 # 本地新建分支：version-11-17
git branch --set-upstream-to=origin/version-11-17 # 本地分支关联远程分支version-11-17
#Branch 'version-11-17' set up to track remote branch 'version-11-17' from 'origin'. （关联成功提示）
~~~

**第一次推送到远程分支**

~~~bash
 git push --set-upstream origin version-11-17
 
 git push # 第二次之后，推送远程，直接使用此命令
~~~

# 删除分支

在branch命令指定-d选项执行，以删除分支。

```bash
$ git branch -d <branchname>
```

执行以下的命令以删除issue1分支。

```bash
$ git branch -d issue1
```

## 删除本地分支

  目的：*删除本地分支： dev*

  刚才我们已经创建了dev分支，现在我们开发完成了，要把这个分支删掉

  + 第一步：切换到其他分支：git checkout master

  + 第二步：删除分支 git branch -d dev

  + 第三步：查看所有本地分支：git branch

  ## 删除远程分支

  删除远程分支 git push origin --delete 分支名

# 丢弃本地修改（新增、删除、修改）

本地修改了许多文件，其中有些是新增的，因为开发需要这些都不要了，想要丢弃掉，可以使用如下命令：

```bash
git checkout . #本地所有修改的。没有的提交的，都返回到原来的状态
git stash #把所有没有提交的修改暂存到stash里面。可用git stash pop回复。

git clean 参数
    -n 不实际删除，只是进行演练，展示将要进行的操作，有哪些文件将要被删除。（可先使用该命令参数，然后再决定是否执行）
    -f 删除文件
    -i 显示将要删除的文件
    -d 递归删除目录及文件（未跟踪的）
    -q 仅显示错误，成功删除的文件不显示
    
git reset --hard HASH #返回到某个节点，不保留修改，已有的改动会丢失。
git reset --soft HASH #返回到某个节点, 保留修改，已有的改动会保留，在未提交中，git status或git diff可看。

注：
git reset 删除的是已跟踪的文件，将已commit的回退。
git clean 删除的是未跟踪的文件    
```

也可以使用：

```bash
git clean -nxdf（查看要删除的文件及目录，确认无误后再使用下面的命令进行删除）
git checkout . && git clean -xdf
```

# error2: 解决fatal: refusing to merge unrelated histories

在使用Git的过程中有时会出现一些问题，那么在解决了每个问题的时候，都需要去总结记录下来，下次不再犯。

**一、`fatal: refusing to merge unrelated histories`**

今天在使用Git创建项目的时候，在两个分支合并的时候，出现了下面的这个错误。

```bash
~/SpringSpace/newframe on  master ⌚ 11:35:56
$ git merge origin/druid
fatal: refusing to merge unrelated histories123
```

这里的问题的关键在于：`fatal: refusing to merge unrelated histories`
你可能会在`git pull`或者`git push`中都有可能会遇到，这是因为两个分支没有取得关系。那么怎么解决呢？

**二、解决方案**

在你操作命令后面加`--allow-unrelated-histories`
例如：
`git merge master --allow-unrelated-histories`

如果你是`git pull`或者`git push`报`fatal: refusing to merge unrelated histories`
同理：

~~~bash
git pull origin master --allow-unrelated-histories
~~~

等等，就是这样完美的解决咯！


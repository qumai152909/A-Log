https://mp.weixin.qq.com/s?src=11&timestamp=1626603890&ver=3198&signature=kx2DeBNPBsbaX6MNNEDAVVbAzIQz6xNJC2NGN-a1rDsw2VMc74Gy0VZYhveax0ereOpJsbcKpZfHA9R1V5xRD*o9Y-ywUj8WwVKIOfKBCOyamTaEWwvC-Cved9hMZ4u9&new=1



 

**nginx 特点：**

- 模块化设计：良好的扩展性，可以通过模块方式进行功能扩展。

  

- 高可靠性：主控进程和worker是同步实现的，一个worker出现问题，会立刻启动另一个worker。

  

- 内存消耗低：一万个长连接（keep-alive）,仅消耗2.5MB内存。

  

- *支持热部署：不用停止服务器，实现更新配置文件，更换日志文件、更新服务器程序版本。*

  

- 并发能力强：官方数据每秒支持5万并发；

  

- 功能丰富：优秀的反向代理功能和灵活的负载均衡策略

**基本工作模式**

<img src="/Users/sunyingying23/Github/A-Log/imgs/nginx-workers.png" alt="nginx-workers" style="zoom:30%;" />

一个master进程，生成一个或者多个worker进程。但这里master是使用root身份启动的，因为nginx要工作在80端口。而只有管理员才有权限启动小于低于1023的端口。master主要是负责的作用只是启动worker，加载配置文件，负责系统的平滑升级。其它的工作是交给worker。那当worker被启动之后，也只是负责一些web最简单的工作，而其它的工作都是由worker中调用的模块来实现的。



模块之间是以流水线的方式实现功能的。流水线，指的是一个用户请求，由多个模块组合各自的功能依次实现完成的。比如：第一个模块只负责分析请求首部，第二个模块只负责查找数据，第三个模块只负责压缩数据，依次完成各自工作。来实现整个工作的完成。



**它们是如何实现热部署的呢？**是这样的，我们前面说master不负责具体的工作，而是调用worker工作，它只是负责读取配置文件，因此当一个模块修改或者配置文件发生变化，是由master进行读取，因此此时不会影响到worker工作。在master进行读取配置文件之后，不会立即把修改的配置文件告知worker。而是让被修改的worker继续使用老的配置文件工作，当worker工作完毕之后，直接当掉这个子进程，更换新的子进程，使用新的规则。






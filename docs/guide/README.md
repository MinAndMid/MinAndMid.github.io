---
title: '高可用集群搭建'
editLink: true
lastUpdated: true
---

## 准备工作
&emsp;高可用集群建立在完全分布式集群之上，在用三台服务器（Master、Slave1、Slave2）成功搭建完全分布式的基础上，新增第四台服务器作为备用节点；  
&emsp;本文档仅对使用`内网IP`搭集群有效，使用`外网IP`的可行性请自行验证。<Badge type="danger" text="Attention" />
- 将第四台机器的hostname修改为Slave3
- 四台机器都配置好映射 /etc/hosts
- 关闭防火墙 root@Slave3：ufw disable
- JDK最好统一版本, 避免出现不必要的错误
- 端口开放：全部TCP
- 内网互联  
&emsp;若是阿里云ECS服务器，可以通过阿里云的云企业网将四台机器云联网，在统一用内网IP配置hosts映射的情况下，四台机器相互之间可以用内网IP ping通。
云联网的操作比较繁琐，如何进行云联网请查阅官方文档。  

::: warning 注意事项
hadoop & zookeeper 两个模块统一安装在/usr/local路径下且使用hadoop账户，仅作演示使用  
/usr/local/hadoop  
/usr/local/zookeeper
:::

::: tip 提示
假设是用新创建的账户hadoop来搭集群而不是管理员账户root，那么需要将目录的归属用户更改为hadoop。否则集群在启动过程中会因为没有权限去创建某些目录导致启动失败
:::

## Zookeeper

### 修改zoo.cfg

```sh:no-line-numbers
# 修改zoo.cfg文件
cd /usr/local/zookeeper/conf
sudo vim zoo.cfg
```

四台机器：本机填0.0.0.0，外机填名字

<CodeGroup>
  <CodeGroupItem title="Master" active>

```bash:no-line-numbers
# 替换成你自己的zkdatalog文件夹的路径
dataLogDir= /usr/local/zookeeper/zkdatalog
server.1=0.0.0.0:2888:3888
server.2=Slave1:2888:3888
server.3=Slave2:2888:3888
server.4=Slave3:2888:3888
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave1">

```bash:no-line-numbers
# 替换成你自己的zkdatalog文件夹的路径
dataLogDir= /usr/local/zookeeper/zkdatalog
server.1=Master:2888:3888
server.2=0.0.0.0:2888:3888
server.3=Slave2:2888:3888
server.4=Slave3:2888:3888
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave2">

```bash:no-line-numbers
# 替换成你自己的zkdatalog文件夹的路径
dataLogDir= /usr/local/zookeeper/zkdatalog
server.1=Master:2888:3888
server.2=Slave1:2888:3888
server.3=0.0.0.0:2888:3888
server.4=Slave3:2888:3888
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave3">

```bash:no-line-numbers
# 替换成你自己的zkdatalog文件夹的路径
dataLogDir= /usr/local/zookeeper/zkdatalog
server.1=Master:2888:3888
server.2=Slave1:2888:3888
server.3=Slave2:2888:3888
server.4=0.0.0.0:2888:3888
```

  </CodeGroupItem>

</CodeGroup>

### 修改myid

<CodeGroup>
  <CodeGroupItem title="Master" active>

```sh:no-line-numbers
cd /usr/local/zookeeper/zkdata
sudo vim myid
# 1
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave1">

```sh:no-line-numbers
cd /usr/local/zookeeper/zkdata
sudo vim myid
# 2
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave2">

```sh:no-line-numbers
cd /usr/local/zookeeper/zkdata
sudo vim myid
# 3
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave3">

```sh:no-line-numbers
cd /usr/local/zookeeper/zkdata
sudo vim myid
# 4
```

  </CodeGroupItem>
</CodeGroup>

### 配置环境变量
四台机器都要配置zookeeper的环境变量，注意替换路径
```sh:no-line-numbers{4}
# 修改环境变量文件
sudo vim ~/.bashrc

export ZOOKEEPER_HOME=/usr/local/zookeeper
PATH=$PATH:$ZOOKEEPER_HOME/bin

# 使环境变量生效
source ~/.bashrc
```

### 启动zookeeper
四台机器都运行`start`命令，然后查看每一台机器的状态，一台是`leader`，三台是`follower`, 即成功
```sh:no-line-numbers
cd /usr/local/zookeeper
# 在zookeeper目录下运行
bin/zkServer.sh start

# bin/zkServer.sh status 查看状态
# bin/zkServer.sh stop 关闭zookeeper
```

![zookeeper状态](/img/zookeeperStatus.png)



## Hadoop

### 修改配置文件

在`Master`上修改文件，然后传送到`Slave1`、`Slave2`、`Slave3`  
代码的高亮部分是可能需要修改的地方，读者应根据自身情况灵活变通。
<CodeGroup>
  <CodeGroupItem title="core-site.xml" active>

```xml{8,13}
<property>
    <name>fs.defaultFS</name>
    <value>hdfs://cluster1</value>
</property>
<!-- 这里的路径默认是NameNode、DataNode、JournalNode等存放数据的公共目录 -->
<property>
    <name>hadoop.tmp.dir</name>
    <value>/usr/local/hadoop/tmp</value>
</property>
<!-- Zookeeper集群的地址和端口。注意，数量一定是奇数，且不少于三个节点 -->
<property>
    <name>ha.zookeeper.quorum</name>
    <value>Master:2181,Slave1:2181,Slave2:2181</value>
</property>
```

  </CodeGroupItem>

  <CodeGroupItem title="yarn-site.xml">

```xml{19,24,29,}
<!-- 开启RM高可用 -->
<property>
    <name>yarn.resourcemanager.ha.enabled</name>
    <value>true</value>
</property>
<!-- 指定RM的cluster id -->
<property>
    <name>yarn.resourcemanager.cluster-id</name>
    <value>yrc</value>
</property>
<!-- 指定RM的名字 -->
<property>
    <name>yarn.resourcemanager.ha.rm-ids</name>
    <value>rm1,rm2</value>
</property>
<!-- 分别指定RM的地址 -->
<property>
    <name>yarn.resourcemanager.hostname.rm1</name>
    <value>Master</value>
</property>

<property>
    <name>yarn.resourcemanager.hostname.rm2</name>
    <value>Slave3</value>
</property>
<!-- 指定zk集群地址 -->
<property>
    <name>yarn.resourcemanager.zk-address</name>
    <value>Master:2181,Slave1:2181,Slave2:2181</value>
</property>

<property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
</property>
```

  </CodeGroupItem>

  <CodeGroupItem title="mapred-site.xml">

```xml
<!-- 指定Mapreduce运行在yarn上 -->
<property>
   <name>mapreduce.framework.name</name>
   <value>yarn</value>
</property>
```

  </CodeGroupItem>

  <CodeGroupItem title="hdfs-site.xml">

```xml{14,19,24,29,34,39}
<!-- 指定hdfs的nameservice为cluster1，需要和core-site.xml中的保持一致 -->
<property>
    <name>dfs.nameservices</name>
    <value>cluster1</value>
</property>
<!-- cluster1下面有两个NameNode，分别是nn1，nn2 -->
<property>
    <name>dfs.ha.namenodes.cluster1</name>
    <value>nn1,nn2</value>
</property>
<!-- nn1的RPC通讯地址 -->
<property>
    <name>dfs.namenode.rpc-address.cluster1.nn1</name>
    <value>Master:9000</value>
</property>
<!-- nn1的http通讯地址 -->
<property>
    <name>dfs.namenode.http-address.cluster1.nn1</name>
    <value>Master:50070</value>
</property>
<!-- nn2的RPC通讯地址 -->
<property>
    <name>dfs.namenode.rpc-address.cluster1.nn2</name>
    <value>Slave3:9000</value>
</property>
<!-- nn2的http通讯地址 -->
<property>
    <name>dfs.namenode.http-address.cluster1.nn2</name>
    <value>Slave3:50070</value>
</property>
<!-- 指定NameNode的edits元数据在JournalNode上的存放位置 -->
<property>
    <name>dfs.namenode.shared.edits.dir</name>
    <value>qjournal://Master:8485;Slave2:8485;Slave3:8485/cluster1</value>
</property>
<!-- 指定JournalNode在本地磁盘存放数据的位置 -->
<property>
    <name>dfs.journalnode.edits.dir</name>
    <value>/usr/local/hadoop/journaldata</value> #该目录要手动创建
</property>
<!-- 开启NameNode失败自动切换 -->
<property>
    <name>dfs.ha.automatic-failover.enabled</name>
    <value>true</value>
</property>
<!-- 指定该集群出故障时，哪个实现类负责执行故障切换 -->
<property>
    <name>dfs.client.failover.proxy.provider.cluster1</name>
    <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
</property>
<!-- 配置隔离机制方法，多个机制用换行分割，即每个机制暂用一行 -->
<property>
    <name>dfs.ha.fencing.methods</name>
    <value>sshfence
           shell(/bin/true)
    </value>
</property>
<!-- 使用sshfence隔离机制时需要ssh免登录 -->
<property>
    <name>dfs.ha.fencing.ssh.private-key-files</name>
    <value>/root/.ssh/id_rsa</value>
</property>
<!-- 配置sshfence隔离机制超时时间 -->
<property>
    <name>dfs.ha.fencing.ssh.connect-timeout</name>
    <value>30000</value>
</property>
```

  </CodeGroupItem>

  <CodeGroupItem title="slaves">

```sh:no-line-numbers
Master
Slave1
Slave2
Slave3
```

  </CodeGroupItem>

</CodeGroup>

```sh:no-line-numbers
# 修改好配置文件后，传送整个hadoop文件夹到Slave1、Slave2、Slave3
sudo scp -r /usr/local/hadoop Slave1:/usr/local
sudo scp -r /usr/local/hadoop Slave2:/usr/local
sudo scp -r /usr/local/hadoop Slave3:/usr/local

# 传送完成后在接收文件的机器上修改文件归属用户
# sudo chown -R hadoop /usr/local/hadoop
```

### 配置环境变量
```sh:no-line-numbers{4}
# 四台机器都要配置hadoop环境变量，注意替换路径
sudo vim ~/.bashrc

export HADOOP_HOME=/usr/hadoop/hadoop
export CLASSPATH=$CLASSPATH:$HADOOP_HOME/lib
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin

source ~/.bashrc
```

## 启动高可用集群
::: danger 注意事项
删除四台机器hadoop目录下的tmp目录（如果存在的话）
:::

### 格式化Zookeeper
在`Master`上运行命令
```sh:no-line-numbers
hdfs zkfc -formatZK
```
![格式化zookeeper](/img/FormatZookeeper.png)

### 格式化NameNode
在四台机器的zookeeper集群开启状态下，在`Master`运行命令`start-all.sh`启动hadoop集群
![启动hadoop集群](/img/StartHadoop.png)

启动hadoop集群后在`Master`上格式化NameNode
```sh:no-line-numbers
hdfs namenode -format
```
![格式化namenode](/img/FormatNameNode.png)

### 重启hadoop集群
![重启hadoop集群](/img/RestartHadoop.png)
![重启hadoop集群](/img/RestartHadoop2.png)

### ResourceManager进程
Slave3上运行命令：
```sh:no-line-numbers
cd /usr/local/hadoop
sbin/yarn-daemon.sh start resourcemanager
# 执行后运行jps命令查看是否启动成功
```
![开启resoucemanager节点](/img/ResourceManager.png)

### 主从同步
```sh:no-line-numbers
# NameNode主从同步，在Slave3上执行同步命令，然后重启集群，Slave3上新增NameNode节点
hdfs namenode -bootstrapStandby
```
![主从同步](/img/bootstrapStandby.png)

在`Master`上重启hadoop集群
![重启hadoop集群](/img/RestartHadoop3.png)
![重启hadoop集群](/img/RestartHadoop4.png)

---
至此，Master和Slave3上共运行8个相同的进程
<CodeGroup>
  <CodeGroupItem title="Master" active>

```sh
NameNode
Jps
JournalNode
ResourceManager
DataNode
NodeManager
QuorumPeerMain
DFSZKFailoverController
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave1">

```sh
NodeManager
DataNode
QuorumPeerMain
Jps
```

  </CodeGroupItem>

  <CodeGroupItem title="Slave2">

```sh
NodeManager
DataNode
QuorumPeerMain
Jps
JournalNode
```

  </CodeGroupItem>
</CodeGroup>

## 高可用测试
### 查看集群状态
在浏览器输入Master和Slave3的`外网IP:50070`，查看`OverView`栏目  
可以看到，Matser的状态为`active`，Slave3的状态为`standy`
![Master状态](/img/MasterStatus.png)
![Slave3状态](/img/Slave3Status.png)
在浏览器输入Master的`外网IP:8088`
![集群状态](/img/ClusterStatus.png)

### 测试
杀掉Master上的NameNode进程，Slave3的NameNode的状态由standby转变为active
![杀掉NameNode进程](/img/killprocess.png)
![高可用测试](/img/test1.png)
![高可用测试](/img/test2.png)

至此，高可用集群搭建完成。

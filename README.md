# MiniMessage

![Python](https://img.shields.io/badge/Python-3.6.3-blue.svg)
![Flask](https://img.shields.io/badge/Flask-0.12.2-blue.svg)

A web chat room application. Developed with Flask framework, Sqlite, jQuery 3 and Bootstrap 4.

一个在线网页聊天室，使用 Flask 框架、jQuery 3 和 Bootstrap 4 开发。

Visit [mime.billyzou.com](http://mime.billyzou.com/) to get started!

请访问 [mime.billyzou.com](http://mime.billyzou.com/) 来使用。

![overview](https://s1.ax1x.com/2018/04/12/CEUS1O.png)

## Installation 安装

### Download 下载

```bash
git clone https://github.com/DaKoala/MiniMessage.git
```

### Dependencies 依赖组件

- Flask

- Flask-SQLalchemy

- SQLite

### Database creation 数据库创建

Run Python console first 请先运行Python console

```python
>>> from views import db

>>> db.create_all()
```

### Run 运行

Run on localhost to test 本地调试

```bash
python3 run.py 0
```

Run on server 服务器运行

```bash
python3 run.py 1
```

## User Guide 用户指引

### Sign up 注册

![Signup](https://s1.ax1x.com/2018/04/12/CEUiBd.png)

If it is the first time you use this application, please sign up.

如果是初次使用，需要先注册账号。

### Login 登录
![login](https://s1.ax1x.com/2018/04/12/CEUFHA.png)

Log in with your email address and password.

输入邮箱地址和密码来登录。

### Chat 聊天

![chat](https://s1.ax1x.com/2018/04/12/CEUpcD.png)

The default chatting group is "Lobby", where you can see all online users. Online users are displayed on the left. At the top there are different chatting groups. Displaying area is in the middle and input area is at the bottom. 

默认聊天频道为大厅，在大厅中左边会显示所有的在线用户。上方为不同的聊天组，中间是消息显示区域，底部为输入框。

![create](https://s1.ax1x.com/2018/04/12/CEUPnH.png)

Click the green "+" button at the top to create a new chatting group.

点击聊天群组栏左边的绿色按钮来新建一个聊天群组。

![private](https://s1.ax1x.com/2018/04/12/CEU9je.png)

Messages in the private chatting groups can only seen by group members. Now users displayed in the online user list are online group members. You can quit groups by clicking the tab of the group name.

私密聊天群组的内容只能被组员看到，此时左边的在线用户列表变成了在线的群组成员。再次点击上方群组可以退出群组。
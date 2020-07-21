### day01任务
	1.安装数据库
			所需文件：react项目_stu\files\MongoDB\mongodb_4.0_64位.msi
			要求：关闭一切电脑上的安全软件
			备注：尽量不更改安装位置，大概占用400MB空间左右
			如何查看数据库是否处于运行状态：
			win + r，输入：services.msc，找到MongoDB server，处于【正在运行】
	2.启动项目服务器：
			1.进入react_server,执行yarn，安装所有依赖。（全局：npm，局部：yarn）
			2.执行yarn start，运行服务器
	3.启动项目：
			1.进入react_admin,执行yarn，安装所有依赖。（全局：npm，局部：yarn）
			2.清空浏览器的cookie-------3000
			3.进入react_admin,执行yarn start
	4.导入数据：
			初始化服务器端数据：借助Studio-3T导入数据：
				导入：ddbs(需要导入数据库)文件夹下的所有json文件
	5.演示项目
	6.简单分析项目文件
				jsconfig.json：vscode所特有的配置文件
				config-overrides.js：路径简写配置
				api：定义接口请求的文件--按照功能点进行拆分的
				assets：公共资源文件(样式、图片)
				utils:公共js文件（工具函数）、api和uitils的关系
				components：可复用组件
				pages：路由组件
				config: 配置文件
					asyncComps.js懒加载 
					icon.js图标 
					route.js路由配置
					没有登录的话，只能访问login和404页面，其他页面由后台控制。
				layouts：整体布局模块，每个页面都会用到的固有布局，分为：私有的、公开的
				locales：国际化的配置在这里
				redux：redux状态管理
	7.添加一个菜单的流程：
				1.在src/pages/Edu 下新建Subejct，里面编写index.jsx
				2.在config/asyncComps.js 中引入上一步编写的Subject组件，随后暴露
				3.在系统页面：权限管理 => 菜单管理 => 教育管理 => 加号
					菜单名称：课程分类管理  
					访问路径: /subject/list
					组件路径：Subject
				4.给指定角色分配菜单权限(让菜单有人可以访问)
					找到指定角色，点击“小齿轮”，勾选上刚才添加的菜单，随后刷新页面。
	 8.课程分类_静态组件：用到了antd的Card组件、Table组件(列的高级渲染)
	 9.编写api接口请求数据

### day02任务
			1.Table组件接入真实数据
			2.真分页与假分页
			3.pagination分页器的使用：
				页码改变回调：onChange
				展示页码切换器：showSizeChanger
				页大小改变回调：onShowSizeChange
			4.响应展开行：
					若展示自身额外数据，使用expandedRowRender
					若有其他逻辑(例如ajax请求)，使用：onExpandedRowsChange --- 会看children属性
			5.根据一级分类id请求二级分类数据
			6.展开行回调中注意判断，展开才发请求，折叠不发请求
			7.请求回的数据维护到一级分类中。
			8.展示二级分类数据+优化
			9.配置课程分类管理中的添加分类路由
					1.在：src/pages/Edu/Subject/components/AddSubject/index.jsx
					2.在config/asyncComps.js引入，随后暴露
					3.在系统页面：权限管理 => 菜单管理 => 教育管理 => 学科分类管理 => 加号
						输入：	
						菜单名称：添加课程分类
						访问路径：/subject/add
						组件路径：AddSubject
						按钮权限：subject.add
					4.给指定角色分配菜单权限(让菜单有人可以访问)
						找到指定角色，点击“小齿轮”，勾选上刚才添加的菜单，随后刷新页面。
			10.添加课程分类_Form组件
						
	

### day03任务：
		1.新增课程分类：Select组件、Form组件、Select中数据的懒加载。
		2.编辑课程分类：Tooltip提示组件、点击编辑将当前分类信息存入自身state
									 在Tbale组件的列配置中，render与dataIndex的配合
									 请求更新课程分类之后，不要刷新当前页面，而是自己遍历更新数据(体验好)
		3.删除课程分类：confirm提示组件的使用，注意：非第一页删除最后一条数据问题。
		4.章节管理：静态组件：Search、List
		5.Search组件--静态
		6.Search组件-交互
		7.分析项目redux结构
		8.Search组件与redux交互

### day04任务
		1.章节列表List组件与redux交互---展示列表
		2.判断章节还是课时，决定渲染每一行的哪些信息，例如：预览图标、新增按钮。
		3.展开章节查询课时信息----与redux交互，找到展开的那个章节，给children追加数据
		4.全屏切换---使用的库：screenfull，注意：浏览器全屏、页签的全屏
		5.预览视频---用到的库：video-react,注意：Modal消失后，要“杀掉”里面的播放器
		6.章节管理——配置新增课时菜单
				(1).创建组件：src/pages/Edu/Chapter/components/AddLesson/index.jsx
				(2).在src/config/asyncComps.js里引入上方组件
				(3).权限管理==>菜单管理==>教育管理===>章节管理
					菜单名称:添加课时
					访问路径:/chapter/addlesson
					组件路径:AddLesson
					按钮权限:chapter.addlesson
		7.章节管理——编写上传组件
				 (1).Form组件配合Switch会产生value的警告，使用valuePropName属性解决
				 (2).Upload组件限制：文件大小、文件类型。

### day05任务
		1.前端上传文件的两个模型
		2.注册七牛云、实名认证、建立空间
		3.获取自己七牛云机密数据：
					七牛云-右上角：密钥管理===>获取自己的AK、SK
					七牛云-空间管理：复制自己的空间名
		4.编辑admin_server/config/index.js
					const ACCESS_KEY = "你的AK";
					const SECRET_KEY = "你的SK";
					const BUCKET = "你的空间名字";
		5.postman测试接口：
					测试http://localhost:5000/uploadtoken，看是否可以返回一个七牛云token
		6.根据七牛云文档，完成上传组件的编写
					注意：1.token的复用 2.监测文件的进度 3.进度条
		7.完成添加课时
					注意：在Form表单中如何自动收集一个非antd内置组件的值---onChange
		8.章节管理_Table组件的勾选API

### day06任务
			1.章节管理_勾选后对id进行分类
			2.章节管理_编写批量删除的api
			3.章节管理_删除后遍历数据将redux中的数删除
					注意：要用的一些基础的数组遍历方法:find、map、indexOf
			4.课程管理_搜索组件(静态),用到了：级联选择器
			5.课程管理_列表组件(静态)
			6.使用PubSub完成Search与List组件的数据局交互
			7.格式化数据:Table组件的排序、dayjs格式化时间
			复习：Promise、axios、圣杯双飞翼布局

### day07任务
		1.应用国际化:
				注意：我们做的国际化是应用骨架的国际化，不是数据的国际化。
							若想做数据的国际化，需要服务器配合。
				（1）.自定义国际化-具体步骤如下：
								1).社区精选组件===>应用国际化===>react-intl
								2).yarn add react-intl
								3).创建语言包（中文、英文）
											src/locales/zh_CN.json
											src/locales/zh_TW.json
											src/locales/en.json
								4).App.js中如下操作：
											【1】引入：
													//引入国际化库
													import {IntlProvider} from 'react-intl'
													//引入所有语言包
													import {zh_CN,zh_TW,en} from './locales'
											【2】创建当前语言环境
													<Router history={history}>
														<IntlProvider 
															messages={zh_TW} //指定使用哪个语言包
														>
															<Layout/>
														</IntlProvider>
													</Router>
								5).基本使用：
										方案一：
												在要国际化的组件中引入：import {FormattedMessage} from 'react-intl'
												要国际化的文字，改成：<FormattedMessage id="title"/>
										方案二：
												在要国际化的组件中引入：import {Xxxxxx,injectIntl} from 'react-intl'
												装饰：
													@injectIntl
													class SearchCourse extends Component{}
													export default SearchCourse
												要国际化的文字，改成：this.props.intl.formatMessage({id:'title'})
								6).更多用法：
											<FormattedMessage 
												id="title" 
												values={{name:'tom',age:19}}
												// tagName='button'
												/* values={{
													name:<button style={{backgroundColor:'red'}}>tom</button>,
													age:<button style={{backgroundColor:'blue'}}>19</button>
												}} */
											>
												{(p1,p2)=>{
													console.log(p1,p2);
													return <Button>{p1},{p2}</Button>
												}}
											</FormattedMessage>
					（2）.antd国际化-具体步骤如下：
									引入：
											//引入antd的国际化库
											import {ConfigProvider} from 'antd'
											//引入antd的语言包
											import en from 'antd/es/locale/en_US';
											import zh_CN from 'antd/es/locale/zh_CN';
											import zh_TW from 'antd/es/locale/zh_TW';
									创建语言环境
											<ConfigProvider locale={具体的语言包}>
												.....
											<ConfigProvider/>
		2.数据可视化：
				1.Echarts的基本使用，（柱状图、折线图、饼状图）
				2.react中使用Echarts制作一个柱状图(同时显示库存和销量)
				3.bizCharts的使用，https://bizcharts.net/		


### day08任务:
		1.首页Tab组件切换、bizCharts的柱状图
		2.登录组件：输入项校验
		3.登录组件：Form组件校验指定项
		4.登录组件：根据用户选择的登录方式，校验对应输入项、发送对应请求
		5.验证码登录逻辑图
		6.实现验证码登录(没有备案的应用是不可以调用短信服务商API的)
		7.oauth2.0原理图
		8.用postman模拟服务器拉取github上用户信息(必须练习)
		9.完成gihub授权登录
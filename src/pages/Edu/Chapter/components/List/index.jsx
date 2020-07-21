import React, { Component } from 'react'
import {Card,Button,Alert,Table,Tooltip,Modal, message } from 'antd'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getLessonListByChapter,getChapterListSync} from '@/pages/Edu/Chapter/redux'
import {
	PlusOutlined,
	FullscreenOutlined,
	FullscreenExitOutlined,
	ReloadOutlined,
	SettingOutlined,
	FormOutlined,
	DeleteOutlined,
	EyeOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import PubSub from 'pubsub-js'
import screenfull from 'screenfull'
import { Player } from 'video-react';
import {reqBatchRemoveChapter} from '@/api/edu/chapter'
import {reqBatchRemoveLesson} from '@/api/edu/lesson'
import './index.less'
import 'video-react/dist/video-react.css';

const { confirm } = Modal;
@connect(
	(state)=>({chapterInfo:state.chapterInfo}),//用于给组件映射redux中的状态
	{getLessonListByChapter,getChapterListSync}//用于给组件映射简介操作状态的方法
)
@withRouter
class List extends Component {

	state = {
		expandedIds:[],//展开了哪些菜单
		isFull:false, //用于标识是否处于全屏状态
		visibleVideo:false, //是否展示视频预览窗
		videoInfo:{ //当前预览视频信息
			title:'',//视频标题
			url:''//视频地址
		},
		selectedChapterIds:[], //准备批量删除章节的id数组
		selectedLessonIds:[] //准备批量删除课时的id数组
	}

	componentDidMount(){
		//订阅消息，用于清空expandedIds
		this.token = PubSub.subscribe('clearExpandedIds',()=>{
			this.setState({expandedIds:[]})
		});
		//检测浏览器页签变化===>无论使用哪一种方式让页签全屏，都会被screenfull检测到
		screenfull.on('change',()=>{
			//屏幕全屏发生变化时，调用该回调
			const {isFull} = this.state
			//切换全屏状态
			this.setState({isFull:!isFull})
		})
	}

	componentWillUnmount(){
		//取消订阅
		PubSub.unsubscribe(this.token);
		//清空redux中所保存的章节信息
		this.props.getChapterListSync({total:0,items:[]})
	}

	//展开某一个章节的回调
	handleExpanded = async(expandedIds)=>{
		//从状态中获取expandedKeys
		const {expandedIds:keys} = this.state
		const {chapterInfo} = this.props
		//判断是展开还是折叠，展开再发请求
		if(keys.length < expandedIds.length){
			//获取当前展开章节的_id
			const id =  expandedIds.slice(-1)[0]
			//获取当前展开的章节
			const currentChapter  = chapterInfo.items.find((chapterObj)=> chapterObj._id === id)
			if(!currentChapter.children.length) this.props.getLessonListByChapter(id)
		}
		//将当前的展开项的id数组，维护进状态
		this.setState({expandedIds})
	}

	//点击全屏按钮的回调
	handleFullScreen = ()=>{
		screenfull.toggle(this.refs.demo) //切换全屏
	}

	//展示视频弹窗
	showVideo = ({title,video})=>{
		//设置预览视频信息
		this.setState({visibleVideo:true,videoInfo:{title,url:video}})
	}

	//关闭视频预览窗回调
	handleCancel = ()=>{
		this.setState({visibleVideo:false})
	}

	//勾选表格中某一行的回调
	handleSelect = (_,selectedItems)=>{
		//要对所勾选的id进行分类，分为：章节id数组、课时章节数组
		let selectedChapterIds = [] //章节id数组
		let selectedLessonIds = [] //课时id数组
		//判断选中的是章节还是课时
		selectedItems.forEach((selectedObj)=>{
			if('chapterId' in selectedObj) selectedLessonIds.push(selectedObj._id)
			else selectedChapterIds.push(selectedObj._id)
		})
		//选中的值更新状态
		this.setState({selectedChapterIds,selectedLessonIds})
	}

	//执行批量删除
	batchDelete = async()=>{
		//获取选中的章节、课时
		const {selectedChapterIds,selectedLessonIds} = this.state
		//批量发送请求
		await Promise.all([
			reqBatchRemoveChapter(selectedChapterIds),//批量删除章节
			reqBatchRemoveLesson(selectedLessonIds)//批量删除课时
		])
		//清空状态中所保存的勾选了的id数组
		this.setState({selectedChapterIds:[],selectedLessonIds:[]})
		//从redux中获取章节数据
		const chapterInfo = {...this.props.chapterInfo}
		//过滤掉那些删除了的章节
		let filteredChapterList = chapterInfo.items.filter( chapter => 
			selectedChapterIds.indexOf(chapter._id) === -1
		)
		//过滤掉那些删除了的课时
		filteredChapterList = filteredChapterList.map((chapter)=>{
			if(chapter.children.length){
				const filteredLessonList = chapter.children.filter(lesson =>
					selectedLessonIds.indexOf(lesson._id) === -1
				)
				chapter.children = [...filteredLessonList]
			}
			return chapter
		})
		//通知redux存入过滤后的章节信息
		this.props.getChapterListSync({
			total:filteredChapterList.length,
			items:filteredChapterList
		})
		message.success('批量删除成功！')
	}

	//批量删除按钮对应回调
	handleBatchDelete = ()=>{
		confirm({
			title: '确定批量删除吗？',
			icon: <ExclamationCircleOutlined />,
			content: '删除后无法恢复，谨慎操作！',
			onOk:()=> {
				this.batchDelete()
			},
		});
	}

	render() {
		//获取redux中传递过来的章节信息
		const {chapterInfo} = this.props
		//从状态中获取展开的id数组
		const {
			expandedIds, //展开项的id数组
			visibleVideo, //是否展示视频弹窗
			videoInfo, //视频信息(包含:title,url)
			selectedLessonIds, //选择的课程id
			selectedChapterIds //选择的章节id
		} = this.state
		//表格列的配置
		const columns = [
			{ 
				title: '章节名称',
				dataIndex: 'title',
				key: 'title',
				width:'40%'
			},
			{ 
				title: '是否免费', 
				//dataIndex: 'free',
				key: 'free', 
				render:(item)=>(
					"free" in item ? item.free ? '是' : '否' : ''
				)
			},
			{ 
				title: '视频', 
				//dataIndex: 'video', 
				key: 'video',
				render:(item)=> item.video ? 
				<Button onClick={()=>this.showVideo(item)} icon={<EyeOutlined />}></Button> : ''
			},
			{ 
				title: '操作', 
				align:'center',
				//dataIndex: '_id',//数据索引(该列展示什么信息)
				key: 'option',
				render:(item)=>(
					<>
						{ "free" in item ? "" : 
							<Tooltip placement="top" title="新增课时">
								<Button 
										onClick={()=>this.props.history.push('/edu/chapter/addlesson',item._id)}
										type="primary" 
										className="edit_btn" 
										icon={<PlusOutlined />}
								>
								</Button>
							</Tooltip>
						}
						<Tooltip placement="top" title="编辑">
							<Button 
									type="primary" 
									className="edit_btn" 
									icon={<FormOutlined />}
							>
							</Button>
						</Tooltip>
						<Tooltip placement="top" title="删除">
							<Button 
								type="danger" 
								icon={<DeleteOutlined />}
							></Button>
						</Tooltip>
					</>
				)
			},
		];
		
		return (
			<div ref="demo" className="wraper">
				{/* 章节列表 */}
				<Card 
					title="课程章节列表"
					extra={
						<>
							<Button type="primary" icon={<PlusOutlined />}>新增章节</Button>		
							<Button 
								onClick={this.handleBatchDelete} 
								className="batch_delete_btn" 
								type="danger"
							>批量删除</Button>
							<Button 
								size="large"
								onClick={this.handleFullScreen}
								className="option_btn" 
								type="link" 
								icon={this.state.isFull ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
							></Button>
							<Button size="large" className="option_btn" type="link" icon={<ReloadOutlined />}></Button>
							<Button size="large" className="option_btn" type="link" icon={<SettingOutlined />}></Button>
						</>
					}
					className="chapter_list"
				>
					<Alert message={`已选择${selectedLessonIds.length + selectedChapterIds.length}项目`} type="info" />
					<Table
						className="table_list"
						rowKey="_id" //唯一标识
						columns={columns} //表格中列的配置
						dataSource={chapterInfo.items}//表格的数据源(存储数据的数组)
						expandable={{ //配置展开属性
							onExpandedRowsChange:this.handleExpanded,//展开一项的回调
							expandedRowKeys:expandedIds //展开的菜单
						}}
						rowSelection={{//配置勾选属性
							onChange:this.handleSelect, //勾选变换的回调
							selectedRowKeys:[...selectedChapterIds,...selectedLessonIds] //勾选的菜单
						}}
					/>
				</Card>
				{/* 展示视频弹窗 */}
				<Modal
					footer={null}//不展示底部footer
					destroyOnClose={true}//关闭弹窗后销毁Modal中子元素
          title={videoInfo.title} //弹窗标题
          visible={visibleVideo} //控制弹窗隐藏还是显示
          //onOk={this.handleOk}//确认按钮的回调
          onCancel={this.handleCancel}//取消按钮的回调
        >
					{/* 播放器 */}
          <Player>
						<source src={videoInfo.url} />
					</Player>
        </Modal>
			</div>
		)
	}
}
export default List

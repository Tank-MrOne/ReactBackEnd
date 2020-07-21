import React, { Component } from 'react'
import { Card,Button,Table,Input,Tooltip,message,Modal} from 'antd';
import { 
	PlusOutlined,
	FormOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined 
} from '@ant-design/icons';
import {
	reqNo1SubjectPagination,
	reqAllNo2SubjectById,
	reqUpdateSubject,
	reqDeleteSubject
} from '@/api/edu/subject'
import './index.less'

//从Modal中获取confirm，用于做选择性弹窗
const { confirm } = Modal;

export default class Subject extends Component {

	state = {
		pageSize:4,//页大小
		loading:true,//是否处于加载中
		expandedIds:[],//展开了哪些菜单
		no1SubjectInfo:{ //一级分类信息
			total:0,//总数
			items:[]//当前页的数据
		},
		current:1,//当前页码
		editSubjectId:'',//当前正在编辑的学科分类id
		editSubjectTitle:'',//当前正在编辑的学科分类的名字
	}

	componentDidMount(){
		//请求一级分类数据(分页)
		this.getNo1SubjectPagination(1)
	}
	
	//根据页码、页大小请求一级分类数据(分页)
	getNo1SubjectPagination = async(page,pageSize=this.state.pageSize)=>{
		//清空当前页展开的一级分类数组
		this.setState({expandedIds:[],loading:true})
		//发请求获取数据
		let result = await reqNo1SubjectPagination(page,pageSize)
		//解构赋值获取数据
		let {total,items} = result
		//加工items，给每一个一级分类追加children属性，值为[],目的是让每一项都可以展开。
		items = items.map((no1Subject)=>{
			no1Subject.children = []
			return no1Subject
		})
		//将结果维护进自身状态
		this.setState({no1SubjectInfo:{total,items},loading:false})
	}

	//展开某个一级分类的回调
	handleExpanded = async(expandedIds)=>{
		//从状态中获取expandedKeys
		const {expandedIds:keys,no1SubjectInfo:{total,items}} = this.state
		//如果是展开菜单，再请求
		if(keys.length < expandedIds.length){
			//获取当前展开的一级分类_id
			const id =  expandedIds.slice(-1)[0]
			//获取当前展开的一级分类
			const currentNo1Subject = items.find(subject => subject._id === id)
			//如果该一级分没有展开过
			if(currentNo1Subject.children && !currentNo1Subject.children.length){
				//请求二级数据
				this.setState({loading:true})
				let no2SubjectInfo = await reqAllNo2SubjectById(id)
				//将请求回来的二级数据存入对应一级分类的children属性中
				const list = items.map((no1Subject)=>{
					if(no1Subject._id === id) {
						//给当前一级分类children属性添加内容
						no1Subject.children = [...no2SubjectInfo.items]
						//如果没有二级分类数据，干掉children属性
						if(!no2SubjectInfo.items.length) delete no1Subject.children
					}
					return no1Subject
				})
				//更新状态中的一级分类数据
				this.setState({no1SubjectInfo:{total,items:list},loading:false})
			}
		}
		//维护当前展开项到状态
		this.setState({expandedIds})
	}

	//编辑按钮的回调
	handleEdit = (subject)=>{
		//维护当前编辑的id，title到状态中
		this.setState({
			editSubjectId:subject._id,
			editSubjectTitle:subject.title
		})
	}

	//响应用户输入分类名的回调
	handleChange = (e)=>{
		this.setState({editSubjectTitle:e.target.value})
	}

	//确定更新的回调
	updateSubject = async()=>{
		//状态中获取当前正在编辑的id和title
		const {editSubjectId,editSubjectTitle,no1SubjectInfo} = this.state
		//校验数据
		if(editSubjectTitle === ''){
			message.error('分类名不能为空',0.5)
			return
		}
		//发送请求更新分类
		await reqUpdateSubject(editSubjectId,editSubjectTitle)
		//清空保存过的id和title
		this.setState({editSubjectId:'',editSubjectTitle:''})
		//根据更新分类的id，去状态中修改对应分类的名字
		let updatedItems = no1SubjectInfo.items.map((no1Subject)=>{
			if(editSubjectId === no1Subject._id){
				no1Subject.title = editSubjectTitle
			}else{
				//若编辑的不是一级分类，去二级分类中继续查找
				if(no1Subject.children){
					no1Subject.children = no1Subject.children.map((no2Subject)=>{
						if(no2Subject._id === editSubjectId){
							no2Subject.title = editSubjectTitle
						}
						return no2Subject
					})
				}
			}
			return no1Subject
		})
		//更新状态
		this.setState({
			no1SubjectInfo:{
				total:no1SubjectInfo.total,
				items:[...updatedItems]}
		})
	}

	//删除分类的回调
	deleteSubject = ({_id,title})=>{
		confirm({
			title: (//主标题
				<div>
					确认删除<span className="delete_show">{title}</span>吗?
				</div>
			),
			icon: <ExclamationCircleOutlined />,//图标
			content: '请谨慎操作，删除后不可恢复',//副标题
		  onOk:async()=> { //确认的回调
				await reqDeleteSubject(_id)
				let {current,no1SubjectInfo} = this.state
				if(current > 1 && no1SubjectInfo.items.length === 1) current -= 1
				this.setState({current})
				this.getNo1SubjectPagination(current)
			},
			// okText:'确认',//确认按钮的文字
			// cancelText:'取消'
		});
	}

	render() {

		//从状态中获取一级分类数据
		const {no1SubjectInfo,pageSize,expandedIds,editSubjectId,current} = this.state

		//表格列的配置
		const columns = [
			{ 
				title: '分类名', //列名
				//dataIndex: 'title', //数据索引(改列展示什么信息)
				key: 'title', //每一列的唯一标识，保证唯一即可
				width:'70%',
				render:(sub)=>(
					sub._id === editSubjectId ? 
					<Input 
						onChange={this.handleChange}
						defaultValue={sub.title} 
						className="edit_input"
					/>:sub.title
				)
			},
			{ 
				title: '操作', 
				align:'center',
				//dataIndex: '_id',//数据索引(改列展示什么信息)
				key: 'option',
				//render用于做高级渲染，当和dataIndex和render同时存在时，渲染结果以render为主，参数受dataIndex控制
				render: (sub) =>(//render方法返回什么，就展示什么
					sub._id === editSubjectId?
					<>
						<Button 
							onClick={this.updateSubject}
							size="small" 
							type="primary"
						>确定
						</Button>
						<Button 
							onClick={()=>{this.setState({editSubjectId:'',editSubjectTitle:''})}}
							size="small" 
							className="cancel_edit"
						>取消
						</Button>
					</>:
					<>
						<Tooltip placement="top" title="编辑分类">
							<Button 
									onClick={()=>{this.handleEdit(sub)}}
									type="primary" 
									className="edit_btn" 
									icon={<FormOutlined />}
							>
							</Button>
						</Tooltip>
						<Tooltip placement="top" title="删除分类">
							<Button 
								onClick={()=>{this.deleteSubject(sub)}}
								type="danger" 
								icon={<DeleteOutlined />}
							></Button>
						</Tooltip>
					</>
				)
			},
		];

		return (
			<Card 
				title={
					<Button
						 onClick={()=>{this.props.history.push('/edu/subject/add')}}
						 type="primary" 
						 icon={<PlusOutlined/>}
					>
						新建课程分类
					</Button>
				}
			>
				<Table
					loading={this.state.loading}
					rowKey="_id" //唯一标识
					pagination={{//分页器配置
						pageSize,//页大小
						// disabled:true,//禁用分页器
						// showQuickJumper:true,//展示快速跳转
						// showTitle:false,//隐藏原生的提示
						// size:'small',//尺寸大小
						// simple:true,//展示简单分页
						//showTotal:(total,range)=>{console.log(total,range);},
						hideOnSinglePage:true,//只有一页时是否隐藏分页器
						total:no1SubjectInfo.total,//数据总数
						current,
						showSizeChanger:true,//展示页大小切换器
						pageSizeOptions:['1','2','3','4','5','10','15'],//页大小备选器
						onChange:(page)=>{//页码改变的回调
							this.setState({current:page})
							this.getNo1SubjectPagination(page)
						},
						onShowSizeChange:(_,pageSize)=>{//页大小改变的回调
							//react中改变完状态，紧接着去查看装状态，查看到的依然是修改前的值。
							//setState调用后引发react去更新状态的动作，时而异步，时而同步（后期仔细讲）
							//第一种：
							/* this.setState({pageSize},()=>{
								this.getNo1SubjectPagination(1,this.state.pageSize)//重新请求数据
							}) */
							//第二种：
							this.setState({pageSize})
							this.getNo1SubjectPagination(1,pageSize)
						}
					}}
					columns={columns} //表格中列的配置
					dataSource={no1SubjectInfo.items}//表格的数据源(存储数据的数组)
					expandable={{ //配置展开属性
						//onExpandedRowsChange属性适用于:展开后进行其他业务逻辑，例如发送请求
						//备注：如果使用onExpandedRowsChange，还想让该项可以展开，必须保证该项拥有children属性。
						onExpandedRowsChange:this.handleExpanded,
						expandedRowKeys:expandedIds
						//expandedRowRender: (record) => record._id, //此属性适用于:展开该项身上所固有的属性，而不是再次发请求。
						//rowExpandable: record => record.title !== '前端', //控制该项是否可以展开
					}}
				/>
			</Card>
		)
	}
}

import React, { Component } from 'react'
import {Card,Button,Form, Input,Select,Divider } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons';
import {reqNo1SubjectPagination,reqAddSubject} from '@/api/edu/subject'
import './index.less'

const {Item} = Form //从Form组件中获取Item组件
const { Option } = Select;//从Select组件中获取Option
let page = 1 //页码初始值

export default class AddSubject extends Component {

	state = {
		no1SubjectInfo:{ //一级分类数据
			total:0,
			items:[]
		}
	}

	//获取一级分类数据
	getNo1SubjectList = async(page,pageSize=5)=>{
		let result = await reqNo1SubjectPagination(page,pageSize)
		const {no1SubjectInfo} = this.state
		const {total,items} = result
		this.setState({
			no1SubjectInfo:{
				total,
				items:[...no1SubjectInfo.items,...items]
			}
		})
	}

	componentDidMount(){
		page = 1
		//请求一级分类数据
		this.getNo1SubjectList(page)
	}

	//加载更多
	loadMore = ()=>{
		page++
		this.getNo1SubjectList(page)
	}

	//表单校验成功的回调
	onFinish = async({title,parentId}) => {
		await reqAddSubject(title,parentId)
		this.props.history.replace('/edu/subject/list')
	};

	//表单校验失败的回调(几乎不用)
	onFinishFailed = err => {
		console.log('表单校验失败:', err);
	};
	
	render() {
		const {no1SubjectInfo} = this.state
		const {total,items} = no1SubjectInfo
		return (
			<Card 
				title={
					<>
						<Button 
							onClick={()=>{this.props.history.goBack()}}
							type="link" 
							icon={<ArrowLeftOutlined />}
						></Button>
						<span>添加课程分类</span>
					</>
				}
			>
				<Form
					initialValues={{parentId:''}}
					labelCol={{span:3}}//文字提示去所占比
					wrapperCol={{span:6}}//输入区域去所占比
					//name="basic"//表单的名字(非必须)
					onFinish={this.onFinish}//点击提交按钮，且表单校验成功的回调
					onFinishFailed={this.onFinishFailed}//点击提交按钮，且表单校验失败的回调
				>
					<Item 
						name="title" //必须给输入项一个名字
						label="课程分类名" 
						rules={[ //rules中配置校验规则
							//每一条规则就是一个对象，注意：必须给Item一个name属性
							{required:true,message:'课程分类名必须填写'},
							// {max:6,message:"不好意思，只能是6位"}
						]}
					>
						<Input/>
					</Item>
					<Item 
						name="parentId" 
						label="所属父级分类" 
						rules={[{required:true,message:'必须填'}]}
					>
						<Select
							dropdownRender={menu => (
								<div>
									{menu}
									<Divider className="divider"/>
									{
										items.length < total ? 
										<Button onClick={this.loadMore} type="link">加载更多....</Button> :
										<Button disabled type="link">没有更多数据了</Button>
									}
								</div>
							)}
						>
							<Option key="0" value="">请选择分类</Option>
							<Option key="1" value="0" style={{color:'red',fontWeight:'bold'}}>一级分类</Option>
							{
								no1SubjectInfo.items.map((subjectObj)=>
									<Option key={subjectObj._id} value={subjectObj._id}>{subjectObj.title}</Option>)
							}

						</Select>
					</Item>
					<Item wrapperCol={{offset: 3}}>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Item>
				</Form>
			</Card>
		)
	}
}

import React, { Component } from 'react'
import {Card,Button,Form,Input,Switch,message } from 'antd'
import {
	ArrowLeftOutlined,
} from '@ant-design/icons';
import Upload from '@/components/Upload'
import {reqAddLesson} from '@/api/edu/lesson'

const {Item} = Form
export default class AddLesson extends Component {

	//添加课时的回调
	handleFinish = async(values)=>{
		//获取当前操作的课程
		values.chapterId = this.props.history.location.state
		//添加课时
		await reqAddLesson(values)
		message.success('课时添加成功！')
		//跳转页面
		this.props.history.replace('/edu/chapter/list')
	}

	render() {
		return (
			<Card 
				title={
					<>
						<Button 
							onClick={()=>{this.props.history.goBack()}}
							type="link" 
							icon={<ArrowLeftOutlined />}
						></Button>
						<span>添加课时</span>
					</>
				}
			>
				<Form
					onFinish={this.handleFinish}
					wrapperCol={{span:6}}
					initialValues={{free:true}}
				>
					<Item 
						label="课时名称"
						name="title"
						rules={[{required:true,message:'课时名称必须输入'}]}
					>
						<Input/>
					</Item>
					<Item
						// label={<><span style={{color:'red',marginRight:'5px'}}>*</span><span>是否免费</span></>}
						label="是否免费"
						valuePropName="checked"
						rules={[{required:true,message:'必须选择'}]}
						name="free"
					>
						<Switch checkedChildren="是" unCheckedChildren="否" />
					</Item>
					<Item
						label="课时视频"
						name="video"
					>
						<Upload/>{/* 自定义的上传组件 */}
					</Item>
					<Item wrapperCol={{offset:2}}>
						<Button type="primary" htmlType="submit">添加</Button>
					</Item>
				</Form>
				
			</Card>
		)
	}
}

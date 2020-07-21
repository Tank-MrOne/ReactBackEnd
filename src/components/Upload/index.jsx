import React, { Component } from 'react'
import { Upload as AntdUpload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as qiniu from 'qiniu-js'
import {nanoid} from 'nanoid'
import {reqQiniuToken} from '@/api/upload/token'

const MAX_VIDEO_SIZE = 1024 * 1024  * 8 //视频文件大小不能超过8MB
export default class Upload extends Component {

	state = {
		isUpload:false //是否上传的标识
	}
	//#region
	/* 
		获取七牛云上传token，
		规则：
			1.若有之前的token：
					1.1 且未过期，则用之前的。
					1.2 过期了，则请求新的。
			2.若没有之前的token，则请求一个新的。
			备注：每次请求回来新的token之后，缓存下这个新的
	*/
	//#endregion
	reqToken = async()=>{
		//请求一个新的Token
		let {uploadToken,expires} = await reqQiniuToken()
		//修改expires为具体的过期时间点，而不是原来的7200
		expires = Date.now() + expires*1000 - 1000 * 60 *5
		//缓存下新的token
		localStorage.setItem('qiniuToken',JSON.stringify({uploadToken,expires}))
		//返回一个新的token
		return uploadToken
	}

	getToken = async()=>{
		try {
			const {uploadToken,expires} = JSON.parse(localStorage.getItem('qiniuToken'))
			//localStorage中存在token，但是过期了，请求一个新的
			if(Date.now() >= expires ) return await this.reqToken()
			//localStorage中存在token，且未过期，用原来的。
			else {
				return uploadToken
			}
		} catch (error) {
			return await this.reqToken()
		}
	}

	//beforeUpload会在上传之前调用，掉beforeUpload之后才触发真正的上传
	beforeUpload = (file)=>{
		//#region
		/* 
			上传前的准备：
					1.限制上传文件的格式(视频格式)
					2.限制上传文件的大小
			file:
				lastModified: 1592457451155 //最后修改时间(时间戳)
				lastModifiedDate: Thu Jun 18 2020 13:17:31 GMT+0800 (中国标准时间) {} //最后修改日期
				name: "video2.mp4" //文件原始名
				size: 892927 //文件大小(字节为单位)
				type: "video/mp4" //文件类型
				uid: "rc-upload-1594544550454-2" //antd帮我们给文件起的名字(唯一)
		*/
		//#endregion
		return new Promise((resolve,reject)=>{
			if(file.size > MAX_VIDEO_SIZE){
				//告诉antd视频上传失败
				reject('视频大小超过8MB，禁止上传')
				//弹窗提示视频上传失败
				message.error('视频大小超过8MB，禁止上传')
			}else{
				resolve(file)
			}
		})
	}

	//customRequest会紧随beforeUpload后调用，中编写具体的上传代码
	customRequest = async({file,onError,onSuccess,onProgress})=>{
		//#region
		/* 
			上传一个视频，需要哪些东西：
					1.视频(已经由beforeUpload传递过来了)
					2.需要校验身份（根据AK、SK、空间名字、生成一个七牛云认可的token）
						备注：不要前端自己在页面写运算逻辑，不安全，交给服务器计算
					//3.上传成功、上传失败的回调
					//4.上传中的检测回调
			说明：
				file:要上传的文件
				key:文件的新名字，作为唯一标识使用，同时作为上传到七牛空间中的文件名字，(需要前端人员自己生成)
				token:七牛云身份的标识(很重要，包含着：你是谁？你的身份是否合法？要存入哪个空间)
				putExtra：额外的配置对象
						mimeType: "text/plain", //标识文件类型(可选)
				config：核心的配置对象
						region: qiniu.region.z2 //要和你空间的地理区域保持一致
						配置说明：
								qiniu.region.z0: 代表华东区域
								qiniu.region.z1: 代表华北区域
								qiniu.region.z2: 代表华南区域
								qiniu.region.na0: 代表北美区域
								qiniu.region.as0: 代表新加坡区域
		*/
		//#endregion
		const key = nanoid() //文件唯一标识
		const token = await this.getToken() //七牛的token
		const putExtra = {
			mimeType: "video/mp4" //上传文件的；类型
		}
		const config = {
			region:qiniu.region.z1//存储空间所在的区域
		}
		//定义一个observer用来设置上传过程的监听函数
		const observer = {
			next:({total})=>{
				//七牛云的上传是“一点一点”的，每上传完“一点”，就会调一次next
				//在上传过程中，会不断的触发next，具体调几次看文件大小
				//每次调用next都会把：文件总大小，当前上传完的大小
				const percent = total.percent.toFixed(2)
				onProgress({percent})	//维护进度
			},
			error(err){
				//七牛云在上传中遇到错误，调用error，err为错误信息
				onError('失败了',err)
			},
			complete:(res)=>{
				//七牛云在完成上传视频之后，调用complete
				//通知antd上传成功
				onSuccess('上传成功了！') 
				//维护上传标识
				this.setState({isUpload:true})
				//调用Item传递过来的onChange让Form可以收集到视频地址
				this.props.onChange('http://qdft6nbv6.bkt.clouddn.com/'+res.key)
				//弹窗提示上传成功！
				message.success('视频上传成功！')
			}
		}
		//配置七牛云上传信息
		const observable = qiniu.upload(file, key, token, putExtra, config)
		//触发上传
		observable.subscribe(observer) 
	}

	render() {
		return (
			<AntdUpload
				/* 
					(1).不是用第三方储存，应该配置action属性值为上传地址。
					(2).如果用了第三方存储，要使用自定义上传 
				*/
				//action="上传地址" 
				onRemove={()=>this.setState({isUpload:false})}
				accept='video/mp4'//限制上传文件的类型
				beforeUpload={this.beforeUpload}
				customRequest={this.customRequest}
			>
				{
					this.state.isUpload ? "" : 
					<Button>
						<UploadOutlined />点击上传
					</Button>
				}
			</AntdUpload>
		)
	}
}

import React, { Component } from "react";
import { Form, Input, Button, Row, Col, Tabs, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login } from "@/redux/actions/login";
import { phoneLogin } from "@/redux/actions/login";
import {reqSendVerifyCode} from '@/api/phone'
import {client_id,auth_url} from '@/config/oauth'
import "./index.less";

const { TabPane } = Tabs;
const { Item } = Form;
const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/

@withRouter
@connect(
	()=>({}),
	{login,phoneLogin}
)
class LoginForm extends Component {

	state = {
		loginType:'user',//默认的登录方式
		time:60, //请求验证码的间隔时间
		canClick:true //标识【获取验证码】按钮是否可以点击 
	}
	componentWillUnmount(){
		clearInterval(this.timer)
	}

	//登录成功之后的逻辑
	gotoAdmin = (token)=>{
		//登录成功后将token存入local中(持久化存储token)
		localStorage.setItem("user_token", token);
		//跳转页面
		this.props.history.replace("/");
	}

	//点击登录按钮的回调(表单的局部校验，手动收集数据)
	handleLogin = async()=>{
		const {loginType} = this.state
		const {loginForm} = this.refs
		if(loginType === 'user'){
			//1.根据用户选择的登录方式，校验指定输入项
			await loginForm.validateFields(['username','password'])
			//2.获取表单数据
			let {username,password} = loginForm.getFieldsValue()
			let response = await this.props.login(username, password)
			this.gotoAdmin(response)
		}else{
			//1.根据用户选择的登录方式，校验指定输入项
			await loginForm.validateFields(['phone','verify'])
			//2.获取表单数据
			let {phone,verify} = loginForm.getFieldsValue(['phone','verify'])
			let response = await this.props.phoneLogin(phone,verify)
			this.gotoAdmin(response)
		}
	}

	//获取验证码
	getVerifyCode = async()=>{
		//获取登录Form实例
		const {loginForm} = this.refs
		//校验手机号
		await loginForm.validateFields(['phone'])
		//获取手机号
		const {phone} = loginForm.getFieldsValue()
		await reqSendVerifyCode(phone)
		message.success(`验证码已发送到${phone},请注意查收`)
		//更新状态，让按钮不可点击
		this.setState({canClick:false})
		//开启定时器更新时间
		this.timer = setInterval(()=>{
			let {time} = this.state
			time--
			if(time <= 0){
				//如果过了限制时间，还原数据
				clearInterval(this.timer) //清除定时器
				this.setState({canClick:true,time:60})
				return
			}
			this.setState({time})
		},1000)
	}

	gotoGithub = ()=>{
		window.location.href = auth_url+'?client_id='+client_id
	}

  render() {
		const {time,canClick} = this.state
    return (
      <>
        <Form
					ref="loginForm"
          name="normal_login" //表单的名字(可选)
          className="login-form"
          // onFinish={this.onFinish}//点击提交按钮后，表单所有输入项校验成功的回调
        >
          <Tabs
						onChange={key=>this.setState({loginType:key})}
            defaultActiveKey="user"
            tabBarStyle={{ display: "flex", justifyContent: "center" }}
          >
            <TabPane tab="账户登录" key="user">
              <Item name="username" rules={[{required:true,message:'用户名必须填写'}]}>
                <Input
                  prefix={<UserOutlined className="form-icon" />}
                  placeholder="用户名：admin"
                />
              </Item>
              <Item name="password" rules={[{required:true,message:'用户名必须填写'}]}>
                <Input
                  prefix={<LockOutlined className="form-icon" />}
                  type="password"
                  placeholder="密码: 111111"
                />
              </Item>
            </TabPane>
						<TabPane tab="手机登录" key="phone">
							<Item 
								name="phone"
								 rules={[
									 {required:true,message:'手机号必须填写'},
									 {pattern:phoneReg,message:'请填写合法的手机号'}
								 ]}
							>
                <Input
                  prefix={<MobileOutlined className="form-icon" />}
                  placeholder="手机号"
                />
              </Item>
              <Row justify="space-between">
                <Col span={13}>
									<Item 
										name="verify"
										rules={[
											{required:true,message:'验证码必须填写'},
											{len:6,message:'验证码长度必须是6位'},
										]}
									>
                    <Input
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="验证码"
                    />
                  </Item>
                </Col>
                <Col span={10}>
                  {
										canClick ? 
										<Button onClick={this.getVerifyCode} className="verify-btn">获取验证码</Button>:
										<Button disabled className="verify-btn">{time}秒后可重新获取</Button>
									}
                </Col>
              </Row>
            </TabPane>
					</Tabs>
          <Item>
            <Button
              type="primary"
							// htmlType="submit"
							onClick={this.handleLogin}
              className="login-form-button"
            >
              登录
            </Button>
          </Item>
          <Item>
            <Row justify="space-between">
              <Col>
                <span>
                  第三方账号登录：
                  <GithubOutlined onClick={this.gotoGithub} className="login-icon" />
                  <WechatOutlined className="login-icon" />
                  <QqOutlined className="login-icon" />
                </span>
              </Col>
            </Row>
          </Item>
        </Form>
      </>
    );
  }
}

export default LoginForm;

import React, { Component } from 'react'
import {Statistic,Row, Col,Progress} from 'antd';
import ReactEcharts from 'echarts-for-react';
import Card from '@/components/Card'
import { AreaChart } from 'bizcharts';
import {
	CaretUpOutlined,
	CaretDownOutlined
} from '@ant-design/icons';

export default class Statistics extends Component {

	//Echarts的配置
	getOption = ()=>{
		return {
			// title: { //图表标题
			// 	text: '本季度销售统计',
			// 	link:'https://www.baidu.com',
			// 	subtext:'截止7月17日',
			// 	textStyle:{
			// 		color:'blue'
			// 	}
			// },
			tooltip: { //提示框组件
				triggerOn:'mousemove',
				// showDelay:1000,
				// formatter:'{a}<br/> {b} :{c}双'
			},
			// legend: { //图例
			// 	data:['销量','库存'],
			// 	// borderColor:'blue',
			// 	// borderWidth:5
			// },
			xAxis: {
				show:false,
				data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子","腰带"]
			},
			yAxis: {show:false,},
			series: [ //图表数据
				{
					name: '销量',
					type: 'bar', //图表的类型
					data: [5, 20, 36, 10, 10, 20,16]
				},
				{
					name: '库存',
					type: 'bar', //图表的类型
					data: [2, 10, 10, 0, 11, 14,0]
				}
			]
	};
	}

	render() {
		// bizcharts数据源
		const data = [
			{ year: '1991', value: 3 },
			{ year: '1992', value: 4 },
			{ year: '1993', value: 3.5 },
			{ year: '1994', value: 5 },
			{ year: '1995', value: 4.9 },
			{ year: '1996', value: 6 },
			{ year: '1997', value: 7 },
			{ year: '1998', value: 9 },
			{ year: '1999', value: 13 },
		];
		return (
			<div>
				<Row gutter={16} justify="space-around">
					<Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
						<Card
							title="总销售额"	
							alert="所有门店销售金额"
							content={
								<>
									<Statistic prefix="￥" suffix="元" value={13450} />
									<div>
										<span>
											周同比 45%
											<CaretUpOutlined className="up"/>
										</span>
										<span>
											日同比 30%
											<CaretDownOutlined className="down"/>
										</span>
									</div>
								</>
							}
							footer={
								<Statistic 
									valueStyle={{fontSize:'14px'}}
									prefix="日销售额：￥" 
									suffix="元" 
									value={13450} 
								/>
							}
						/>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
						<Card
							title="支付笔数"	
							alert="按订单计算"
							content={
								<>
									<Statistic suffix="次" value={3564765} />
									<ReactEcharts option={this.getOption()} />
								</>
							}
							footer={
								<Statistic 
									valueStyle={{fontSize:'14px'}}
									prefix="总店访问量：" 
									suffix="次" 
									value={1243} 
								/>
							}
						/>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
						<Card
							title="访问量"
							alert="按ip地址计算"
							content={
								<AreaChart
									data={data}
									title={{
										visible: false,
										text: '面积图',
									}}
									smooth={true}
									xAxis={{visible:false}}
									yAxis={{visible:false}}
									xField='year'
									yField='value'
								/>
							}
							footer={
								<Statistic 
									valueStyle={{fontSize:'14px'}}
									prefix="日活：" 
									value={5462} 
								/>
							}
						/>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
						<Card
							title="运营统计"
							alert="当日统计结果"
							content={
								<>
									<Statistic suffix="人" value={3564765} />
									<Progress percent={50} status="active" />
								</>
							}
							footer={
								<Statistic 
									valueStyle={{fontSize:'14px'}}
									prefix="运营转化率" 
									value='90%'
								/>
							}
						/>
					</Col>
				</Row>
			</div>
		)
	}
}

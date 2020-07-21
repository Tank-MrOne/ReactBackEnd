import React, { Component } from 'react'
import {Tabs,DatePicker } from 'antd'
import { ColumnChart,LineChart } from 'bizcharts';
import moment from 'moment'
import './indx.less'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 柱状图数据源
const data1 = [
	{
		type: '家具家电',
		sales: 38,
	},
	{
		type: '粮油副食',
		sales: 52,
	},
	{
		type: '生鲜水果',
		sales: 61,
	},
	{
		type: '美容洗护',
		sales: 145,
	},
	{
		type: '母婴用品',
		sales: 48,
	},
	{
		type: '进口食品',
		sales: 38,
	},
	{
		type: '食品饮料',
		sales: 38,
	},
	{
		type: '家庭清洁',
		sales: 38,
	},
];
// 数据源
const data2 = [
  { year: '1991', value: 300 },
  { year: '1992', value: 400 },
  { year: '1993', value: 3500 },
  { year: '1994', value: 500 },
  { year: '1995', value: 4900 },
  { year: '1996', value: 600 },
  { year: '1997', value: 700 },
  { year: '1998', value: 900 },
  { year: '1999', value: 1300 },
];

export default class Statement extends Component {

	callback = (key)=> {
		console.log(key);
	}

	dateChange = (momentArr,dateArr)=>{
		moment().locale()
		console.log(moment(momentArr[0]).format('YYYY/M/D'));
		console.log(moment(momentArr[1]).format('YYYY/M/D'));
	}

	barCharts = (
		<ColumnChart
      data={data1}
      title={{
        visible: true,
        text: '基础柱状图',
      }}
      forceFit
      padding='auto'
      xField='type'
      yField='sales'
      meta={{
        type: {
          alias: '类别',
        },
        sales: {
          alias: '销售额(万)',
        },
      }}
    />
	)

	lineCharts = (
		<LineChart
      data={data2}
      title={{
        visible: true,
        text: '折线图',
      }}
      description={{
        visible: true,
        text: '用平滑的曲线代替折线。',
      }}
      xField='year'
      yField='value'
    />
	)

	render() {
		return (
			<Tabs 
				defaultActiveKey="1" 
				onChange={this.callback} 
				className="admin_tab"
				tabBarExtraContent={<RangePicker onChange={this.dateChange}/>}
			>
				<TabPane tab="销售量" key="1">
					{this.barCharts}
				</TabPane>
				<TabPane tab="访问量" key="2">
					{this.lineCharts}
				</TabPane>
			</Tabs>
		)
	}
}

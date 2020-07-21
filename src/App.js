import React from "react";
import { Router } from "react-router-dom";
import history from "@/utils/history";
import {connect} from 'react-redux'
import Layout from "./layouts";
//引入react-intl国际化库
import {IntlProvider} from 'react-intl'
//引入antd的国际化库
import {ConfigProvider} from 'antd'
//引入所有自定义的语言包
import langObj from './locales'
//引入antd的语言包
import en from 'antd/es/locale/en_US';
import zh_CN from 'antd/es/locale/zh_CN';
import zh_TW from 'antd/es/locale/zh_TW';
// 引入重置样式
import "./assets/css/reset.css";

const antdlanguage = {en,zh_CN,zh_TW}

function App({language}) {
  return (
    <Router history={history}>
			<ConfigProvider 
				locale={antdlanguage[language]}
			>
				<IntlProvider 
					locale={window.navigator.language} //浏览器当前所用语言
					messages={langObj[language]} //指定使用哪个语言包
				>
					<Layout/>
				</IntlProvider>
			</ConfigProvider>
    </Router>
  );
}

export default connect(
	(state)=>({language:state.language}),
	{}
)(App)

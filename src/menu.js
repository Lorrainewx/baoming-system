import Cookies from 'js-cookie';
const USERTYPE =Cookies.get('user_type');

const baseMenu = USERTYPE == 'admin' ? [{
	name: 'manage-school',
	icon: 'pie-graph',
	path: '/manage/school',
	title: '校园管理',
	show: true,
	component: (resolve) => require(['./views/haizr/manage_school.vue'], resolve),
	children: []
}, {
	name: 'manage-teacher',
	icon: 'ios-people',
	path: '/manage/teacher',
	title: '教师管理',
	show: true,
	component: (resolve) => require(['./views/haizr/manage_teach.vue'], resolve),
	children: []
}, {
	name: 'manage-form',
	icon: 'ios-people',
	path: '/manage/form',
	title: '表单管理',
	show: true,
	component: (resolve) => require(['./views/haizr/manage_form.vue'], resolve),
	children: []
}] : USERTYPE == 'techer_True' ? [{
	name: 'home',
	icon: 'pie-graph',
	path: '/',
	title: '首页',
	show: true,
	component: (resolve) => require(['./views/index.vue'], resolve),
	children: []
}, {
	name: 'form',
	icon: '',
	path: '/form',
	title: '报名表',
	children: [{
		name: 'form-query',
		icon: 'android-list',
		path: '/form/query',
		title: '表单管理',
		show: true,
		component: (resolve) => require(['./views/form/query.vue'], resolve)
	},{
		name: 'form-resource',
		icon: 'ios-grid-view',
		path: '/form/resource/:form_id',
		title: '表单管理',
		show: false,
		component: (resolve) => require(['./views/form/form-resource.vue'], resolve)
	},{
		name: 'form-group',
		icon: 'ios-grid-view',
		path: '/form/group/:form_id',
		title: '分组管理',
		show: false,
		component: (resolve) => require(['./views/form/form-group.vue'], resolve)
	}, {
		name: 'form-field',
		icon: 'ios-keypad',
		path: '/form/field/:group_id',
		title: '字段管理',
		show: false,
		component: (resolve) => require(['./views/form/form-field.vue'], resolve)
	}, {
		name: 'form-data',
		icon: 'navicon-round',
		path: '/form/data/:form_id',
		title: '表单数据',
		show: false,
		component: (resolve) => require(['./views/form/form-data.vue'], resolve)
	},{
		name: 'form-datadetail',
		icon: 'navicon-round',
		path: '/form/datadetail/:data_id',
		title: '详细数据',
		show: false,
		component: (resolve) => require(['./views/form/form-datadetail.vue'], resolve)
	}]
}, {
	name: 'setting',
	icon: '',
	path: '/setting',
	title: '校园设置',
	access: 0,
	children: [{
		name: 'setting',
		icon: 'ios-gear',
		path: '/setting',
		title: '基本设置',
		show: true,
		component: (resolve) => require(['./views/school/basic_setting.vue'], resolve)
	}, {
		name: 'setting-area',
		icon: 'map',
		path: '/setting/area',
		title: '服务区域',
		show: true,
		component: (resolve) => require(['./views/school/form-area.vue'], resolve)
	}, {
		name: 'setting-teacher',
		icon: 'person-stalker',
		path: '/setting/teacher',
		title: '教师列表',
		show: true,
		component: (resolve) => require(['./views/school/tech_data.vue'], resolve)
	}]
}] : USERTYPE == 'techer_False' ? [{
	name: 'home',
	icon: 'pie-graph',
	path: '/',
	title: '首页',
	show: true,
	component: (resolve) => require(['./views/index.vue'], resolve),
	children: []
}, {
	name: 'form',
	icon: '',
	path: '/form',
	title: '报名表',
	children: [{
		name: 'form-query',
		icon: 'android-list',
		path: '/form/query',
		title: '表单管理',
		show: true,
		component: (resolve) => require(['./views/form/query.vue'], resolve)
	}, {
		name: 'form-data',
		icon: 'navicon-round',
		path: '/form/data/:form_id',
		title: '表单数据',
		show: false,
		component: (resolve) => require(['./views/form/form-data.vue'], resolve)
	},{
		name: 'form-datadetail',
		icon: 'navicon-round',
		path: '/form/datadetail/:data_id',
		title: '详细数据',
		show: false,
		component: (resolve) => require(['./views/form/form-datadetail.vue'], resolve)
	}]
}] : [];

const commonMenu = [{
	name: 'login',
	icon: 'person-stalker',
	path: '/login',
	title: '登陆',
	show: false,
	component: (resolve) => require(['./views/login.vue'], resolve)
}, {
	name: 'logout',
	icon: 'person-stalker',
	path: '/logout',
	title: '退出',
	show: false,
	component: (resolve) => require(['./views/logout.vue'], resolve)
}, {
	name: 'manage',
	icon: 'person-stalker',
	path: '/manage',
	title: '登陆',
	show: false,
	component: (resolve) => require(['./views/haizr/manage_login.vue'], resolve)
}, {
	name: 'manage',
	icon: 'person-stalker',
	path: '/manage/login',
	title: '登陆',
	show: false,
	component: (resolve) => require(['./views/haizr/manage_login.vue'], resolve)
}];

export default [ baseMenu, commonMenu ];
import Menu from './menu';

const routers = new Array();

for (var k = 0; k < Menu.length; k++) {
	var menuArr = Menu[k];
	for (var i = 0; i < menuArr.length; i++) {
		var menu = menuArr[i];
		if(menu.children != null && menu.children.length > 0) {
			for (var j = 0; j < menu.children.length; j++) {
				routers.push({
					name: menu.children[j].name,
					path: menu.children[j].path,
					meta: {
						title: menu.children[j].title
					},
					component: menu.children[j].component
				});
			}
		} else {
			routers.push({
				name: menu.name,
				path: menu.path,
				meta: {
					title: menu.title
				},
				component: menu.component
			});
		}
	}
}

export default routers;
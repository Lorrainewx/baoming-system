<template>
    <div class="layout" v-else>
        <div v-if="$route.name == 'login' || $route.name == 'manage'">
            <router-view></router-view>
        </div>
        <div v-else>
            <Header :style="{position: 'fixed', zIndex: 9999, width: '100%', top: 0, background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',fontSize:'26px'}">
                <Row>
                    <Col span="12">{{ schoolname }}</Col>
                    <Col span="12" :style="{ textAlign: 'right', fontSize: '14px'}">
                        <strong style="font-size:24px;">客服热线：400-710-6678</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>{{ username }}</strong> &nbsp;&nbsp;&nbsp;
                        <Button type="warning" @click="Logout">退出</Button>
                    </Col>
                </Row>
            </Header>
            <Sider :style="{position: 'fixed', height: '100vh', left: 0, margin: '64px 0 0', overflow: 'auto', }">
                <Menu @on-select="menuSelect" theme="dark" width="auto">
                    <template v-for="m in menu">
                        <MenuItem :name="m.path" v-if="m.children.length == 0 && m.show">
                            <Icon :type="m.icon" v-if="m.icon!=''"></Icon>
                            {{ m.title }}
                        </MenuItem>
                        <MenuGroup :title="m.title" v-else>
                            <template v-for="cm in m.children">
                                <MenuItem :name="cm.path" v-if="cm.show">
                                    <Icon :type="cm.icon" v-if="cm.icon!=''"></Icon>
                                    {{ cm.title }}
                                </MenuItem>
                            </template>
                        </MenuGroup>
                    </template>
                </Menu>
            </Sider>
            <Layout :style="{marginLeft: '200px', height: '100vh'}">
                <Content :style="{padding: '88px 16px 0'}">
                    <!-- <Breadcrumb :style="{margin: '16px 0'}">
                        <BreadcrumbItem v-for="vo in breadcrumb">{{vo}}</BreadcrumbItem>
                    </Breadcrumb> -->
                    <router-view></router-view>
                </Content>
            </Layout>
        </div>
    </div>
</template>
<script>
    import Menu from './menu';
    import Util from './libs/util';
    import Cookies from 'js-cookie';
    import env from './config/env';

    export default {
        data() {
            return {
                menu: Menu[0],
                schoolname: '',
                username: Cookies.get('user_name')
            };
        },
        computed: {

        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {
            menuSelect: function(event){
                this.$router.push(event);
            },
            Logout: function(){
                if(env === 'development'){
                    this.$router.push({
                        name: 'logout'
                    });
                } else {
                    location.href = (env === 'development' ? '/' : '/admin/') + 'logout';
                }
            }
        },
        created () {
            this.schoolname = SCHOOL.name;
        },
    };
</script>
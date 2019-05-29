<template>
    <Row type="flex" justify="center">
        <Col span="8"><br><br><br><br><br><br><br>
            <div class="login" @keydown.enter="handleSubmit">
                <div class="login-con">
                    <Card :bordered="false">
                        <p slot="title">
                            <Icon type="log-in"></Icon>
                            欢迎登录
                        </p>
                        <div class="form-con">
                            <Form ref="loginForm" :model="form" :rules="rules">
                                <FormItem prop="mobile">
                                    <Input v-model="form.mobile" placeholder="请输入手机号" @on-change="getVal">
                                    </Input>
                                </FormItem>
                                <Row :gutter="20">
                                    <Col span="12">
                                        <FormItem prop="password">
                                            <Input type="password" v-model="form.password" placeholder="请输入手机验证码">
                                            </Input>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <Button @click="handleSms" long>{{ smsButton }}</Button>
                                    </Col>
                                </Row>
                                <FormItem>
                                    <Button @click="handleSubmit" type="primary" long>登录</Button>
                                </FormItem>
                            </Form>

                            <Alert type="success" show-icon v-if="successShow">登陆成功</Alert>

                            <Alert type="error" show-icon v-if="errorShow"> {{ errorInfo }} </Alert>
                        </div>
                    </Card>
                </div>
            </div>
        </Col>
    </Row>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '../libs/util';
import env from '../config/env';

export default {
    data () {
        return {
            form: {
                mobile: '',
                password: ''
            },
            rules: {
                mobile: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            errorShow: false,
            successShow: false,
            errorInfo: '',
            smsButton: '获取手机验证码',
            smsTimeIndex: 60
        };
    },
    methods: {
        handleSubmit () {
            //验证用户名
            this.$refs.loginForm.validate((valid) => {
                if(valid) {
                    Util.ajax.post('/ajax/login/check',{
                        mobile: this.form.mobile,
                        password: this.form.password
                    }).then((response) => {
                        if(response.data.code == 0) {  //登陆成功
                            Cookies.set('user_type',response.data.body.type);
                            Cookies.set('user_name',response.data.body.name);
                            this.successShow = true;
                            this.errorShow = false;
                            // Cookies.set('access', 1);                        
                            // this.$router.push({
                            //     name: 'home'
                            // });
                            location.href = env === 'development' ? '/' : '/admin';
                        }else {
                            console.log(response.data.message);
                            this.errorShow = true;
                            this.successShow = false;
                            this.errorInfo = response.data.message;
                        }
                    });   
                }
            })
        },
        getVal () {
            console.log(this.form.mobile);
        },
        handleSms () {
            var _vm = this;

            Util.ajax.post('/ajax/sms',{
                mobile: this.form.mobile
            }).then((response) => {
                if(response.data.code == 0) {
                    _vm.smsTimer(60);
                } else {
                    this.errorShow = true;
                    this.successShow = false;
                    this.errorInfo = response.data.message;
                }
            });
        },
        smsTimer (index) {
            var _vm = this;

            if(index <= 0) {
                this.smsButton = '重发验证码';
            } else {
                this.smsTimeIndex = index;
                this.smsButton = index + ' 秒后重发验证码';
                setTimeout(function () { _vm.smsTimer(index-1) }, 1000);
            }
        }
    }
};
</script>
<template>
    <Card>
        <p slot="title">
            {{ formitem.name }} - {{ $route.meta.title }}
        </p>
        <Form :model="formitem" :label-width="120">
            <FormItem label="表单名称">
                <Input v-model="formitem.name" placeholder="表单名"></Input>
            </FormItem>
            <Row>
                <Col span="12">
                    <FormItem label="开始时间">
                        <DatePicker :value="formitem.starttime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期和时间" @on-change="formitem.starttime=$event"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="结束时间">
                        <DatePicker :value="formitem.endtime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期和时间" @on-change="formitem.endtime=$event"></DatePicker>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="审核成功补充说明（可不填）：">
                <div class="editor-content">
                    <froala :tag="'textarea'" :config="config" v-model="formitem.successcontent"></froala>
                </div>
            </FormItem>   
            <FormItem>
                <Button type="primary" @click="handleSave">确定修改</Button>
                <Button type="ghost" style="margin-left: 8px" @click="handleCancel">取消</Button>
                <Button @click="handleBack" type="default" icon="arrow-return-left" class="notprint">返回</Button> 
            </FormItem>
        </Form>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
        <!-- alert -->
        <Alert v-if="alertInfo" type="success" show-icon closable>保存成功！</Alert>
    </Card>
</template>
<script>
    import Util from '../../libs/util';

// import VueFroala from 'vue-froala-wysiwyg';
    // import '../../../static/ueditor/ueditor.config.js'
    // import '../../../static/ueditor/ueditor.all.min.js'
    // import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
    // import '../../../static/ueditor/ueditor.parse.min.js'


// Import and use Vue Froala lib.
// import VueFroala from 'vue-froala-wysiwyg'
// Vue.use(VueFroala)



// import UE from './ueditor';

    export default {
        name: 'basic_setting',
        // components: {UE},
        data () {
            return {
                config: {
                    imageUploadURL: Util.url + '/ajax/upload',
                    imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
                    language: 'zh_cn',
                    toolbarButtons: ['undo', 'redo', '|', 'insertImage', 'insertTable', '|', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'specialCharacters', 'selectAll', 'clearFormatting', '|', 'help', 'html'],
                },
                // editData: {},
                alertInfo: false,
                spinShow: false,
                formitem: {},
                // editor : null,
                // config: {
                //   type: Object,
                //   initialFrameWidth: null,
                //   initialFrameHeight: 350
                // }
            };
        },
        // props: {
        //       defaultMsg: {
        //         type: String
        //       },
             
        //     },
        created () {
            this.getItemData();
        },
        methods: {
           
            getItemData () { //表单信息
                Util.ajax.post('/ajax/form/get', { id: this.$route.params.form_id, }).then(response => {
                    this.formitem = response.data;
                });
            },
            handleSave () {           
                Util.ajax.post('/ajax/form/save',this.formitem).then((response) => {        
                    this.alertInfo = true;
                }) 
            },
            handleCancel () {
                this.alertInfo = false;
            },
            handleBack () {    
                window.history.back();
            }

        },
        mounted() {
          const _this = this;
          // console.log(this.defaultMsg);
          // this.editor = UE.getEditor('editor', this.config); // 初始化UE
          // this.editor.addListener("ready", function () {
          //   _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
          //  _this.getItemData();
          // });
          // 
        },
        destroyed() { //钩子函数
            // console.log('离开此页面,销毁富文本编辑');
            // this.editor.destroy();
        }
    };
</script>
<template>
    <Card>
        <p slot="title">
            {{ $route.meta.title }}
        </p>
         <Form :model="ourSchool" :label-width="120">
            <FormItem label="校园名称：" prop="name">
               <Input v-model="ourSchool.name" placeholder="输入校园名称..."></Input>
            </FormItem>

            <FormItem label="须知：">
                <div class="editor-content">
                    <froala :tag="'textarea'" :config="config" v-model="ourSchool.notes"></froala>
                </div>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="handleSave">确定修改</Button>
                <Button type="ghost" style="margin-left: 8px" @click="handleCancel">取消</Button>
            </FormItem>
            
            <!-- <Button @click="loadSchoolInfo" icon="refresh" type="primary" style="margin-left: 120px;">刷新</Button> -->
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
                    toolbarButtons: ['undo', 'redo', '|', 'insertImage', '|', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'specialCharacters', 'selectAll', 'clearFormatting', '|', 'help', 'html'],
                },
                ourSchool: {},
                // editData: {},
                alertInfo: false,
                spinShow: false,
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
            this.loadSchoolInfo();
        },
        methods: {
            /*********************** LOAD DATA ***********************/
            loadSchoolInfo () {
                Util.ajax.post('/ajax/school/get').then((response) => {                    
                    this.ourSchool = response.data;                 
                    // this.ourSchool = this.editData = response.data;
                    //console.log(this.ourSchool.notes);
                    // this.editor.setContent(this.ourSchool.notes);                
                });
                
            },
            handleSave () {
                // this.ourSchool.notes = this.editor.getContent();           
                Util.ajax.post('/ajax/school/save',this.ourSchool).then((response) => {        
                    this.alertInfo = true;
                }) 
            },
            handleCancel () {
                this.alertInfo = false;
                this.loadSchoolInfo();
            },

        },
        mounted() {
          const _this = this;
          // console.log(this.defaultMsg);
          // this.editor = UE.getEditor('editor', this.config); // 初始化UE
          // this.editor.addListener("ready", function () {
          //   _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
          //  _this.loadSchoolInfo();
          // });
          // 
        },
        destroyed() { //钩子函数
            // console.log('离开此页面,销毁富文本编辑');
            // this.editor.destroy();
        }
    };
</script>
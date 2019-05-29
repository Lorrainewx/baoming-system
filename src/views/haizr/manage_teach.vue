<template>
    <Card>
       <p slot="title">
           {{ $route.meta.title }}
       </p>        
        <Row class="margin-top-10">        

            <!-- button Start -->
            <Input v-model="techitems.keyword" @on-keyup.enter="loadtechData" placeholder="请输入教师名称搜索..." style="width: 200px" />         <span @click="loadtechData" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
            <Button @click="techitems.keyword='';loadtechData();"  :type="techitems.keyword==''?'dashed':'ghost'" :disabled="techitems.keyword==''"></Icon>取消查询</Button>
            <Button @click="handleAdd" type="info" style="margin: 0 10px;">增加</Button>
            <Button @click="refresh" type="info" style="margin: 0;" icon="refresh">刷新</Button>


            <!-- Table Data Start -->
            <Table 
                refs="techTable" 
                :data="techitems.items" 
                :columns="edittechColumns"                     
            >   
            </Table>                         

            <!-- Table Data End -->

            <Page :page-size="techitems.size" :total="techitems.total" show-sizer show-elevator show-total @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

            <!-- Model Start -->
            <Modal v-model="modalCurrent" @on-ok="handleSave" @on-cancel="cancel">

                <!-- 自定义头部 -->
                <p slot="header">
                    教师管理                               
                </p>

                <!-- 自定义内容 -->
                <Form :model="techitem" :label-width="120">
                    <FormItem label="所属校园：">
                        <Select v-model="modelArea">
                            <Option v-for="item in schoolitems" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                       
                    </FormItem>

                    <FormItem label="教师名称：" prop="name">
                       <Input v-model="techitem.name"></Input>
                    </FormItem>

                    <FormItem label="手机号码：">
                       <Input v-model="techitem.mobile"></Input>
                    </FormItem>

                    <FormItem label="是否为管理员：">
                        <RadioGroup v-model="isadmin">
                            <Radio label="true" >是</Radio>
                            <Radio label="false" >否</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </Modal>
            <!-- Model End -->

            <Spin fix v-if="spinShow">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>数据加载中...</div>
            </Spin> 
        </Row>            
    </Card>
</template>

<script>
import Util from '../../libs/util';

export default {
    data () {
        return {                     
            techitems: [],    
            techitem: {},  
            modelArea: '',
            schoolitems: [],
            isadmin: 'true',
            edittechData: [],
            edittechColumns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '校园名称',
                    align: 'center',
                    key: 'school',
                },                
                {
                    title: '教师名称',
                    align: 'center',
                    key: 'name',

                },
                {
                    title: '手机号码',
                    align: 'center',
                    key: 'mobile',
 
                },                
                {
                    title: '是否为管理员',
                    align: 'center',
                    key: 'isadmin',
                    render: (h,params) => {
                        return h('div',params.row.isadmin ? '是' : '否');
                    }
                    
                },     
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    render: (h ,params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.gettechItem(params.row.id);
                                        this.modalCurrent = true;
                                    }
                                }
                            }, '编辑'),                 
                            h('Poptip', {
                                   props: {
                                       refs: String,
                                       confirm: true,
                                       title: '您确定要删除这条数据吗?',
                                       transfer: true
                                   },
                                   on: {
                                       'on-ok': () => {
                                            
                                            Util.ajax.post('/ajax/admin/techer/remove',{//表单
                                                id: params.row.id
                                            }).then((res) => {         
                                                this.loadtechData();
                                            })
                                       },
                                       'on-cancel' : () => {

                                       }
                                   }
                            },[
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'error',
                                        placement: 'top'
                                    },
                                    on: {
                                        click: () => {                                             
                                            
                                        }
                                    }
                                }, '删除')
                            ])
                        ]);                               
                    },                    
                },      
            ],            
            modalCurrent: false, //模态框
            spinShow: true,
            techruleValidate : {
                name : [
                    { required: true, message: '字段必填', trigger: 'blur'},  
                ]                 
            },
            searchTechName: ''//搜索的关键词
        };
    },
    methods: {
    
        /***********************DATA LOAD***********************/
        loadtechData () {
            this.spinShow = false;
            Util.ajax.post('/ajax/admin/techer/query',{
                keyword: this.techitems.keyword,
                page: this.techitems.page,
                size: 10000
            }).then((response) => {                      
                this.techitems = response.data;                 
            })            
        },
        loadschoolData () {
            Util.ajax.post('/ajax/admin/school/query',{  
                          
            }).then((response) => {                      
                this.schoolitems = response.data.items;                 
            }) 
        },    
        refresh () {
            this.loadtechData();
        },
        gettechItem (id) {         
            Util.ajax.post('/ajax/admin/techer/get', { 
               id: id             
            }).then((response) => {                       
                this.techitem = response.data;
                this.modelArea = this.techitem.schoolid;

                //是否为管理员
                if(this.techitem.isadmin == true) {
                    this.isadmin = 'true';
                } else {
                    this.isadmin = "false";
                }                
            }) 
        },
        handleCancel () {
            this.searchTechName = '';
            this.loadtechData();
        },
        /***********************ADD***********************/
        handleAdd () {
            this.techitem = {
                name: "",
            }

            this.modalCurrent = true;            
        },
        handleSave () {     
            //console.log(this.isadmin);            
            if(this.isadmin == 'false') {
                this.techitem.isadmin = false;
            }else {
                this.techitem.isadmin = true;
            }
            this.techitem.schoolid = this.modelArea;
            Util.ajax.post('/ajax/admin/techer/save', this.techitem).then((response) => {                                               
                this.loadtechData();
            });
        },
        cancel () {
            this.$Message.info('点击了取消按钮');
        },
        /*********************** PAGE ***********************/
        changePageIndex (event) {
            this.techitems.page = event;
            this.loadtechData();
        },
        changePageSize (event) {
            this.techitems.size = event;
            this.loadtechData();
        },     
    },
    created () {
        this.loadtechData();
        this.loadschoolData();
    }
};

</script>
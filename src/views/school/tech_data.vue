<template>
    <Card>
       <p slot="title">
           {{ $route.meta.title }}
       </p>        
        <Row class="margin-top-10">        

        <Row>
            <Col span="20">
            <!-- function button Start -->
            <Input v-model="searchTechName" @on-keyup.enter="handleSearch" placeholder="Enter Something..." style="width: 200px" />           
            <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
            <Button @click="searchTechName='';loadtechData();" :type="searchTechName==''?'dashed':'ghost'" :disabled="searchTechName==''">取消查询</Button>
            <Button @click="refresh" type="info" style="margin: 0;" icon="refresh">刷新</Button>
            <!-- function button End -->
            </Col>
            <Col span="4" :style="{textAlign:'right'}">
                <Button type="success" @click="handleAdd">添加</Button>
            </Col>
        </Row>


            <!-- Table Data Start -->
                <Table 
                    refs="techTable" 
                    :columns="edittechColumns" 
                    :data="techitems"  
                    border                 
                >                            
                </Table>                   
            <!-- Table Data End -->


            <!-- Model Start -->
            <Modal v-model="modalCurrent" @on-ok="handleSave" @on-cancel="cancel">

                <!-- 自定义头部 -->
                <p slot="header">
                    教师管理                               
                </p>

                <!-- 自定义内容 -->
                <Form :model="techitem" :label-width="120">
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
            isadmin: 'false',
            spinShow: true,
            edittechData: [],
            edittechColumns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
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
                    width: 200,
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
                                            this.handleRemove(params.row.id);
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
                    }
                },      
               
            ],            
            modalCurrent: false, //模态框
            techruleValidate : {
                name : [
                    { required: true, message: '字段必填', trigger: 'blur'},  
                ]                 
            },
            searchTechName: ''//搜索的关键词
        };
    },
    methods: {
        search (data, argumentObj) {
            let res = data;
            let dataClone = data;
            for (let argu in argumentObj) {
                if (argumentObj[argu].length > 0) {
                    res = dataClone.filter(d => {
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res;
                }
            }           
            return res;
        },    
        /***********************DATA LOAD***********************/
        loadtechData () {
            
            Util.ajax.post('/ajax/techer/query').then((response) => { 
                this.spinShow = false;                     
               this.techitems = this.edittechData =  response.data;
               
           })             
        },
        refresh () {
            this.loadtechData();
        },
        gettechItem (id) {         
            Util.ajax.post('/ajax/techer/get', { 
               id: id             
            }).then((response) => {                       
                this.techitem = response.data;
                //是否为管理员
                if(this.techitem.isadmin == true) {
                    this.isadmin = 'true';
                } else {
                    this.isadmin = "false";
                }                
            }) 
        },
        /***********************SEARCH***********************/
        handleSearch () {            
            this.techitems = this.search(this.edittechData, {
                name: this.searchTechName               
            });
        },
        handleRemove (id) {
            Util.ajax.post('/ajax/techer/remove', {id: id}).then((response) => {                                               
                this.loadtechData();
            });
        },
        /***********************ADD***********************/
        handleAdd () {
            this.techitem = {
                name: "",
            }
            this.modalCurrent = true;
        },
        handleSave () {     
            if(this.isadmin == 'false') {
                this.techitem.isadmin = false;
            }else {
                this.techitem.isadmin = true;
            }
            Util.ajax.post('/ajax/techer/save', this.techitem).then((response) => {                                               
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
    }
};

</script>
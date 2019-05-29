
<template>
    <Card>
       <p slot="title">
           {{ $route.meta.title }}
       </p>        
        <Row class="margin-top-10">        

            <!-- function button Start -->
            <Input v-model="body.keyword" @on-keyup.enter="loadschoolData" placeholder="Enter Something..." style="width: 200px" />           
            <span @click="loadschoolData" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
            <Button @click="body.keyword='';loadschoolData();" :type="body.keyword==''?'dashed':'ghost'" :disabled="body.keyword==''">取消查询</Button>
            <Button @click="handleAdd" type="info" style="margin: 0 10px;">增加</Button>
            <Button @click="loadschoolData" type="info" style="margin: 0;" icon="refresh">刷新</Button>
            <!-- function button End -->


            <!-- Table Data Start -->
                <Table 
                   refs="adminSchoolTable" 
                   :data="body.items" 
                   :columns="editschoolColumns"   
                   border                  
               >                            
               </Table>                   
            <!-- Table Data End -->

            <!--  Modal Start -->
            <Modal v-model="modalCurrent" @on-ok="handleSave" @on-cancel="cancel"  @on-change="changePageIndex" @on-page-size-change="changePageSize">

                <!-- 自定义头部 -->
                <p slot="header">
                    校园管理                               
                </p>

                <!-- 自定义内容 -->
                <Form :model="schoolitem" :label-width="120">
                    <FormItem label="校园名称：" prop="name">
                       <Input v-model="schoolitem.name" placeholder="输入校园名称..."></Input>
                    </FormItem>

                    <FormItem label="域名：">
                       <Input v-model="schoolitem.domain" placeholder="输入校园域名..."></Input>
                    </FormItem>

                </Form>
            </Modal>
            <!-- Modal End -->

            <Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

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
            body: { items: [], keyword: '', page: 1, size: 20 }, 
            schoolitem: {},  
            editschoolData: [],
            editschoolColumns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '校园名称',
                    align: 'center',
                    key: 'name',
                },
                {
                    title: '校园域名',
                    align: 'center',
                    key: 'domain',
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
                                        this.getSchoolItem(params.row.id);
                                        this.modalCurrent = true;
                                    }
                                }
                            }, '管理'),                 
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
            schoolruleValidate : {
                name : [
                    { required: true, message: '字段必填', trigger: 'blur'},  
                ]                 
            },
            searchschoolName: '',//搜索的关键词
            spinShow: true,
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
        loadschoolData () {  
            
            Util.ajax.post('/ajax/admin/school/query',{
                  keyword: this.body.keyword,
                  page: this.body.page, 
                  size: this.body.size}).then((response) => {
                  this.spinShow = false;    

                 this.body = response.data;
                 this.editschoolData = response.data.items;               
           })             
        },
        getSchoolItem (id) {
             Util.ajax.post('/ajax/admin/school/get',{id: id}).then((response) => {                      
                this.schoolitem = response.data;                
            })  
        },
        /***********************SEARCH***********************/
        handleSearch () {            
            this.body.items = this.search(this.editschoolData, {
                name: this.searchschoolName               
            });
        },
        /***********************ADD***********************/
        handleAdd () {
            this.schoolitem = {
                name: "",
                domain: "",
                notes: ""
            }

            this.modalCurrent = true;
        },
        handleSave () {     
            Util.ajax.post('/ajax/admin/school/save',this.schoolitem).then((response) => {                      
                if(response.data.code == 0) { //保存成功
                  this.loadschoolData();    
                }                             
            })             
        },
        cancel () {
            this.$Message.info('点击了取消按钮');
        },
        handleRemove (id) {
            Util.ajax.post('/ajax/admin/school/remove',{id: id}).then((response) => {                      
                this.loadschoolData();
            })
        },
        /*********************** PAGE ***********************/
        changePageIndex (event) {
            this.body.page = event;
            this.loadschoolData();
        },
        changePageSize (event) {
            this.body.size = event;
            this.loadschoolData();
        },     
    },
    created () {
        this.loadschoolData();
    }
};

</script>
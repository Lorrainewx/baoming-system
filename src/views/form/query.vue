<template>
    <Card>
        <p slot="title">
           {{ $route.meta.title }}
        </p>
        <Row>
            <Col span="20">
                <Input v-model="body.keyword" @on-keyup.enter="loadData" placeholder="Enter something..." style="width: 300px"></Input>
                <Button @click="loadData" type="primary">查询</Button>
                <Button @click="body.keyword='';loadData();" :type="body.keyword==''?'dashed':'ghost'" :disabled="body.keyword==''">取消查询</Button>
                <Button @click="body.page=1;loadData" type="info">刷新</Button>
            </Col>
            <Col span="4" :style="{textAlign:'right'}">
                <Button type="success" @click="handleAdd" v-show="showAdd">添加</Button>
            </Col>
        </Row>

        <DragableTable 
            v-model="body.items" 
            :columns-list="columns" 
            @on-start="handleOnstart" 
            @on-end="handleOnend" 
        ></DragableTable>

        <Modal v-model="modalCurrent" @on-ok="handleSave" @on-cancel="cancel">
            <p slot="header" style="color:#000;font-weight: 700;text-align:center">
               <span>{{ formitem.name }}</span>
           </p>
            <div style="">
                <Form :model="formitem" :label-width="80">
                    <FormItem label="表单名称">
                        <Input v-model="formitem.name" placeholder="表单名"></Input>
                    </FormItem>

                    <FormItem label="开始时间">                        
                        <DatePicker :value="formitem.starttime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期和时间" @on-change="formitem.starttime=$event"></DatePicker>
                    </FormItem>  

                    <FormItem label="结束时间">                        
                        <DatePicker :value="formitem.endtime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期和时间" @on-change="formitem.endtime=$event"></DatePicker>
                    </FormItem>  

                </Form>             
            </div>           
        </Modal>

        <Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>数据加载中...</div>
        </Spin> 

    </Card>
</template>
<script>
    import Util from '../../libs/util';
    import Sortable from 'sortablejs';
    import DragableTable from './components/canDragableTable.vue';
    import Cookies from 'js-cookie';

    export default {
        name: 'dragable-table',
        components: {
            DragableTable
        },
        computed:{
            showAdd: function(){return Cookies.get('user_type') != 'techer_False';}
        },
        data() {
            return {
                body: { items: [], keyword: '', page: 1, size: 20 },
                modalCurrent: false,//模态框
                spinShow: true,
                formitem: {
                    name: "", 
                    enable: false, 
                    starttime: "",
                    endtime: "",
                },
                formDrag: {//拖拽属性
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
                },  
                columns: [
                    { title: '序号', key: 'sortby', width: 80,align: 'center' },
                    { title: '编号', key: 'id', width: 80,align: 'center' },
                    { title: '名称', key: 'name' },
                    // { title: '是否启用', align: 'center',key: 'enable',render: (h, params) => {
                    //     return h('i-switch', {
                    //             props: {                                    
                    //                 value: params.row.enable,
                    //                 refs: String,
                    //                 'v-model': params.row.enable,
                    //             },
                    //             on: {
                    //                 'on-change': () => { // ？？？？？？？？？？？？数据双向绑定？  如何取出switch的值 ？？？？？？？
                    //                   // console.log(this);
                    //                    Util.ajax.post('/ajax/form/enable',{//表单
                    //                        id: params.row.id,
                    //                        enable: ! params.row.enable,
                    //                    }).then((res) => {        
                    //                       this.loadData();
                    //                    }) 
                    //                 }
                    //             }
                    //        });
                    // }  },
                    
                ]
            }
        },         
        methods: {
           
            loadData: function() {                
                Util.ajax.post('/ajax/form/query', { keyword: this.body.keyword, page: this.body.page, size: this.body.size }).then(response => {
                    this.spinShow = false;
                    this.body = response.data;
                });
            },
            getItemData (id) {
                Util.ajax.post('/ajax/form/get', { id: id }).then(response => {
                    this.formitem = response.data;
                });
            },
            handleAdd () {
                this.modalCurrent = true;
                this.formitem = {
                    name: "", 
                    enable: false, 
                    starttime: "",
                    endtime: "",
                    sortby: 0,
                };
            },
            handleSave () {
                Util.ajax.post('/ajax/form/save', this.formitem).then((response) => {                                                
                    this.loadData();
                });
            },
            cancel () {
                this.loadData();
            },
            /******************** DRAG ********************/
            handleOnstart (from) {
                this.formDrag.oldIndex = from;
                this.formDrag.hasDragged = true;
                this.formDrag.isDragging = true;
                console.log(from);
            },
            handleOnend (e) {
                this.formDrag.isDragging = false;
                this.formDrag.draggingRecord.unshift({
                    from: e.from + 1,
                    to: e.to + 1
                });      

                Util.ajax.post('/ajax/form/sortby', {
                    from: e.from,
                    to: e.to,
                    id: this.body.items[e.to].id                
                }).then((response) => {                                
                    this.body.items = response.data.body;      
                }); 
            },    
            /********************** Page ***********************/
            changePageIndex (event) {
                this.body.page = event;
                this.loadData();
            },
            changePageSize (event) {
                this.body.size = event;
                this.loadData();
            }
        },
        created: function(){
            this.columns.push({ 
                        title: '数据',
                        key: 'edit_group',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('div', [               
                               h('Button', {
                                   style: {
                                       margin: '0 5px'
                                   },
                                   props: {
                                       type: 'info'
                                   },
                                   on: {
                                        click: () => {                                             
                                          //console.log(params.row.id);
                                            let argu = {form_id: params.row.id};                                                                        
                                            this.$router.push({
                                                name: 'form-data',
                                                params: argu
                                            });  
                                        }
                                   }
                               }, '数据查看')
                            ]);
                           
                        }
                    });
            if(Cookies.get('user_type') == 'techer_True'){
            this.columns.push({
                        title: '操作', 
                        key: 'form_operation',
                        width: 280,
                        align: 'center',
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
                                            /*this.getItemData(params.row.id);
                                            this.modalCurrent = true;*/
                                            let argu = {form_id: params.row.id};                                                                        
                                            this.$router.push({
                                                name: 'form-resource',
                                                params: argu
                                            }); 
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
                                                Util.ajax.post('/ajax/form/remove',{//表单
                                                    id: params.row.id
                                                }).then((res) => {         
                                                    this.loadData();
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
                                ]),
                                h('Button',{
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'primary'
                                        },
                                        on: {
                                            click: () => {                                             
                                               //console.log(params.row.id);
                                               let argu = {form_id: params.row.id};                                                                        
                                               this.$router.push({
                                                   name: 'form-group',
                                                   params: argu
                                               });  
                                            }
                                        }
                                    }, '分组管理')
                            ]);                               
                        },
                    });
                    /*this.columns.push({ 
                        title: '操作2',
                        key: 'edit_group',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'primary'
                                    },
                                    on: {
                                        click: () => {                                             
                                           //console.log(params.row.id);
                                           let argu = {form_id: params.row.id};                                                                        
                                           this.$router.push({
                                               name: 'form-group',
                                               params: argu
                                           });  
                                        }
                                    }
                                }, '分组管理')
                            ]);
                           
                        }
                    });*/
            }

            this.loadData();
        },
    };
</script>
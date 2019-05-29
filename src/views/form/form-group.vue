<template>
    <Card>
        <p slot="title">
           {{ formname }} - {{ $route.meta.title }}
        </p>
        <Row>
            <Col span="16">
                <Input v-model="body.keyword" @on-keyup.enter="loadData" placeholder="Enter something..." style="width: 300px"></Input>
                <Button @click="loadData" type="primary">查询</Button>
                <Button @click="body.keyword='';loadData();" :type="body.keyword==''?'dashed':'ghost'" :disabled="body.keyword==''">取消查询</Button>
                <Button @click="loadData" type="info">刷新</Button>
            </Col>
            <Col span="8" :style="{textAlign:'right'}">
               <Button @click="handleBack" icon="arrow-return-left" style="margin: 0 10px;" class="notprint">返回</Button> 
                <Button type="success" @click="handleAdd">添加</Button>
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
               <span>{{ groupitem.name }}</span>
           </p>
            <div style="text-align:center">
                <Form :model="groupitem" :label-width="80">
                    <FormItem label="分组名称">
                        <Input v-model="groupitem.name" placeholder="分组名"></Input>
                    </FormItem>

                    <FormItem label="分组描述">
                        <Input v-model="groupitem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入一段描述..."></Input>
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

    export default {
        name: 'dragable-table',
        components: {
            DragableTable
        },
        data() {
            return {
                body: { items: [], keyword: '', page: 1, size: 20 },
                modalCurrent: false,//模态框
                spinShow: true,
                groupitem: {
                    name: "", 
                    sortby: 0,
                    id: 0,
                },
                formname: '',
                groupDrag: {//拖拽属性
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
                },  
                columns: [
                    { title: '序号', key: 'sortby',width: 80,align: 'center' },                   
                    { title: '名称', key: 'name' },                   
                    {
                        title: '操作', 
                        key: 'group_operation',
                        align: 'center',
                        width: 280,
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
                                            this.getItemData(params.row.id);
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
                                                Util.ajax.post('/ajax/group/remove',{//表单
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
                                    props: {
                                        type: "primary"
                                    },
                                    on: {
                                        click: () => {
                                            let argu = {group_id: params.row.id};                                                                       
                                            this.$router.push({
                                                name: 'form-field',
                                                params: argu
                                            }); 
                                        }
                                    }
                                },'字段管理')
                            ]);                               
                        },
                    },                    
                ]
            }
        },         
        methods: {           
            loadData () {
                
                Util.ajax.post('/ajax/group/query', { 
                    formid: this.$route.params.form_id, 
                    keyword: this.body.keyword, 
                    page: this.body.page, 
                    size: this.body.size    
                }).then(response => {
                    this.spinShow = false;
                    this.body = response.data;
                });
            },
            getFormName () {
                Util.ajax.post('/ajax/form/get', { 
                    id: this.$route.params.form_id,   
                }).then(response => {
                    this.formname = response.data.name;
                });
            },
            getItemData (id) {
                Util.ajax.post('/ajax/group/get', { id: id }).then(response => {
                    this.groupitem = response.data;
                });
            },
            handleAdd () {
                this.modalCurrent = true;
                this.groupitem = {
                    name: "", 
                    id: 0,
                    sortby: 0,
                };
            },
            handleSave () {
                this.groupitem.formid = this.$route.params.form_id;
                Util.ajax.post('/ajax/group/save', this.groupitem).then((response) => {                                                
                    this.loadData();
                });
            },
            cancel () {
                this.loadData();
            },
            handleBack () {
                window.history.back();
            },
            /******************** DRAG ********************/
            handleOnstart (from) {
                this.groupDrag.oldIndex = from;
                this.groupDrag.hasDragged = true;
                this.groupDrag.isDragging = true;
            },
            handleOnend (e) {
                this.groupDrag.isDragging = false;
                this.groupDrag.draggingRecord.unshift({
                    from: e.from + 1,
                    to: e.to + 1
                });     

                Util.ajax.post('/ajax/group/sortby', {
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
            },

        },
        created: function(){
            this.loadData();
            this.getFormName();
        },
    }
</script>
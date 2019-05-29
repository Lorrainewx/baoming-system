<template>
    <Card>
        <p slot="title">
            {{ groupname }} - {{ $route.meta.title }}
        </p>
        <Row>
            <Col span="16">
              <Input v-model="fielditems.keyword" @on-keyup.enter="loadData" placeholder="Enter something..." style="width: 300px"></Input>
              <Button @click="loadData" type="primary">查询</Button>
              <Button @click="fielditems.keyword='';loadData();" :type="fielditems.keyword==''?'dashed':'ghost'" :disabled="fielditems.keyword==''">取消查询</Button>
              <Button @click="loadData" type="info">刷新</Button>
            </Col>
            <Col span="8" :style="{textAlign:'right'}">
               <Button @click="handleBack" icon="arrow-return-left" style="margin: 0 10px;" class="notprint">返回</Button> 
              <Button type="success" @click="handleAdd">添加</Button>
            </Col>
        </Row>

       <DragableTable 
           v-model="fielditems.items" 
           :columns-list="columns" 
           @on-start="handleOnstart" 
           @on-end="handleOnend" 
       ></DragableTable>

       <Modal v-model="modalCurrent" @on-ok="handleSave" @on-cancel="cancel">
            <p slot="header" style="color:#000;font-weight: 700;text-align:center">
                <span>{{ fielditem.name }}</span>
            </p>
           <div style="">
               <Form :model="fielditem" :label-width="90">
                   <FormItem label="字段名称">
                       <Input v-model="fielditem.name" placeholder="字段名"></Input>
                   </FormItem>

                   <FormItem label="字段描述">
                       <Input v-model="fielditem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入一段描述..."></Input>
                   </FormItem>

                  <Row>
                    <Col span="12">
                   <FormItem label="最大长度">
                       <Input v-model="fielditem.maxlength" placeholder="最大长度"></Input>
                   </FormItem>
                 </Col>
                    <Col span="12">
                   <FormItem label="最小长度">
                       <Input v-model="fielditem.minlength" placeholder="最小长度"></Input>
                   </FormItem>
                 </Col>
                 </Row>

                 <FormItem label="验证格式">
                   <label><Checkbox v-model="fielditem.isnumber"></Checkbox>数字</label>&nbsp;&nbsp;&nbsp;&nbsp;
                   <label><Checkbox v-model="fielditem.isdate"></Checkbox>日期</label>&nbsp;&nbsp;&nbsp;&nbsp;
                   <label><Checkbox v-model="fielditem.isidcard" @on-change="IdCardChange"></Checkbox>身份证</label>&nbsp;&nbsp;&nbsp;&nbsp;
                   <label><Checkbox v-model="fielditem.isphone"></Checkbox>电话号码</label>
                 </FormItem>

                  <Row>
                    <Col span="12">
                   <FormItem label="是否必填">
                       <i-switch v-model="fielditem.isrequired" size="large">
                           <span slot="open">是</span>
                           <span slot="close">否</span>
                       </i-switch>
                   </FormItem>
                 </Col>
                    <Col span="12">
                   <FormItem label="是否唯一值">
                       <i-switch v-model="fielditem.isunique" size="large">
                           <span slot="open">是</span>
                           <span slot="close">否</span>
                       </i-switch>
                   </FormItem>
                 </Col>
                 </Row>

                  <Row>
                    <Col span="12">
                   <FormItem label="列表显示">
                       <i-switch v-model="fielditem.isshowintable" size="large">
                           <span slot="open">是</span>
                           <span slot="close">否</span>
                       </i-switch>
                   </FormItem>
                 </Col>
                    <Col span="12">
                   <FormItem label="审核查询条件">
                       <i-switch v-model="fielditem.isquerycriteria" size="large">
                           <span slot="open">是</span>
                           <span slot="close">否</span>
                       </i-switch>
                   </FormItem>
                 </Col>
                 </Row>
                   <FormItem label="验证出生日期">
                       <i-switch v-model="fielditem.isverifybirthday" size="large" :disabled="fielditem.isidcard == false">
                           <span slot="open">是</span>
                           <span slot="close">否</span>
                       </i-switch>
                   </FormItem>

                   <FormItem label="所属类型">
                       <Select v-model="fielditem.type">
                           <Option v-for="txtType in txtTypes" :value="txtType.type" :key="txtType.type">{{ txtType.name }}</Option> 
                       </Select>
                   </FormItem>
                   
                   
                   <FormItem label="选项">
                       <Input v-model="fielditem.options" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="多个选项时请用半角符逗号隔开"></Input>
                   </FormItem>
               </Form>
          </div>           
       </Modal>
      

        <Page :page-size="fielditems.size" :total="fielditems.total" show-sizer show-elevator show-total @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

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
                modalCurrent: false,//模态框
                spinShow: true,
                fielditems: {//数据
                    keyword:'', 
                    page: 1, 
                    size: 20,
                    items: []
                },
                fielditem: {
                    deletetime: null,
                    description: '',
                    isdate: false,
                    isidcard: false,
                    isnumber: false,
                    isrequired: false,
                    isverifybirthday: false,
                    name: '',
                    type: 'text'
                },
                txtTypes: [
                    {
                        type : "text",
                        name: "文本"
                    },
                    {
                        type : "area",
                        name: "区域"
                    },
                    {
                        type: "select",
                        name: "下拉框"
                    },
                    {
                        type: "checkbox",
                        name: "复选框"
                    },
                    {
                        type: "radio",
                        name: "单选框"
                    }
                ],
                //isorno: '是',//单选框默认选项 
                groupname: '',
                fieldDrag: {//拖拽属性
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
                        width: 180,
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
                                                
                                                Util.ajax.post('/ajax/field/remove',{//表单
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
                                ])
                            ]);                               
                        },
                    },
                ]
            }
        },         
        methods: {           
            loadData () {              
                Util.ajax.post('/ajax/field/query', { 
                    groupid: this.$route.params.group_id,
                    keyword: this.fielditems.keyword, 
                    page: this.fielditems.page, 
                    size: this.fielditems.size  
                }).then(response => {
                    this.spinShow = false;
                    this.fielditems = response.data;
                });
            },
            getGroupName () {
                Util.ajax.post('/ajax/group/get', { 
                    id: this.$route.params.group_id,   
                }).then(response => {
                    this.groupname = response.data.name;
                });
            },
            getItemData (id) {
                Util.ajax.post('/ajax/field/get', { id: id }).then(response => {
                    this.fielditem = response.data;
                });
            },
            handleAdd () {
                this.modalCurrent = true;
                this.fielditem = {
                    name: '',
                    type: 'text',
                    isidcard: false
                };
            },
            handleSave () {
                this.fielditem.groupid = this.$route.params.group_id;

                Util.ajax.post('/ajax/field/save', this.fielditem).then((response) => {                                                
                    this.loadData();
                });
            },
            cancel () {
                this.loadData();
            },
            handleBack () {
              window.history.back();
            },
            /********************* Drag Start *********************/
            handleOnstart (from) {
                this.fieldDrag.oldIndex = from;
                this.fieldDrag.hasDragged = true;
                this.fieldDrag.isDragging = true;
            },
            handleOnend (e) {
                this.fieldDrag.isDragging = false;
                this.fieldDrag.draggingRecord.unshift({
                    from: e.from + 1,
                    to: e.to + 1
                });     

               Util.ajax.post('/ajax/field/sortby', {
                    from: e.from,
                    to: e.to,
                    id: this.fielditems.items[e.to].id                
                }).then((response) => {                                
                    this.fielditems.items = response.data.body;      
                });

            },   
            /*********************** Drag Start ***********************/
            changePageIndex (event) {
                this.body.page = event;
                this.loadData();
            },
            changePageSize (event) {
                this.body.size = event;
                this.loadData();
            },   
            /********************* Drag End *********************/  
            IdCardChange (value) {
              this.fielditem.isverifybirthday = false;
            }
        },
        created: function(){
            this.loadData();
            this.getGroupName();
        },
    };
</script>
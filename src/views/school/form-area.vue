<template>
    <Card>
        <p slot="title">
            {{ $route.meta.title }}
        </p>

        <Row>
            <Col span="20">
                <Input v-model="searchareaname" @on-keyup.enter="handleSearch" placeholder="Enter something..." style="width: 300px"></Input>
                <Button @click="handleSearch" type="primary">查询</Button>
                <Button @click="searchareaname='';loadData();" :type="searchareaname==''?'dashed':'ghost'" :disabled="searchareaname==''">取消查询</Button>
                <Button @click="loadData" type="info">刷新</Button>
            </Col>
            <Col span="4" :style="{textAlign:'right'}">
                <Button type="success" @click="handleAdd">添加</Button>
            </Col>
        </Row>

        <Table
           refs="areaTable"  
           :columns="columns" 
           :data="areaitems"  
           border
           >     
       </Table>       

        <Modal v-model="modalCurrent" @on-ok="handleSave" @on-cancel="cancel">        
            <!--  自定义头部 -->
            <p slot="header">区域管理</p>                                   
            <!-- 自定义内容  :rules="rules" -->
            <Form :model="areaitem"> 
                <FormItem label="区域名：" prop="name">
                    <Input v-model="areaitem.name" placeholder="输入区域名称..."></Input>
                </FormItem>  
                <!-- 如何将本parentid的值 modelArea -->
                <FormItem label="该区域所属：" class="parent">
                    <!-- <p v-if="modelArea != ''">注：已选好的所属区域不可更改</p> -->
                    <Select v-model="modelArea">
                        <Option :value="0" :key="0">无</Option>  <!-- 父级栏目 -->
                        <Option v-for="item in areaitems" v-if="item.id != areaitem.id " :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem> 
            </Form>
        </Modal>

        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>数据加载中...</div>
        </Spin> 

    </Card>
</template>
<script>
    import Util from '../../libs/util';
    import Sortable from 'sortablejs';
 

    export default {
        data() {
            return {
                areaitems: [],
                editareaData: [],
                modalCurrent: false,//模态框
                spinShow: true,
                areaitem: {
                    name: "", 
                    sortby: 0,
                    id: 0,
                },
                modelArea: '',
                searchareaname: '',//搜索关键词
                columns: [
                    { title: '序号', key: 'sortby',width: 80,align: 'center' },                   
                    { title: '名称', key: 'name' },                   
                    {
                        title: '操作', 
                        key: 'group_operation',
                        align: 'center',
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
                                            this.getItemData(params.row.id);
                                            this.modalCurrent = true;

                                            this.modalCurrent = true;
                                            for(var i in this.areaitems) {
                                                if(this.areaitems[i].id == params.row.id) {
                                                    this.modelArea = this.areaitems[i].parentid;
                                                }                                        
                                            }
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
                                                Util.ajax.post('/ajax/area/remove',{//表单
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
            handleSearch () {
                this.areaitems = this.search(this.editareaData, {
                    name: this.searchareaname               
                });
            },
            loadData () {                
                Util.ajax.post('/ajax/area/query', {  
                }).then(response => {
                    this.spinShow = false;
                    this.areaitems = this.editareaData = response.data;
                });
            },
            getItemData (id) {
                Util.ajax.post('/ajax/area/get', { id: id }).then(response => {
                    this.areaitem = response.data;
                });
            },
            handleAdd () {
                this.modalCurrent = true;
                // this.modelArea = '';
                this.areaitem = {
                    name: "", 
                    id: 0,
                    sortby: 0,
                };
            },
            handleSave () {
                this.areaitem.parentid = this.modelArea;
                Util.ajax.post('/ajax/area/save', this.areaitem).then((response) => {                                                
                    this.areaitem = response.data.body;
                    this.loadData();
                });
            },
            cancel () {
                this.loadData();
            },   
        },
        created: function(){
            this.loadData();
        },
    }
</script>
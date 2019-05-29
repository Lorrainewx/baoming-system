<template>
    <Card>
       <p slot="title">
           {{ $route.meta.title }}
       </p>        
        <Row class="margin-top-10">        

            <!-- button Start -->
            <Input v-model="formitems.keyword" @on-keyup.enter="loadFormList" placeholder="请输入教师名称搜索..." style="width: 200px" />         <span @click="loadFormList" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
            <Button @click="formitems.keyword='';loadFormList();"  :type="formitems.keyword==''?'dashed':'ghost'" :disabled="formitems.keyword==''"></Icon>取消查询</Button>
    <!--         <Button @click="handleAdd" type="info" style="margin: 0 10px;">增加</Button> -->
            <Button @click="refresh" type="info" style="margin: 0;" icon="refresh">刷新</Button>
            <!-- button End -->


            <!-- Table Data Start -->
            <Table 
                refs="techTable" 
                :data="formitems.items" 
                :columns="edittechColumns"                     
            >   
            </Table>                         

            <!-- Table Data End -->

            <Page :page-size="formitems.size" :total="formitems.total" show-sizer show-elevator show-total @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>


            <Modal v-model="modalCurrent" @on-ok="handleSave" @on-cancel="cancel">
                <p slot="header">
                  复制表单                               
                </p>

                <Form :label-width="120">
                    <FormItem label="所属校园">
                        <Select v-model="modelArea">
                            <Option v-for="item in schools" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>                     
                    </FormItem>
                  <!-- <FormItem label="表单名称">
                     <Input v-model="formname"></Input>
                  </FormItem> -->
                </Form>
            </Modal>


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
            formitems: [],  
            schools: [],  
            formitem: {}, 
            formid: 0, 
/*            formname: '',*/
            modelArea: '',
            isadmin: 'true',
            edittechData: [],
            edittechColumns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 80,
                    align: 'center'
                },{
                    title: '编号',
                    key: "id",
                    width: 80,
                    align: 'center',
                },{
                    title: '表单名称',
                    key: "name",
                },{
                    title: '校园名称',
                    key: "school",
                },{
                    title: '操作',
                    align: 'center',
                    width: 120,
                    key: 'handle',
                    render: (h ,params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                },
                                on: {
                                    click: () => {   
                                        this.formid = params.row.id;                             
                                        this.modalCurrent = true;
                                        this.loadSchooList();
                                    }
                                }
                            }, '复制'),                            
                        ]);                               
                    },                    
                },      
            ],            
            modalCurrent: false, //模态框
            spinShow: true,
        };
    },
    methods: {
    
        /***********************DATA LOAD***********************/
        loadFormList () {
            this.spinShow = false;
            Util.ajax.post('/ajax/admin/form/query',{
                keyword: this.formitems.keyword,
                page: this.formitems.page, 
                size: this.formitems.size
            }).then((response) => {           
                this.spinShow = false;            
                this.formitems = response.data;
            })            
        },           
        loadSchooList () {
            Util.ajax.post('/ajax/admin/school/query',{
                size: 10000,
            }).then((response) => {                   
                this.schools = response.data.items;               
            })  

        },
        refresh () {
            this.loadFormList();
        },
        handleCancel () {
            this.loadFormList();
        },        
        handleSave () {     
            console.log(this.formid);
            Util.ajax.post('/ajax/admin/form/copy', {
                formid: this.formid,
                schoolid: this.modelArea,
            }).then((response) => {                                              
                this.loadFormList();
            });
        },
        cancel () {
            this.$Message.info('点击了取消按钮');
        },
        /*********************** PAGE ***********************/
        changePageIndex (event) {
            this.formitems.page = event;
            this.loadFormList();
        },
        changePageSize (event) {
            this.formitems.size = event;
            this.loadFormList();
        },     
    },
    created () {
        this.loadFormList();
        this.loadSchooList();
    }
};

</script>
<style>
   .ivu-table td, .ivu-table th,
    table tr td {
        text-align: center;
    }
    .ivu-table td, .ivu-table th {
        border-right: 1px solid #e9eaec;
    }
</style>
<template>
    <Card>
        <p slot="title">
           {{ form.name }} - {{ $route.meta.title }}
        </p>
        <Row>
            <Col span="20">
                <Button @click="printItems" :type="this.selection.length==0?'dashed':'info'" style="margin-right: 20px;">打印</Button>
                <label for="">审核状态：</label>
                <Select v-model="body.examined" style="width:200px" placeholder="所有记录">
                    <!-- <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
                    <Option value="">所有记录</Option>
                    <Option value="S">待审核</Option>
                    <Option value="T">通过审核</Option>
                    <Option value="F">未通过审核</Option>
                </Select>

                <Select v-model="body.classes" style="width:200px" placeholder="所有记录">
                    <Option value="所有记录">所有记录</Option>
                    <Option value="大班">大班</Option>
                    <Option value="中班">中班</Option>
                    <Option value="小班">小班</Option>
                </Select>

                <label for="">区域搜索：</label>
                <Input v-model="body.keyword" @on-keyup.enter="loadData" placeholder="Enter something..." style="width: 300px"></Input>
                <Button @click="loadData" type="primary">查询</Button>
                <Button @click="body.keyword='';loadData();" :type="body.keyword==''?'dashed':'ghost'" :disabled="body.keyword==''">取消查询</Button>
                <Button @click="loadData" type="info">刷新</Button>
            </Col>
            <Col span="4" :style="{textAlign:'right'}">
               <Button @click="handleBack" icon="arrow-return-left" style="margin: 0 10px;" class="notprint">返回</Button> 
                <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
                <Button type="success" @click="handleExport(1)">导出</Button>
            </Col>
        </Row>
        <Table
            ref="tableExcel" 
            :columns="columnsCsv" 
            :data="body.items"
            @on-selection-change="selectionChange"
            border
            >     
        </Table>   

        
        <Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
        </Spin>

        <iframe src="" id="print-iframe" frameborder="0" width="10" height="10"></iframe>
    </Card>
</template>

<script>
    import Util from '../../libs/util';
    import Sortable from 'sortablejs';
    import table_excel from '../../libs/tableexcel.js';

    export default {
        data() {
            return {
                form: {},
                body: { items: [], examined: '', keyword: '', page: 1, size: 20 },
                editdataitems: [],
                columnsCsv: [],//属性名
                modalCurrent: false,//模态框
                dataitem: {
                },
                modelArea: '',
                searchareaname: '',//搜索关键词
                excelFileName: '数据汇总表',
                tableExcel: {},
                spinShow: true,
                columnsMore: { 
                    title: '详情',
                    key: 'detail_form',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                type: 'primary'
                            },
                            on: {
                                click: () => {
                                    let argu = { data_id: params.row.id };                                                                        
                                    this.$router.push({
                                        name: 'form-datadetail',
                                        params: argu
                                    });
                                }
                            }
                        }, '查看');
                    }
                },
                columnsExamine: {
                    title: '审核状态',
                    align: 'center',
                    key: 'examined',
                    width: 100,
                    render: (h,params) => {
                        return h('div',params.row.examined == 'T' ? '通过审核' : params.row.examined == 'F' ? '未通过审核' : '待审核')
                    }                   
                },
                columnsBianhao: {                
                    title: '序号',
                    type: 'selection',
                    width: 80,
                    align: 'center'                                    
                },
                selection: [],
                csvDetailData: []
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
                this.body.items = this.search(this.editdataitems, {
                    f1: this.searchareaname               
                });
            },
            loadData () {
                
                Util.ajax.post('/ajax/data/query', {  
                    formid: this.$route.params.form_id, 
                    examined: this.body.examined,
                    classes: this.body.classes,
                    keyword: this.body.keyword,
                    page: this.body.page, 
                    size: this.body.size
                }).then((response) => {
                    this.spinShow = false;                    
                    this.body = response.data;
                    this.columnsCsv = response.data.columns;   
                    if(this.columnsCsv.length !== 0) {
                        this.columnsCsv.push(this.columnsExamine);
                        this.columnsCsv.push(this.columnsMore);   
                        this.columnsCsv.splice(0,0,this.columnsBianhao); 
                    }    
                    
                });
            },
            getItemData (id) {
                Util.ajax.post('/ajax/data/get', { id: id }).then((response) => {
                    this.dataitem = response.data;
                });
            },
            handleSave () {
                this.dataitem.parentid = this.modelArea;
                console.log(this.modelArea);
                Util.ajax.post('/ajax/area/save', this.dataitem).then((response) => {                                                
                    this.dataitem = response.data.body;
                });
            },
            cancel () {
                this.loadData();
            },   
            handleExport (type) {  //excel格式下载
                //table_excel.transform(this.$refs.tableExcel, 'hrefToExportTable', this.excelFileName);
                var iframe = document.getElementById('print-iframe');
                iframe.src = Util.url + '/admin/export?formid=' + this.form.id;
            },
            handleBack () {
                window.history.back();
            },
            changePageIndex (event) {
                this.body.page = event;
                this.loadData();
            },
            changePageSize (event) {
                this.body.size = event;
                this.loadData();
            },
            selectionChange (selection){
                this.selection = selection;
            },
            printItems (){
                var ids = this.selection.map(function(e){ return e.id });
                // if(ids.length > 0) {
                //     Util.ajax.post('/ajax/data/batch', {formid: this.form.id,ids:ids.join(',')}).then((response) => {
                //         this.csvDetailData = response.data;
                //     });
                // }
                var iframe = document.getElementById('print-iframe');
                iframe.src = Util.url + '/admin/printer?formid=' + this.form.id + '&ids=' + ids.join(',');
            }
        },
        created: function(){
            Util.ajax.post('/ajax/form/get', {id: this.$route.params.form_id}).then((response) => {
                this.form = response.data;
            });

            this.loadData();
        },
    }
</script>
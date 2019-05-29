
<style lang="less" scoped>
    .ivu-col.ivu-col-span-18 {
    	float: none;
    }
    .ivu-col-span-18 {
	    display: block;
	    width: 100% ! important;;
	}
    #print-content {
    	width: 100%;
    	margin: 30px auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    table th, table td {
        border: 1px solid #ccc;
        padding: 5px;
        text-align: left;
    }
    form[data-v-0cb83fc0] {
        border: none!important;
    }
    h1 {
    	text-align: center;
    }
</style>
<template>
    <Card>
       <p slot="title">
           {{ $route.meta.title }}
       </p>
       <Row>
           <Col span="20">
             <Button @click="printItems" type="primary" icon="printer" style="margin: 0 10px;" class="notprint">打印</Button>  
             <Button @click="handleCheck" type="primary" icon="android-checkmark-circle" style="margin: 0 10px;" class="notprint">审核</Button>  
           </Col>
           
           <Col span="4" :style="{textAlign:'right'}">
				<Button @click="handleBack" type="success" icon="arrow-return-left" style="margin: 0 10px;" class="notprint">返回</Button> 
           </Col>
       </Row>
      <Modal v-model="modalCurrent" @on-ok="handleCommit" @on-cancel="handleCancel">    
	      	<p slot="header" style="color:#000;font-weight: 700;text-align:center">
	          	<span>审核区域</span>
	      	</p>           
         	<div style="text-align:center">
	            <Form> 	    	 		
	    			<FormItem label="审核状态：">					
	    		 		<RadioGroup v-model="csvDetailData.examined">
	    		 	        <Radio label="">					 	            
	    		 	            <span>待审核</span>
	    		 	        </Radio>
	    		 	        <Radio label="T">					 	            
	    		 	            <span>审核通过</span>
	    		 	        </Radio>
	    		 	        <Radio label="F">					 	            
	    		 	            <span>未通过审核</span>
	    		 	        </Radio>
	    		 	    </RadioGroup>
	    		 	</FormItem>
	    			
	    			<FormItem label="留言备注：">
	    			   <Input v-model="csvDetailData.cause" placeholder="请输入备注..."></Input>
	    			</FormItem>  
	    		 
	    	 	</Form>  
	        </div>           
      </Modal>
        <Row>
            <div>
				<!-- 水秀新村的详细数据 -->
				<Col span="18">				
				    
				    

				   	<div id="print-content">				  
						<h1> 《{{ formname }}》</h1>
            			<table v-if="csvDetailData != null">
            	            <template v-for="group in csvDetailData.groups">
            	                <tr>
            	                    <td colspan="4" style="text-align: center;">
            	                        <strong>{{ group.name }}</strong><br />
            	                        {{ group.description }}
            	                    </td>
            	                </tr>
            	                <tr v-for="columns in groupWhere(group.id)">
            	                    <template v-for="column in columns" v-if="column != null">
            	                        <th width="20%">{{ column.name }}</th>
            	                        <td width="30%">{{ csvDetailData.data['f' + column.id] }}</td>
            	                    </template>
            	                </tr>
            	            </template>
            	        </table>
                    </div>
                   			
		    	 	 
					
					<!-- alert -->
		    	 	<Alert v-if="alertInfo" type="success" show-icon closable>保存成功！</Alert>		 

		    	 	<Spin fix v-if="spinShow">
		    	 	    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
		    	 	    <div>加载中...</div>
		    	 	</Spin>   	 	
		    	 </Col>
            </div>
        </Row>

        <iframe src="" id="print-iframe" frameborder="0" width="10" height="10"></iframe>
    </Card>
</template>

<script>
import Util from '../../libs/util';

	export default {
	    name: 'exportable-table',
	    data () {
	        return {
	            /***************** 单个详情 ********************/
	            csvDetailData: {},//所有列表的数据
	            csvDetailColumns: [], //列表的行属性名
	            csvDetailItems: [],//列表列属性值    
	            csvDetailform : {
	                id: 1,
	            },
	            csvDetailGroups : [],
	            csvFileName: '',
	            excelFileName: '',
	            examinedState: '',
	            alertInfo: false,
	            formname: '',
	            form: {},
	            spinShow: true,
	            modalCurrent: false,
	        };
	    },
	    methods: {
	        loadDataItem () { /********************* 单个数据 *********************/
	        	this.spinShow = false;
	            Util.ajax.post('/ajax/data/get',{
	                id: this.$route.params.data_id,
	            }).then((response) => {                                
	                this.csvDetailData = response.data;
	                this.csvDetailColumns = response.data.columns;
	                this.csvDetailItems = response.data.data;
	                this.csvDetailGroups = response.data.groups; 
	                this.form = response.data.form;  
	                this.formname = response.data.form.name;  
	            });

	        },
	        handleCommit () {
	        	//提交审核结果
	        	Util.ajax.post('/ajax/data/examine',{
	        	    id: this.$route.params.data_id,
	        	    examined: this.csvDetailData.examined,
	        	    cause: this.csvDetailData.cause
	        	}).then((response) => {                                
	        	    /*window.history.back();  */
	        	});
	        },
	        handleCancel () {
	        	this.loadDataItem ();
	        },
	        handlePrint () {
	        	document.body.innerHTML = document.getElementById("print-content").innerHTML;
	        	window.print();
	        	location.reload();
	        },
	        handleCheck () { //审核
	        	this.modalCurrent = true;
	        },
	        handleBack () {
	        	window.history.back();
	        },
	        groupWhere (groupid) {
                var gs = new Array();
                var is = new Array();

                this.csvDetailData.columns.forEach(function(value, index, array){
                    if(value.groupid == groupid) {
                        if(is.length < 2) {
                            is.push(value);
                        }

                        if(is.length >= 2) {
                            gs.push(is);
                            is = new Array();
                        }
                    }
                });

                if(is.length > 0 && is.length < 2) {
                    is.push(null);
                    gs.push(is);
                }

                return gs;
            },
            printItems (){
                var iframe = document.getElementById('print-iframe');
                iframe.src = Util.url + '/admin/printer?formid=' + this.form.id + '&ids=' + this.csvDetailData.id;
            }
	    },
	    created () {
	        this.loadDataItem();
	    },
	};
</script>
<template>
	<Row :gutter="16">
		<Col span="8">
			<Card :bordered="false">
                <p slot="title">报名总数</p>
				{{ count.total }} 人
			</Card>
		</Col>
		<Col span="8">
			<Card :bordered="false">
                <p slot="title">昨日报名人数</p>
				{{ count.yesterday }} 人
			</Card>
		</Col>
		<Col span="8">
			<Card :bordered="false">
                <p slot="title">今日报名人数</p>
				{{ count.today }} 人
			</Card>
		</Col>
	</Row>
</template>
<script>
    import Util from '../libs/util';

	export default {
        data() {
            return {
                count: { }
            };
        },
        created () {
            Util.ajax.post('/ajax/count').then((response) => {                    
                this.count = response.data;
            });
        },
	};
</script>
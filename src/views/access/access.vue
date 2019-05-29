<template>	
	<div class="access">
		<p>当前用户权限{{ accessCode }}</p>
	</div>
</template>

<script>
	import Cookies from 'js-cookie'

	export default {
		name: "access_index",
		data () {
			return {
				accessCode: parseInt(Cookies.get('access'))
			}
		},
		methods: {
			
		},		 
	}
</script>
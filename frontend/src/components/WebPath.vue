<template>
  <div class="row my-4">
    <div class="col-6 px-0">
      <ul class="path">
        <li v-for="(path, key, index) in paths" :key="key" class="mx-1">
          <router-link
            :class="[
              'text-decoration-none',
              { 'disabled-link': index === Object.keys(paths).length - 1 },
            ]"
            :to="key"
          >
            {{ path }}
          </router-link>
          <span v-if="index !== Object.keys(paths).length - 1" class="mx-1"
            >/</span
          >
        </li>
      </ul>
    </div>
    <div class="col-6" v-if="button && button.isShow">
      <router-link :class="button.type" @click="handleClick" style="float: right" :to="button.path"
        >{{ button.msg }}</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
    props: {
        paths: {
            type: Object,
            required: true,
        },
        button: {
            type: Object,
            required: false,
        },
    },
    methods:{
      handleClick(){
        if(this.button.emitFunc){
          this.$emit('onButtonClick');
        }
      }
    }
};
</script>

<style>
</style>
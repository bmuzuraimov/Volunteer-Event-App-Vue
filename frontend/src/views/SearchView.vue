<template>
  <div class="container-fluid">
    <div class="container">
      <WebPath :paths="path" :button="button" />
      <Events :keyword="keyword" page="search"/>
    </div>
  </div>
</template>

<script>
import WebPath from "@/components/WebPath.vue";
import Events from "@/components/Events.vue";
export default {
  props: {
    keyword: String,
  },
  components: {
    WebPath,
    Events,
  },
  data() {
    return {
      path: { "/": "Home", "/event": "Search" },
      button: { msg: "New", path: "/event/new", type: "btn btn-primary" },
    };
  },
};
</script>

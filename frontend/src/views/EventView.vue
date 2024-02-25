<template>
  <div class="container-fluid">
    <div class="container">
      <WebPath :paths="path" :button="button" />
      <Event page="events"/>
    </div>
  </div>
</template>

<script>
import WebPath from "@/components/WebPath.vue";
import Event from "@/components/Events.vue";
export default {
  components: {
    WebPath,
    Event,
  },
  data() {
    return {
      path: { "/": "Home", "/event": "Events" },
      button: { msg: "New", path: "/event/new", type: "btn btn-primary", isShow: this.$userDecoded && this.$userDecoded.isAdmin },
      events: [],
    };
  },
};
</script>

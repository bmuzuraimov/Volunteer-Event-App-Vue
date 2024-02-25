<template>
  <Loading v-if="total === 0" />
  <div class="row" v-if="events">
    <div v-for="event in events" :key="event._id" class="col-md-4 mb-3 px-0">
      <div class="card h-100">
        <router-link :to="{ name: 'Event detail', params: { id: event._id } }">
          <img
            style="max-height: 250px; object-fit: cover"
            class="card-img-top"
            :src="event.image"
            alt="Event Image"
          />
        </router-link>
        <div class="card-body d-flex flex-column">
          <h3 class="card-title mb-2 text-truncate">
            {{ event.title }}
          </h3>
          <p class="card-text text-clamp-4 mb-2">
            {{ event.description }}
          </p>
          <div class="mt-auto">
            <span class="date float-right text-muted"
              >Last updated {{ event.modifiedAt }} ago</span
            >
            <button
              v-if="$userDecoded && !$userDecoded.isAdmin"
              @click="joinEvent($event)"
              :data-id="event._id"
              :class="[
                'btn',
                'btn-sm',
                'mt-2',
                'float-end',
                event.joined ? 'btn-outline-secondary' : 'btn-outline-primary',
              ]"
              :disabled="event.joined"
            >
              {{ event.joined ? "Joined" : "Join" }}
            </button>
            <router-link
              v-if="$userDecoded && $userDecoded.isAdmin"
              :to="{ name: 'Edit event', params: { id: event._id } }"
              class="btn btn-sm mt-2 float-end btn-outline-primary"
              >Edit</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav class="my-4" v-if="total != 0 && pagination_pages.includes(page)">
    <ul class="pagination">
      <!-- First page -->
      <li class="page-item" :class="{ active: currentPage === 1 }">
        <span
          class="page-link"
          style="cursor: pointer"
          @click="handlePagination($event)"
          >1</span
        >
      </li>

      <!-- Indicate break with "..." if page > 3 -->
      <li v-if="currentPage > 3" class="page-item disabled">
        <span class="page-link" style="cursor: pointer">...</span>
      </li>

      <!-- Middle pages -->
      <li
        v-for="i in middlePages"
        :key="i"
        :class="{ 'page-item': true, active: i === currentPage }"
      >
        <span
          class="page-link"
          style="cursor: pointer"
          @click="handlePagination($event)"
          >{{ i }}</span
        >
      </li>

      <!-- Indicate break with "..." if there's a gap to the last page -->
      <li v-if="currentPage < totalPages - 2" class="page-item disabled">
        <span class="page-link" style="cursor: pointer">...</span>
      </li>

      <!-- Last page, but only if there's more than 1 page -->
      <li
        v-if="totalPages > 1"
        :class="{ 'page-item': true, active: currentPage === totalPages }"
      >
        <span
          class="page-link"
          style="cursor: pointer"
          @click="handlePagination($event)"
          >{{ totalPages }}</span
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import axios from "axios";
import Loading from "@/components/Loading.vue";
export default {
  components: {
    Loading,
  },
  props: ["page", "keyword"],
  data() {
    return {
      total: 0,
      events: [],
      pagination_pages: ["events", "myevents", "search"],
      currentPage: 1,
      perPage: 3,
      total: 0,
    };
  },
  mounted() {
    if (this.page === "events") this.get_events();
    else if (this.page === "myevents") this.get_my_events();
    else if (this.page === "home") this.get_recent_events();
    else if (this.page === "search") this.get_event_by_title();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    middlePages() {
      let start = Math.max(2, this.currentPage - 2);
      let end = Math.min(this.currentPage + 2, this.totalPages - 1);
      let pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    async get_recent_events() {
      try {
        var response = null;
        if (this.$userDecoded && !this.$userDecoded.isAdmin) {
          response = await axios.get(
            `/api/volunteer/recent_events/${this.$userDecoded._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } else {
          response = await axios.get("/api");
        }
        if (response.status >= 200 && response.status < 399) {
          this.events = response.data.events;
          this.total = this.events.length;
        } else {
          alert(response.data.message);
        }
        this.events = this.events.map((event) => {
          event.modifiedAt = this.get_time_difference(event.modifiedAt);
          return event;
        });
      } catch (error) {
        alert(error.response.data.message);
      }
    },
    async get_events() {
      try {
        var response = null;
        if (this.$userDecoded && !this.$userDecoded.isAdmin) {
          response = await axios.get(
            `/api/volunteer/event/${this.$userDecoded._id}?page=${this.currentPage}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } else {
          response = await axios.get(`/api/event?page=${this.currentPage}`);
        }
        const result = await response.data;
        result.events = result.events.map((event) => {
          event.modifiedAt = this.get_time_difference(event.modifiedAt);
          return event;
        });
        this.events = result.events;
        this.total = result.total;
        this.currentPage = result.page;
        this.perPage = result.perPage;
      } catch (error) {
        alert(error.response.data.message);
      }
    },
    async get_my_events() {
      try {
        const response = await axios.get(
          `/api/volunteer/myevent/${this.$userDecoded._id}?page=${this.currentPage}&perPage=${this.perPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.data;
        result.events = result.events.map((event) => {
          event.modifiedAt = this.get_time_difference(event.modifiedAt);
          return event;
        });
        this.events = result.events;
        this.total = result.total;
        this.currentPage = result.page;
        this.perPage = result.perPage;
      } catch (error) {
        alert(error.response.data.message);
      }
    },
    async get_event_by_title() {
      if (!this.keyword) return;
      if (this.$userDecoded && !this.$userDecoded.isAdmin) {
        try {
          const response = await axios.get(
            `/api/volunteer/event/${this.$userDecoded._id}?page=${this.currentPage}&keyword=${this.keyword}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const result = await response.data;
          result.events = result.events.map((event) => {
            event.modifiedAt = this.get_time_difference(event.modifiedAt);
            return event;
          });
          this.events = result.events;
          this.total = result.total;
          this.currentPage = result.page;
          this.perPage = result.perPage;
        } catch (error) {
          alert(error.response.data.message);
        }
        return;
      }else {
        try {
          const response = await axios.get(
            `/api/event?page=${this.currentPage}&keyword=${this.keyword}`);
          const result = await response.data;
          result.events = result.events.map((event) => {
            event.modifiedAt = this.get_time_difference(event.modifiedAt);
            return event;
          });
          this.events = result.events;
          this.total = result.total;
          this.currentPage = result.page;
          this.perPage = result.perPage;
        } catch (error) {
          alert(error);
        }
      }
    },
    handlePagination(e) {
      this.total = 0;
      this.events = [];
      this.currentPage = parseInt(e.target.textContent);
      if (this.page === "events") this.get_events();
      else if (this.page === "myevents") this.get_my_events();
      else if (this.page === "home") this.get_recent_events();
      else if (this.page === "search") this.get_event_by_title();
    },
    async joinEvent(event) {
      event.target.disabled = true;
      event.target.textContent = "Joining...";
      const event_id = event.target.getAttribute("data-id");
      try {
        const response = await axios.post(
          `/api/volunteer/event/join`,
          {
            user: this.$userDecoded._id,
            event: event_id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status >= 200 && response.status < 399) {
          event.target.textContent = "Joined";
          event.target.classList.remove("btn-outline-primary");
          event.target.classList.add("btn-outline-secondary");
        }
      } catch (error) {
        event.target.textContent = "Join";
        alert(error.response.data.message);
      }
    },
    get_time_difference(modifiedAt) {
      const currentDate = new Date();
      const modifiedDate = new Date(modifiedAt);
      const differenceInMilliseconds = currentDate - modifiedDate;
      const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);

      if (months > 0) {
        return `${months} month(s)`;
      } else if (days > 0) {
        return `${days} day(s)`;
      } else if (hours > 0) {
        return `${hours} hour(s)`;
      } else {
        return `${minutes} minute(s)`;
      }
    },
  },
};
</script>
<style>
</style>
<template>
  <div class="container-fluid">
    <Carousel />
    <div class="container-fluid my-2">
      <ul class="nav nav-tabs my-1 mx-0 px-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Recent</a>
        </li>
      </ul>
      <Events page="home"/>
    </div>
  </div>
</template>

<script>
import Carousel from "@/components/Carousel.vue";
import Events from "@/components/Events.vue";
export default {
  components: {
    Carousel,
    Events,
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
  },
};
</script>

<style>
/* Carousel Styles */
.carousel-inner img {
  height: 100%;
  object-fit: cover;
  max-height: 400px;
}

.carousel-indicators li {
  background-color: #fff; /* Makes indicators more visible */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(100%); /* Makes arrows more visible */
}

/* Event Cards Styles */
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Adds subtle shadow */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Smooth transition for hover effect */
}

.card:hover {
  transform: translateY(-3px); /* Slight lift effect on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Increased shadow on hover */
}

.card-img-top {
  max-height: 250px;
  object-fit: cover; /* Ensures images fit well */
}

.card-title {
  font-size: 1.25rem; /* Adjust title size for better readability */
}

.card-text {
  color: #555; /* Slightly darker text for better contrast */
}

.date {
  font-size: 0.85rem; /* Smaller font size for date */
}

/* General Layout Adjustments */
.container-fluid {
  padding: 0 15px; /* Adjusts padding for better alignment */
}

.nav-tabs {
  border-bottom: 2px solid #dee2e6; /* More pronounced tab underline */
}
</style>

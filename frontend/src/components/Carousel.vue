<template>
      <div
      id="carouselExampleIndicators"
      style="height: 400px"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            class="d-block w-100"
            src="/images/slider-img-1.jpg"
            alt="First slide"
          />
        </div>
        <div class="carousel-item">
          <img
            class="d-block w-100"
            src="/images/slider-img-2.jpg"
            alt="Second slide"
          />
        </div>
        <div class="carousel-item">
          <img
            class="d-block w-100"
            src="/images/slider-img-3.jpg"
            alt="Third slide"
          />
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carouselExampleIndicators"
        role="button"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only"></span>
      </a>
      <a
        class="carousel-control-next"
        href="#carouselExampleIndicators"
        role="button"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only"></span>
      </a>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
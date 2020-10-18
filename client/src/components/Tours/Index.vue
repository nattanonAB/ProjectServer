<template>
  <div class="container">
    <main-header navsel="back"></main-header>
    <div class="tour-header">
      <br />
      <br />
      <h2>ส่วนจัดการจังหวัด</h2>
      <div>
        <form class="form-inline form-search">
          <div class="form-group">
            <div class="input-group">
              <input
                type="text"
                v-model="search"
                class="form-control"
                id="exampleInputAmount"
                placeholder="ค้นหา"
              />
              <div class="input-group-addon">
                <i class="fas fa-search"></i>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="create-tour">
        <button class="btn btn-success btn-sm" v-on:click="navigateTo('/tour/create')">สร้างจังหวัด</button>
        <strong>จํานวนจังหวัด:</strong>
        {{results.length}}
      </div>

      <ul class="categories">
        <li v-for="cate in category" v-bind:key="cate.index">
          <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
        </li>
        <li class="clear">
          <a v-on:click.prevent="setCategory(' ')" href="#">ล้าง</a>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <transition-group name="fade">
      <div v-for="tour in tours" v-bind:key="tour.id" class="tour-list">
        <!-- <p>id: {{ tour.id }}</p> -->
        <div class="tour-pic">
          <!-- <transition name="fade"> -->
          <div class="thumbnail-pic" v-if="tour.thumbnail != 'null'">
            <img :src="BASE_URL+tour.thumbnail" alt="thumbnail" />
          </div>
          <!-- </transition> -->
        </div>
        <h3>{{ tour.title }}</h3>
        <div v-html="tour.content.slice(0,200) + '...'"></div>
        <div class="tour-info">
          <p>
            <strong>จังหวัด:</strong>
            {{ tour.category }}
          </p>
          <p>
            <strong>สร้าง:</strong>
            {{ tour.createdAt }}
          </p>
          <p>
            <strong>สถานะ:</strong>
            {{ tour.status }}
          </p>
          <!-- <p>status: {{ tour.status }}</p> -->
          <p>
            <button class="btn btn-sm btn-info" v-on:click="navigateTo('/tour/'+ tour.id)">ดูรายละเอียด</button>
            <button class="btn btn-sm btn-warning" v-on:click="navigateTo('/tour/edit/'+ tour.id)">เเก้ไข</button>
            <button class="btn btn-sm btn-danger" v-on:click="deleteTour(tour)">Delete</button>
          </p>
          <p>
            <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="suspend(tour.id)">
              <i class="fas fa-pause"></i> ระงับ
            </a>&nbsp;
            <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="publish(tour.id)">
              <i class="fas fa-check"></i> เปิดใช้
            </a>&nbsp;
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </transition-group>

    <div id="tour-list-bottom">
      <div class="empty-tour" v-if="tours.length === 0 && loading === false">*** ไม่มีข้อมูล***</div>
      <div class="empty-tour" v-if="tours.length === 0 && loading === true">*** ไม่มีข้อมูล***</div>
      <div class="tour-load-finished" v-if="tours.length === results.length && results.length > 0" >โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
</template>
<script>
import ToursService from "@/services/ToursService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 5;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "tours",
      };

      if (this.search !== "") {
        route.query = {
          search: this.search,
        };
      }

      console.log("search: " + this.search);
      this.$router.push(route);
    }, 700),

    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.tours = [];
        this.results = [];
        this.loading = true;
        this.results = (await ToursService.index(value)).data;
        this.appendResults();

        this.results.forEach((tour) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(tour.category))
            if (this.category.indexOf(tour.category) === -1) {
              this.category.push(tour.category);
            }
          } else {
            this.category.push(tour.category);
          }
        });
        this.loading = false;
        this.search = value;
        //console.log(this.category)
      },
    },
  },
  data() {
    return {
      tours: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: "",
      results: [],
      category: [],
      loading: false,
    };
  },
  async created() {
    this.tours = (await ToursService.index()).data;
  },
  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    appendResults: function () {
      if (this.tours.length < this.results.length) {
        let toAppend = this.results.slice(
          this.tours.length,
          LOAD_NUM + this.tours.length // จำกัดการแสดงผล
        );
        this.tours = this.tours.concat(toAppend);
      }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteTour(tour) {
      try {
        await ToursService.delete(tour);
        this.refreshData();
      } catch (err) {
        console.log(err);
      }
    },
    async refreshData() {
      this.tours = (await ToursService.index()).data;
    },
    setCategory(keyword) {
      if (keyword === " ") {
        this.search = "";
        console.log("null");
      } else {
        this.search = keyword;
      }
    },
    updated() {
      let sens = document.querySelector("#tour-list-bottom");
      pageWatcher = ScrollMonitor.create(sens);
      pageWatcher.enterViewport(this.appendResults);
    },
    beforeUpdated() {
      if (pageWatcher) {
        pageWatcher.destroy();
        pageWatcher = null;
      }
    },
    async suspend(tourId) {
      let user = {
        id: tourId,
        status: " Suspend",
      };
      try {
        await ToursService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async publish(tourId) {
      let user = {
        id: tourId,
        status: "published",
      };
      try {
        await ToursService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
.empty-tour {

  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: rgb(0, 0, 0);
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 10px 0px 0px;
}
.tour-info {
  float: left;
}
.tour-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.tour-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.tour-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

#tour-list-bottom {
  padding-top: 4px;
}

#tour-list-bottom {
  padding: 10px;
  text-align: center;
  /*background: seagreen;*/
  color: white;
}
.categories {
  margin-top: 10px;
  padding: 0;
  list-style: none;
  float: left;
}
.categories li {
  float: left;
  padding: 2px;
}
.categories li a {
  padding: 5px 10px 5px 10px;
  background: paleturquoise;
  color: black;
  text-decoration: none;
}
.create-tour {
  margin-top: 10px;
}
.categories li.clear a {
  background: tomato;
  color: white;
}
.tour-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
.emptytour {
  background-color: coral;
  border-color: coral;
}
</style>
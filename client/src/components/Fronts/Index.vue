<template>
  <div>
    <main-header navsel="front"></main-header>
    <div class="hero-wrapper">
      <div class="component-wrapper">
        <div class="hero">
          <img src="@/assets/tour.png" class="logo" style="float:left" />
          <h1>ยินดีต้อนรับเข้าสู่ T&T Tour</h1>
          <p>By TOEY and TAPE</p>
        </div>

        <div class="clearfix"></div>
        <div class="tour-header">
          <div>
            <form class="form-inline form-search">
              <span>
                <strong>จํานวนจังหวัด:</strong>
                {{results.length}}
              </span>
              &nbsp;
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
                <strong>เวลาสร้าง:</strong>
                {{ tour.createdAt }}
              </p>
              <!-- <p>status: {{ tour.status }}</p> -->
              <p>
                <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front/read/'+ tour.id)"><i class="fab fa-readme"></i> ดูรายละเอี่ยด
                </button>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
        </transition-group>
        <div  v-if="tours.length === 0 && loading === false" class="empty-tour">*** ไม่มีข้อมูล***</div>
        <div id="tour-list-bottom">
          <div class="tour-load-finished" v-if="tours.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ToursService from "@/services/ToursService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";
import { mapState } from "vuex";

let LOAD_NUM = 3;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "front",
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
        this.results = (await ToursService.frontIndex(value)).data;
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
        // console.log(this.category)
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
  // async created () {
  // this.tours = (await ToursService.index()).data
  // },
  methods: {
    appendResults: function () {
      if (this.tours.length < this.results.length) {
        let toAppend = this.results.slice(
          this.tours.length,
          LOAD_NUM + this.tours.length
        );
        this.tours = this.tours.concat(toAppend);
      }
    },
    navigateTo(route) {
      if (this.user == null) {
        alert("Please, Register or Login before.\n\nThank you.");
      } else {
        this.$router.push(route);
      }
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
  /*mounted() {
    if (!this.isUserLoggedIn) {
      this.$router.push({
        name: "front",
      });
    }
  },*/
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
};
</script>
<style scoped>
.component-wrapper {
  padding-left: 5px;
  padding-right: 5px;
}
.hero {
  margin-top: 80px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  background: rgb(105, 105, 105);
  height: 250px;
  color: rgb(255, 255, 255);
  padding: 20px;
}
.hero h1 {
  margin-top: 0px;
}
.logo {
  padding-right: 20px;
  height: 210px;
  width: 610px;
}
.empty-tour {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: darksalmon;
  color: white;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 5px 5px 5px;
  border: solid 1px #ccc;
  margin: 10px 10px 0px 0px;
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
  margin-top: 80px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
#book-list-bottom {
  padding: 4px;
  text-align: center;
  color: white;
}
.tour-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
.categories {
  margin-top: 20px;
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
.categories li.clear a {
  background: tomato;
  color: white;
}
.create-tour {
  margin-top: 10px;
}
@media (max-width: 768px) {
  .logo {
    width: 120px;
  }
}
.emptytour {
  background-color: coral;
  border-color: coral;
}
.empty-tour {
  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: white;
  margin-left: auto;
  margin-right: auto;
}
</style>

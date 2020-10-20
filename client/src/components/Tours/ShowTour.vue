<template>
    <div class="component-wrapper container">
        <main-header navsel="back"></main-header>
        <br><br>
        <div v-if="tour" >
            <div class="tour-wrapper" v-if="tour != null">
                <h1>{{ tour.title }}</h1>
                <p><strong>ประเภท: </strong> 
                <a href="#" v-on:click.prevent="navigateTo(`/tours?search=${tour.category}`)">{{tour.category }}</a></p>
                <p>
          <strong>สถานะ:</strong> {{tour.status}}
        </p>
                <div class="content" v-html="tour.content"></div>
                <!-- <p>category: {{ tour.category }}</p>
                <p>status: {{ tour.status }}</p> -->
            </div>
            <div class="back-nav"><button class="btn btn-success" v-on:click="navigateTo('/tours')"><i class="fas fa-arrow-left"></i> ย้อนกลับ..</button></div>
            
            <br>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import ToursService from '@/services/ToursService'
    import UsersService from '@/services/UsersService'
    

    export default {
        data () {
            return {
                tour: null,
                resultUpdated: '',
                users:null,
            }
        },
        components : {
            
        },
        async created () {
            // get tour
            // check permission first
            try {
                let tourId = this.$route.params.tourId
                this.tour = (await ToursService.show(tourId)).data
            } catch (error) {
                console.log (error)
            }
            },
            methods: {
                navigateTo (route) {
                this.$router.push(route)
                }
            },
            computed: {
                ...mapState([
                    'isUserLoggedIn',
                    'user'
                ])
            }
    }
</script>
<style scoped>
    .hero {
        margin-top: 80px;
        border-radius: 5px;
        background: darkcyan;
        height:250px;
        color:white;
        padding: 20px;
    }
    .hero h1 {
        margin-top: 30px;
    }
    .tour-wrapper {
        margin-top:20px;
        padding: 40px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    }
    .back-nav {
        margin-top: 20px;
        text-align: center;
    }
    .tour-wrapper h1{
        text-align: center;
        font-family: 'kanit';
        padding-bottom: 50px;
    }
    .tour-wrapper p {
        font-family: 'kanit';
        font-size: 1.4em;
        padding-bottom:20px;
    }
    .tour-wrapper .content {
        font-family: 'kanit';
        font-size: 1.2em;
    }
</style>
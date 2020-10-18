import Vue from 'vue'
import Router from 'vue-router'
// Users
import UserIndex from '@/components/Users/Index'
import UserCreate from '@/components/Users/CreateUser'
import UserEdit from '@/components/Users/EditUser'
import UserShow from '@/components/Users/ShowUser'
// Authen
import Login from '@/components/Login'
// Tours
import TourIndex from '@/components/Tours/Index'
import TourCreate from '@/components/Tours/CreateTour'
import TourEdit from '@/components/Tours/EditTour'
import TourShow from '@/components/Tours/ShowTour'
import CommentIndex from '@/components/Comments/Index'
// Upload Testing
import Upload from '@/components/Utils/Upload'
// Front
import FrontIndex from '@/components/Fronts/Index'
import FrontShow from '@/components/Fronts/ShowTour'
import FrontBooks from '@/components/Fronts/Books'
import FrontshowBooks from '@/components/Fronts/showBook'
import FrontCartlist from '@/components/Fronts/Cartlist'

// Books
import BookIndex from '@/components/Books/Index'
import BookCreate from '@/components/Books/CreateBook'
import BookEdit from '@/components/Books/EditBook'
import BookShow from '@/components/Books/ShowBook'
import Cartlist from '@/components/Books/Cartlist'


Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/users',
      name: 'users',
      component: UserIndex
    },
    {
      path: '/user/create',
      name: 'users-create',
      component: UserCreate
    },
    {
      path: '/user/edit/:userId',
      name: 'user-edit',
      component: UserEdit
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: UserShow
    },
    // authen
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // tours
    {
    path: '/tours',
    name: 'tours',
    component: TourIndex
    },
    {
      path: '/tour/create',
      name: 'tours-create',
      component: TourCreate
    },
    {
      path: '/tour/edit/:tourId',
      name: 'tour-edit',
      component: TourEdit
    },
    {
      path: '/tour/:tourId',
      name: 'tour',
      component: TourShow
    },
    // comments
    {
      path: '/comments',
      name: 'comments',
      component: CommentIndex
    },
    // upload testing
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    // front
    {
      path: '/front',
      name: 'front',
      component: FrontIndex
    },
    {
      path: '/front-books',
      name: 'front-books',
      component: FrontBooks
    },
    {
      path: '/front-cartlist',
      name: 'cartlist',
      component: FrontCartlist
    },
    {
      path: '/front-view-book/:bookId',
      name: 'front-view-book',
      component: FrontshowBooks
    },
    {
      path: '/front/read/:tourId',
      name: 'front-read',
      component: FrontShow
    },
    // books
    {
      path: '/books',
      name: 'books',
      component: BookIndex
    },
    {
      path: '/book/create',
      name: 'books-edit',
      component: BookCreate
    },
    {
      path: '/book/edit/:bookId',
      name: 'book-edit',
      component: BookEdit
    },
    {
      path: '/book/:bookId',
      name: 'book',
      component: BookShow
    },
    {
      path: '/Cartlist',
      name: 'Cartlist',
      component: Cartlist
    },
  ]
})
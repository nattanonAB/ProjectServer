import Api from '@/services/Api'

export default {
    index (search) {
        return Api().get('tours', {
            params: {
                search: search
            }
        })
    },
    show (tourId) {
        return Api().get('tour/'+tourId)
    },
    post (tour) {
        return Api().post('tour', tour)
    },
    put (tour) {
        return Api().put('tour/'+tour.id, tour)
    },
    delete (tour) {
        return Api().delete('tour/'+tour.id, tour)
    },
    frontIndex (search) {
        return Api().get('tours/front', {
            params: {
                search: search
            }
        })
    },
}
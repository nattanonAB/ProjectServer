import Api from '@/services/Api'
export default {
    index(search) {
        return Api().get('comments', {
            params: {
                search: search
            }
        })
    },
    show (commentId) {
        return Api().get('comment/'+commentId)
    },
    post (comment) {
        return Api().post('comment', comment)
    },
    put (comment) {
        return Api().put('comment/'+comment.id, comment)
    },
    delete (comment) {
        return Api().delete('comment/'+comment.id, comment)
    },
    tour (tourId) {
        return Api().get('comment/tour/'+tourId)
    },
    user (userId) {
        return Api().get('comment/user/'+userId)
    }
}
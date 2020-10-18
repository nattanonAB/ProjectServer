const {Tour} = require('../models')

module.exports = {

    // indx with serach tour
    async index (req, res) {
        try {
            let tours = null
            const search = req.query.search
            // console.log('search key: ' + search)
            if (search) {
                tours = await Tour.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                    },
                    order: [['updatedAt', 'DESC']]
                })
            } else {
                tours = await Tour.findAll({
                    order: [['updatedAt', 'DESC']]
                })
            }
                res.send(tours)
            } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the tours'
            })
        }
    },
    // create Tour
    async create (req, res) {
        // res.send(JSON.stringify(req.body))
        try {
            const tour = await Tour.create(req.body)
            res.send(tour.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create tour incorrect'
            })
        }
    },

    // edit tour, suspend, active
    async put (req, res) {
        try {
            await Tour.update(req.body, {
                where: {
                    id: req.params.tourId
                }
            })
        res.send(req.body)
        } catch (err) {
            req.status(500).send({
                error: 'Update tour incorrect'
            })
        }
    },
        // delete tour
    async remove (req, res) {
        try {
            const tour = await Tour.findOne({
                where: {
                id: req.params.tourId
                }
            })
            if(!tour){
                return res.status(403).send({
                    error: 'The tour information was incorrect'
                })
            }
            await tour.destroy()
            res.send(tour)
        } catch (err) {
            req.status(500).send({
                error: 'The tour information was incorrect'
            })
        }
    },
        // get tour by id
    async show (req, res) {
        try {
            const tour = await Tour.findById(req.params.tourId)
            res.send(tour)
        } catch (err) {
            req.status(500).send({
                error: 'The tour information was incorrect'
            })
        }
    },
    async frontIndex (req, res) {
        try {
            let tours = null
            const search = req.query.search
            console.log('----------> search key: ' + search)
            if (search) {
                tours = await Tour.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                        $and: [
                            {
                                status:
                                {
                                    $eq: "published"
                                }
                            },
                        ]
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                tours = await Tour.findAll({
                where: {
                    'status': 'published'
                },
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(tours)
        }catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the tours'
            })
        }
    },

}
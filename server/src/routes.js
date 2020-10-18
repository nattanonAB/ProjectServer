const UserController = require('./controllers/UserController')
const UserAuthenController = require('./controllers/UserAuthenController')
const isAuthenController = require('./authen/isAuthenController') //ใช้เช็ค token
const TourController = require('./controllers/TourController')
const BookController = require('./controllers/BookController')
const CommentController = require('./controllers/CommentController')
const BuyController = require('./controllers/BuyController')
let multer = require("multer")
// upload section
let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./src/public/uploads");
    },
    filename: function(req, file, callback) {
        // callback(null, file.fieldname + '-' + Date.now());
        console.log(file);
        callback(null, file.originalname);
    }
})

   

module.exports = (app) => {

    let upload = multer({ storage: storage }).array("userPhoto", 10)
    /* RESFUL Api for users management */
    // create user
    app.post('/user',
        //isAuthenController,
        UserController.create
    )

    // edit user, suspend, active
    app.put('/user/:userId',
    isAuthenController,
        UserController.put
    )
    // delete user
    app.delete('/user/:userId',
    isAuthenController,
        UserController.remove
    )
    // get user by id
    app.get('/user/:userId',
    isAuthenController,
        UserController.show
    )

    // get last user
    app.get('/lastuser',
    isAuthenController,
        UserController.lastuser
    )

    // get all user
    app.get('/users',
        isAuthenController,// ใช้เช็ค token
        UserController.index
    )
    app.post('/login',
        UserAuthenController.login
    )
    // tour route
    // create tour
    app.post('/tour',
    isAuthenController,
        TourController.create
    )
    // edit tour, suspend, active
    app.put('/tour/:tourId',
    isAuthenController,
        TourController.put
    )
    // delete tour
    app.delete('/tour/:tourId',
    isAuthenController,
        TourController.remove
    )
    // get tour by id
    app.get('/tour/:tourId',
    isAuthenController,
        TourController.show
    )
    // get all tour
    app.get('/tours',
        isAuthenController,// ใช้เช็ค token
        TourController.index
    )
    // comment route
    // create comment
    app.post('/comment',
    isAuthenController,
        CommentController.create
    )
    // edit comment, suspend, active
    app.put('/comment/:commentId',
    isAuthenController,
        CommentController.put
    )
    // delete comment
    app.delete('/comment/:commentId',
    isAuthenController,
        CommentController.remove
    )
    // get comment by id
    app.get('/comment/:commentId',
    isAuthenController,
        CommentController.show
    )
    // get all comment
    app.get('/comments',
        isAuthenController,// ใช้เช็ค token
        CommentController.index
    )
    app.post('/front/login',
        UserAuthenController.clientLogin
    )
    // upload
    app.post("/upload", function(req, res) {
        // isUserAuthenticated,
        upload(req, res, function(err) {
            if (err) {
                return res.end("Error uploading file.");
            }
            res.end("File is uploaded");
        })
    })
    //delete file uploaded function
    app.post('/upload/delete', async function (req, res) {
        try {
            const fs = require('fs');
            console.log(req.body.filename)
            fs.unlink(process.cwd() + '/src/public/uploads/' + req.body.filename,
            (err) => {
                if (err) throw err;
                res.send("Delete sucessful")
                // console.log('successfully deleted material file');
            });
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to delete file the material'
            })
        }
    })
    
    // get comment by id
    app.get('/comment/tour/:tourId',
    isAuthenController,
        CommentController.tour
    )

    // get comment by id
    app.get('/comment/user/:userId',
    isAuthenController,
        CommentController.user
    )
    // users
    // get front
    app.get('/users/front',
        UserController.getFront
    )
    app.get('/tours/front',
        TourController.frontIndex
    )
    
    // book route
    // create book
    app.post('/book',
        isAuthenController,
        BookController.create
    )
    // edit book, suspend, active
    app.put('/book/:bookId',
        isAuthenController,
        BookController.put
    )
    // delete book
    app.delete('/book/:bookId',
        isAuthenController,
        BookController.remove
    )
    // get book by id
    app.get('/book/:bookId',
        BookController.show
    )
    // get all book
    app.get('/books',
        isAuthenController,
        BookController.index
    )
    app.get('/books/front',
        BookController.frontIndex
    )

    // buy route
    // create buy
    app.post('/buy',
        isAuthenController,
        BuyController.create
    )
    // edit buy, suspend, active
    app.put('/buy/:buyId',
        isAuthenController,
        BuyController.put
    )
    // get all buy
    app.get('/buys',
        isAuthenController,
        BuyController.index
    )
    app.get('/buy/:userId',
        isAuthenController,
        BuyController.user
    )

}
var express = require('express')
var app = express()

app.use(express.static(__dirname + '/public'));

//Design
app.get('/design', function(req,res){
  res.render('blog/design', {
    title: 'Design'
  })
});
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM blog_post ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('blog/list', {
                    title: 'Blog Posts',
                    data: ''
                })
            } else {
                // render to views/blog/list.ejs template file
                res.render('blog/list', {
                    title: 'Blog Post',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD POST FORM
app.get('/add', function(req, res, next){
    // render to views/blog/add.ejs
    res.render('blog/add', {
        title: 'Create New Post',
        name: '',
        content: '',
        author: ''
    })
})

// ADD NEW POST POST ACTION
app.post('/add', function(req, res, next){
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('content', 'Content is required').notEmpty()             //Validate age
    req.assert('author','Author is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!

        var bPost = {
            name: req.sanitize('name').escape().trim(),
            content: req.sanitize('content').escape().trim(),
            author: req.sanitize('author').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO blog_post SET ?', bPost, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/blog/add.ejs
                    res.render('blog/add', {
                        title: 'Add New Post',
                        name: bPost.name,
                        content: bPost.content,
                        author: bPost.author
                    })
                } else {
                    req.flash('success', 'Data added successfully!')

                    // render to views/blog/add.ejs
                    res.render('blog/add', {
                        title: 'Create New Post',
                        name: '',
                        content: '',
                        author: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name
         * because req.param('name') is deprecated
         */
        res.render('blog/add', {
            title: 'Create New Post',
            name: req.body.name,
            content: req.body.content,
            author: req.body.author
        })
    }
      res.redirect('/blog')
})

// SHOW EDIT POST FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM blog_post WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err

            // if post not found
            if (rows.length <= 0) {
                req.flash('error', 'Post not found with id = ' + req.params.id)
                res.redirect('/blog')
            }
            else { // if post found
                // render to views/blog/edit.ejs template file
                res.render('blog/edit', {
                    title: 'Edit Blog Post',
                    //data: rows[0],
                    id: rows[0].id,
                    name: rows[0].name,
                    content: rows[0].content,
                    author: rows[0].author
                })
            }
        })
    })
})

// EDIT POST POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('content', 'Content is required').notEmpty()             //Validate age


    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!

        var bPost = {
            name: req.sanitize('name').escape().trim(),
            content: req.sanitize('content').escape().trim(),

        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE blog_post SET ? WHERE id = ' + req.params.id, bPost, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/blog/add.ejs
                    res.render('blog/edit', {
                        title: 'Edit Post',
                        id: req.params.id,
                        name: req.body.name,
                        content: req.body.content
                    })
                } else {
                    req.flash('success', 'Post updated successfully!')

                    // render to views/blog/add.ejs
                    res.render('blog/edit', {
                        title: 'Edit Post',
                        id: req.params.id,
                        name: req.body.name,
                        content: req.body.content                    })
                }
            })
        })
          res.redirect('/blog')
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('blog/edit', {
            title: 'Edit Post',
            id: req.params.id,
            name: req.body.name,
            content: req.body.content
        })
    }
})

// DELETE Post
app.delete('/delete/(:id)', function(req, res, next) {
    var del = { id: req.params.id }

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM blog_post WHERE id = ' + req.params.id, del, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to blog list pa

                res.redirect('/blog')
            } else {
                req.flash('success', 'Post deleted successfully! id = ' + req.params.id)
                // redirect to blog list page
                res.redirect('/blog')
            }
        })
    })
})

module.exports = app

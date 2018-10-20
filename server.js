var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL)
var db = pgp('postgres://swvdjapflwlqyg:c0c2a74d8ea2d5012d6e41aadcf5242b7d3a52f6921650ac736b7a10885f5a91@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d1bhuue0uajvkm?ssl=true');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/index', function (req, res) {
    res.render('pages/index');
});
app.get('/about', function (req, res) {
    var name = 'Peeranan T. Reanmataen';
    var hobbies = ['music', 'movie', 'programming'];
    var bdate = '28/01/1998'
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate });
});
app.get('/products', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { product: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })

});
// display all products
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id=" + pid;

    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/product_edit', { product: data[0] })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })


});
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

app.get('/users', function (req, res) {
    db.any('select * from users')
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//Update product
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update product set title = '${title}', price = '${price}' where id = '${id}'`;
    res.send(sql);
    //db.none
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//update user





//user
app.get('/users/:id', function (req, res) {

    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});


//update user_edit
app.post('/user/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;

    var sql = `update users set email = '${email}', password = '${password}' where id = '${id}' `;
    db.none(sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//delete product button
app.get('/product_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//delete user button
app.get('/user_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});


//newproduct
app.get('/newproduct', function (req, res) {
    res.render('pages/newproduct');
})
app.post('/newproduct', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id, title, price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})

//newuser
app.get('/newuser', function (req, res) {
    res.render('pages/newuser');
})
app.post('/newuser', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `INSERT INTO users (id, email, password)
    VALUES ('${id}', '${email}', '${password}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});
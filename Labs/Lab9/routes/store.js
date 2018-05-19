var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
  req.getConnection(function(error, conn) {
    var sqlQuery = "select * from store;"
    // Query to get all the entires
    // conn object which will execute and return results
    conn.query(sqlQuery, function(err, rows, fields) {
      if (err) {
        // Display error message in case an error
        req.flash('error', err)

        res.render('store/list', {
          title: 'Store listing',
          data: ''
        })
      } else {
        // render to views/store/list.ejs template file
        res.render('store/list', {
          title: 'Store listing',
          data: rows
        })
      }
    })
  })
})

app.get('/add', function(req, res, next) {
  // render to views/store/add.ejs
  res.render('store/add', {
    title: 'Add New Item',
    sname: '',
    qty: '',
    price: ''
  })
})

// ADD NEW ITEM POST ACTION -- Used to insert values
// Notice that we are using post here
app.post('/add', function(req, res, next) {
  req.assert('sname', 'sname is required').notEmpty()
  // Validate sname
  req.assert('qty', 'Quantity is required').notEmpty()
  // Validate qty
  req.assert('price', 'Price is required').notEmpty()
  // Validate price

  var errors = req.validationErrors()

  if (!errors) { // No errors were found. Passed validation!
    var item = {
      sname: req.sanitize('sname').escape().trim(),
      qty: req.sanitize('qty').escape().trim(),
      price: req.sanitize('price').escape().trim()
    }

    req.getConnection(function(error, conn) {
      // Below we are donig a template replacement. The ? is replaced by an entire item object
      // This is the way shich is followed to substitute values for SET
      conn.query('INSERT INTO store SET ?', item, function(err, result) {
        if (err) {
          req.flash('error', err)

          // render to views/store/add.ejs
          res.render('store/add', {
            title: 'Add New Item',
            sname: item.sname,
            qty: item.qty,
            price: item.price
          })
        } else {
          req.flash('success', 'Data added successfully!')
          // render to views/store/add.ejs
          res.render('store/add', {
            title: 'Add New Item',
            sname: '',
            qty: '',
            price: '',
          })
        }
      })
    })
  } else {   // Display errors to user
    var error_msg = ''
    errors.forEach(function(error) {
      error_msg += error.msg + '<br>'
    })
    req.flash('error', error_msg)

    // Using req.body.sname
    // because req.param('sname') is deprecated
    //
    // Sending back the entered values for the user to verify
    res.render('store/add', {
      title: 'Add New Item',
      sname: req.body.sname,
      qty: req.body.qty,
      price: req.body.price
    })
  }
})


// SHOW EDIT ITEM FORM - Display form for update
app.get('/edit/(:id)', function(req, res, next) {
  /* TODO: Update operation is similar to add operation
     Fill out appropriate code below */
  req.getConnection(function(error, conn) {
    conn.query('SELECT * FROM store WHERE id='+req.params.id, function(err, rows, fields) {
      // if item not found
      if (rows.length <= 0) {
        req.flash('error', 'Item not found with id = ' + req.params.id)
        res.redirect('/store')
      } else {   // if item found
        // render to views/store/edit.ejs template
        res.render('store/edit', {
          title: 'Edit Item',
          id: req.params.id,
          sname: rows[0].sname,
          qty: rows[0].qty,
          price: rows[0].price
        })
      }
    })
  })
})


// EDIT ITEM POST ACTION - Update the item, actual update happens
app.put('/edit/(:id)', function(req, res, next) {
  req.assert('sname', 'Name is required').notEmpty()
  req.assert('qty', 'Quantity is required').notEmpty()
  req.assert('price', 'Price is required').notEmpty()

  var errors = req.validationErrors()

  if (!errors) {
    var item = {
      sname: req.sanitize('sname').escape().trim(),
      qty: req.sanitize('qty').escape().trim(),
      price: req.sanitize('price').escape().trim()
    }

    req.getConnection(function(error, conn) {
      conn.query('UPDATE store SET sname="'+req.body.sname+'", qty='+req.body.qty+', price='+req.body.price+' WHERE id='+req.params.id, function(err, result) {
        if (err) {
          req.flash('error', err)
          res.render('store/edit', {
            title: 'Edit Item',
            id: req.params.id,
            sname: req.body.sname,
            qty: req.body.qty,
            price: req.body.price
          })
        } else {
          req.flash('success', 'Data updated successfully!')
          res.render('store/edit', {
            title: 'Edit Item',
            id: req.params.id,
            sname: req.body.sname,
            qty: req.body.qty,
            price: req.body.price
          })
        }
      })
    })
  } else {
    var error_msg = ''
    errors.forEach(function(error) {
      error_msg += error.msg + '<br>'
    })
    req.flash('error', error_msg)

    res.render('store/edit', {
      title: 'Edit Item',
      id: req.params.id,
      sname: req.body.sname,
      qty: req.body.qty,
      price: req.body.price
    })
  }
})


// DELETE ITEM. Pass the right id in the URL
app.delete('/delete/(:id)', function(req, res, next) {
  req.getConnection(function(error, conn) {
    conn.query('DELETE FROM store WHERE id='+req.params.id, function(err, result) {
      if (err) {
        req.flash('error', err)
        res.redirect('/store')
      } else {
        req.flash('success', 'Successfully deleted item with id='+req.params.id)
        res.redirect('/store')
      }
    })
  })
})

module.exports = app // This must be the last line in the file

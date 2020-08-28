
/*******************************************************
 *   @AUTHOR: YONGQIAN HUANG, CREATED AT: 23/07/2020   *
 * @UPDATED: YONGQIAN HUANG, 23/07/2020, INIT CREATION *
 *  YONGQIAN HUANG, 23/07/2020, MIGRATE TO POSTGRESQL  *
 *  Yongqian Huang. 17/08/2020, Car listing and description  
 *  Yongqian Huang. 19/08/2020, Car creating endpoint 
 * Yongqian Huang. 28/08/2020, Car creating Validation *
 *******************************************************/


const express = require('express');
const router = express.Router();
const _Car = require('../repository/carRepository');
const _Location = require('../repository/locationRepository');
const authorize = require('../helpers/authorizationHelper');
const {carValidator,validateResult} = require('../helpers/validator');

//GET: /api/cars
router.get('/', (req, res) => {
    _Location.getAllValidateCars(req.query.from, req.query.sort, req.query.order)
        .then(async(locations) => {
            // const distance = await calculateDistance(req.params.address, cars.locations.address);
            // console.log(distance);
            res.json({locations})
        })
        .catch(
            (err) => {
                console.log(err);
                res.sendStatus(403);
            }
        )
});

//GET: /api/cars/:brand
router.get('/search', (req,res) => {
    _Car.getBy(req.query.query)
        .then(cars => {
            res.json({cars})
        })
        .catch(
            (err) => {
                console.log(err);
                res.sendStatus(403);
            }
        )
})


//GET: /api/cars/:id
router.get('/:id/',(req,res) => {
    _Car.get(req.params.id)
        .then(car => {
            res.json({car})
        })
        .catch( (err) => {
            console.log(err);
            res.sendStatus(403);
        })
})

//GET: /api/cars/attribute/brands
router.get('/attribute/brands',(req,res) => {
    _Car.getBrands()
        .then(brands => {
            res.json({brands});
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(403);
        })
})

//POST: /api/cars/create
router.post('/create', [carValidator, authorize.verifyToken], (req,res) => {
    if(!req.user.admin) res.sendStatus(403);

    validateResult(req)
        .then(()=> {
            const car = {
                name: req.body.name,
                brand: req.body.brand,
                model: req.body.model,
                location_id: req.body.location_id,
                purchase_date: req.body.purchase_date,
                price: req.body.price,
                seats: req.body.seats,
                luggages: req.body.luggages,
                doors: req.body.doors,
                gear: req.body.gear,
                addons: req.body.addons,
                description: req.body.description
            }
        
            _Car.create(car)
                .then(() => {
                    res.json({
                        message: 'success'
                    })
                })
                .catch((err) => {
                    res.json({
                        message: 'fail',
                        err
                    })
                });
        })
        .catch(errors => {
            res.json({
                message: "fail",
                errors
            })
        })
   
});


router.post('/test/', async (req,res) => {
    _Location.getAllValidateCars(req.body.from)
                .then((results) => {
                    res.json({results})
                })
                .catch(err => {
                    res.json(err);
                })
    
    
});




module.exports = router;
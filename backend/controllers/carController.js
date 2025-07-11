const slugify = require('../utils/slugify');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getCars = async (req, res) => {
  const [cars] = await db.query('SELECT * FROM cars order by id desc');
  res.json(cars);
};

exports.getCarById = async (req, res, next) => {
  try{
        const [car] = await db.query('SELECT * FROM cars WHERE slug = ?', [req.params.id]);
        if (!car.length) throw new Error('Car not found');

        res.json(car );
    } catch(err) {
        next(err);
    }    
};

exports.addCar = async (req, res, next) => {
    let image;
    try{
        const { brand, model, price, year, status } = req.body;
        image = req.file?.filename;
        if (!brand || !model || !price || !year || !image) {
            res.status(400);
            throw new Error('All fields including image are required');
        }
        
        const slug = slugify(`${brand}-${year}`);
        const [result] = await db.query('INSERT INTO cars SET ?', { brand, model, price, year, status, image, slug });
        const [cars] = await db.query('SELECT * FROM cars where id = ?', [result.insertId]);
        res.status(201).json({ msg: 'Car added', car: cars });
    } catch(err) {
         // Delete uploaded image if validation fails
            if (image) {
                const imagePath = path.join(__dirname, '..', 'uploads', image);
                fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err.message);
                });
            }
        next(err);   //  send to errorHandler
    }    
};

exports.deleteCar = async (req, res, next) => {
    try{
        const [car] = await db.query('SELECT image FROM cars WHERE id = ?', [req.params.id]);
        if (!car.length) throw new Error('Car not found');

        fs.unlinkSync(`uploads/${car[0].image}`);
        await db.query('DELETE FROM cars WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Car deleted' });
    } catch(err) {
        next(err);
    }    
};

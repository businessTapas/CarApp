const express = require('express');
const router = express.Router();
const { getCars, getCarById, addCar, deleteCar } = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/multer');

router.get('/', protect, getCars);
router.get('/:id', protect, getCarById);
router.post('/', protect, checkRole('admin'), upload.single('image'), addCar);
router.delete('/:id', protect, checkRole('admin'), deleteCar);

module.exports = router;

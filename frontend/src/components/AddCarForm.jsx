import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { API_BASE_URL } from '../utils/config';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

const validationSchema = Yup.object({
  brand: Yup.string()
    .trim()
    .strict()
    .matches(/^\S+(?: \S+)*$/, 'No leading/trailing spaces')
    .required('Brand is required'),
  model: Yup.string()
    .trim()
    .strict()
    .matches(/^\S+(?: \S+)*$/, 'No leading/trailing spaces')
    .required('Model is required'),
  year: Yup.number().required('Year is required').min(1900).max(2099),
  price: Yup.number().required('Price is required').positive(),
  status: Yup.string().required('Status is required'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileSize', 'Image too large (max 2MB)', value => value && value.size <= 2000000)
    .test('fileFormat', 'Unsupported Format', value => value && SUPPORTED_FORMATS.includes(value.type))
});

const AddCarForm = ({ onSuccess }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      brand: '',
      model: '',
      price: '',
      year: '',
      status: 'available',
      image: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        for (let key in values) {
          formData.append(key, values[key]);
        }

        const res = await api.post('/api/cars', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        onSuccess(res?.data?.car[0]);
        resetForm();
        setPreview(null);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Add car failed');
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
  <div className="form-grid">
    <div className="form-group-half">
      <label>Brand</label>
      <input type="text" name="brand" className="form-control" {...formik.getFieldProps('brand')} />
      {formik.touched.brand && formik.errors.brand && <div className="text-danger">{formik.errors.brand}</div>}
    </div>
    <div className="form-group-half">
      <label>Model</label>
      <input type="text" name="model" className="form-control" {...formik.getFieldProps('model')} />
      {formik.touched.model && formik.errors.model && <div className="text-danger">{formik.errors.model}</div>}
    </div>

    <div className="form-group-half">
      <label>Price</label>
      <input type="number" name="price" className="form-control" {...formik.getFieldProps('price')} />
      {formik.touched.price && formik.errors.price && <div className="text-danger">{formik.errors.price}</div>}
    </div>
    <div className="form-group-half">
      <label>Year</label>
      <input type="number" name="year" className="form-control" {...formik.getFieldProps('year')} />
      {formik.touched.year && formik.errors.year && <div className="text-danger">{formik.errors.year}</div>}
    </div>

    <div className="form-group-half">
      <label>Status</label>
      <select name="status" className="form-control" {...formik.getFieldProps('status')}>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
      </select>
    </div>

    <div className="form-group-half">
      <label>Image</label>
      <input type="file" name="image" className="form-control"
        onChange={(e) => {
          formik.setFieldValue('image', e.currentTarget.files[0]);
          setPreview(URL.createObjectURL(e.currentTarget.files[0]));
        }} />
      {formik.touched.image && formik.errors.image && <div className="text-danger">{formik.errors.image}</div>}
      {preview && <img src={preview} alt="Preview" style={{ height: 100, marginTop: 10 }} />}
    </div>
  </div>

  {error && <div className="text-danger mt-2">{error}</div>}
  <button type="submit" className="btn btn-primary w-100 mt-3">Add Car</button>
</form>

  );
};

export default AddCarForm;

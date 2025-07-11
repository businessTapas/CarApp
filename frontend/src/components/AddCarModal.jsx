// AddCarModal.jsx (Plain Modal Wrapper)
import React from 'react';
import './AddCarModal.css';
import AddCarForm from './AddCarForm';

const AddCarModal = ({ show, setShow, setProducts }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">Add Car
        <button className="modal-close" onClick={() => {setShow(false)}}>×</button>
            <AddCarForm onSuccess={(newCar) => {
                setProducts(prev => [newCar, ...prev]);
                setShow(false);
            }} />
      </div>
    </div>
  );
};

export default AddCarModal;

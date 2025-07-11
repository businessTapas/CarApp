import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
    MDBSpinner,

} from 'mdb-react-ui-kit';
import api from '../utils/api';
import { API_BASE_URL } from '../utils/config';
import {  isAdmin } from '../utils/auth';
import AddCarModal from './AddCarModal';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchCars = async () => {
    try {
      const res = await api.get('/api/cars/');
      setProducts(res?.data);
    } catch (err) {
      console.log(err.response?.data?.message || 'Car fetch error');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

    if (loading) {
      return (
        <MDBContainer className="text-center my-5">
          <MDBSpinner color="primary" />
        </MDBContainer>
      );
    }

  return (
    <>
      <Helmet>
        <title>Used Cars for Sale | YourCarPortal</title>
        <meta name="description" content="Buy and sell used cars online. Verified listings. Easy admin dashboard for managing cars." />
        <meta property="og:title" content="Used Car Marketplace" />
        <meta property="og:description" content="Explore second-hand cars listed by real users." />
        <meta property="og:url" content="http://localhost:5173/home" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://localhost:5173/home" />
      </Helmet>

      <div className="bgcolor1" style={{ paddingTop: '70px' }}>
        <MDBContainer className="mt-4">
          {/* Add Car Button */}
          {isAdmin() && (
            <div className="d-flex justify-content-end mb-3">
              <MDBBtn onClick={() => setModalOpen(true)}>Add Car</MDBBtn>
            </div>
          )}

          {/* Modal */}
          <AddCarModal show={modalOpen} setShow={setModalOpen} setProducts={setProducts} />

          {/* Car Grid */}
          {/* Car Grid */}
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {products.map((product) => (
            <div
              key={product?.id}
              className="card shadow-sm"
              style={{ width: '300px', minHeight: '450px' }}
            >
              <img
                src={`${API_BASE_URL}/uploads/${product.image}`}
                className="card-img-top"
                alt={product?.brand}
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{product?.brand}-{product?.model}</h5>
                <Link to={`/cars/${product?.slug}`} className="btn btn-primary mt-auto">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        </MDBContainer>
      </div>
    </>
  );
}

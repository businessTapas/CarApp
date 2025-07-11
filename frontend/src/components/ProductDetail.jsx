import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import api from '../utils/api';
import { API_BASE_URL } from '../utils/config';

const ProductDetail = () => {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/api/cars/${slug}`);
        setCar(res?.data[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Car not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [slug]);

  if (loading) {
    return (
      <MDBContainer className="text-center my-5">
        <MDBSpinner color="primary" />
      </MDBContainer>
    );
  }

  if (error) {
    return (
      <MDBContainer className="text-center my-5">
        <h4 className="text-danger">{error}</h4>
        <Link to="/home">
          <MDBBtn color="secondary" className="mt-3">Back to Home</MDBBtn>
        </Link>
      </MDBContainer>
    );
  }

  return (
    <>
      {/* Render Helmet only after car data is ready */}
      <Helmet>
        <title>{`${car.brand} ${car.model} - ${car.year} | Used Car Details`}</title>
        <meta name="description" content={`Buy ${car.brand} ${car.model} (${car.year}) for ₹${car.price}. Status: ${car.status}`} />
        <meta property="og:title" content={`${car.brand} ${car.model} - ${car.year}`} />
        <meta property="og:description" content={`Available for ₹${car.price}. Status: ${car.status}`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`http://localhost:5173/cars/${car.slug}`} />
        <meta property="og:image" content={`${API_BASE_URL}/uploads/${car.image}`} />
        <link rel="canonical" href={`http://localhost:5173/cars/${car.slug}`} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${car.brand} ${car.model}`,
            "image": `${API_BASE_URL}/uploads/${car.image}`,
            "description": `Used ${car.brand} ${car.model} listed for ₹${car.price}`,
            "brand": {
              "@type": "Brand",
              "name": car.brand
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": car.price,
              "availability": "https://schema.org/InStock",
              "url": `http://localhost:5173/cars/${car.slug}`
            }
          })}
        </script>
      </Helmet>

      <MDBContainer className="my-5">
        <MDBCard className="p-3">
          <MDBCardImage
            src={`${API_BASE_URL}/uploads/${car.image}`}
            position="top"
            alt={car.brand}
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <MDBCardBody>
            <MDBCardTitle className="mb-3">{car.brand} {car.model}</MDBCardTitle>
            <MDBCardText><strong>Year:</strong> {car.year}</MDBCardText>
            <MDBCardText><strong>Price:</strong> ₹{car.price}</MDBCardText>
            <MDBCardText><strong>Status:</strong> {car.status}</MDBCardText>

            <Link to="/home">
              <MDBBtn color="primary" className="mt-3">Back to Listing</MDBBtn>
            </Link>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default ProductDetail;

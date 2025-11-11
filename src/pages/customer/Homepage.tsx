import React from "react";
import { useNavigate } from "react-router-dom";
import SalonCard from "../../components/common/SalonCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const salons = [
    {
      id: "hair-avenue",
      image: "/images/hairavenue.jpg",
      name: "Hair Avenue",
      distance: "2.3 km",
      location: "No 03, Kadalana Road, Kadalana, Moratuwa",
      rating: 4.7,
      reviews: 312,
      hours: "9AM - 10PM, Mon - Sun",
      description:
        "Hair Avenue provides expert haircuts, styling, along with services like facials, cleanups, skincare and makeup to keep you looking your best.",
      services: [
        { id: 1, name: "Hair Cut", price: "22 BD", duration: "30 Mins" },
        { id: 2, name: "Hair Wash", price: "6 BD", duration: "30 Mins" },
      ],
      categories: ["Hair Cut", "Hair Styling", "Hair Treatments", "Combo", "Nails"],
    },
    {
      id: "blend-salon",
      image: "/images/blend.jpg",
      name: "Blend Salon",
      distance: "1.5 km",
      location: "45 Queen’s Street, Colombo",
      rating: 4.8,
      reviews: 280,
      hours: "10AM - 9PM, Mon - Sat",
      description:
        "Blend Salon specializes in creative coloring, cuts, and luxury treatments.",
      services: [
        { id: 1, name: "Full Color", price: "30 BD", duration: "45 Mins" },
        { id: 2, name: "Balayage", price: "40 BD", duration: "90 Mins" },
      ],
      categories: ["Coloring", "Highlights", "Styling", "Spa"],
    },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "40px" }}>
      {salons.map((salon) => (
        <SalonCard
          key={salon.id}
          id={salon.id}
          image={salon.image}
          name={salon.name}
          distance={salon.distance}
          location={salon.location}
          rating={salon.rating}
          reviews={salon.reviews}
          onClick={() => navigate(`/booking/${salon.id}`, { state: salon })}
        />
      ))}
    </div>
  );
};

export default HomePage;

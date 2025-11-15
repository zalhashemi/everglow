import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SalonCard from "../../components/common/SalonCard";
import TabBar from "../../components/common/TabBar";
import oliviaSalon from "../../images/oliviaSalon.jpg";
import promotionHeader from "../../images/promotionHeader.png";

// ===== Styled Components =====
const PageWrapper = styled.div`
  background-color: #f2dcdc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1600px; /* just to prevent it from going too wide on big screens */
  padding: 20px 3%; /* ✅ 15% horizontal padding */
  box-sizing: border-box;
`;

const WelcomeText = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #4A5074;
  margin: 40px 0 30px;
`;

const PromoBanner = styled.div`
  width: 100%; /* full width of ContentWrapper */
  height: 220px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;


const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const OfferTextContainer = styled.div`
  position: absolute;
  left: 20px;
  bottom: 70px;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
`;

const OfferTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
`;

const OfferDiscount = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const OfferServices = styled.div`
  font-size: 14px;
  font-weight: 400;
`;

const SalonNameText = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
`;

const BookNowButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #0b1c36;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const CategoryHeader = styled.div`
  background-color: #fff;
  display: inline-block;
  padding: 8px 18px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #4A5074;
  margin: 0;
`;

const ScrollWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  width: 100%;
  padding-bottom: 10px;
`;

const ScrollButton = styled.div<{ side: "left" | "right" }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  ${(p) => (p.side === "left" ? "left: -22px;" : "right: -22px;")}
  z-index: 5;
  transition: 0.2s ease;
  &:hover {
    transform: scale(1.05);
    background-color: #f8f8f8;
  }
`;

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    fill="none"
    stroke="#000"
    strokeWidth="2"
    viewBox="0 0 24 24"
    style={{
      transform: direction === "left" ? "rotate(180deg)" : "none",
    }}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ===== Offers Carousel Styles ===== */
const OfferCarouselWrapper = styled.div`
  width: 100%;
  max-width: 1600px; /* SAME AS CONTENT WRAPPER */
  margin: 0 auto;
  overflow: hidden;
  margin-bottom: 40px;
  position: relative;
`;


const OfferTrack = styled.div`
  display: flex;
  width: 100%; /* only 100% of parent */
  height: 220px;
  transition: transform 0.5s ease;
`;


const DotsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${(p) => (p.active ? "#0b1c36" : "#d3d3d3")};
  cursor: pointer;
`;

// ===== Component =====
const HomePage: React.FC = () => {
  console.log("🏠 Customer Homepage Loaded");
  const navigate = useNavigate();

  const salons = [
    {
      id: "hair-avenue",
      image: oliviaSalon,
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
        { id: 3, name: "Beard Trim", price: "5 BD", duration: "20 Mins" },
      ],
      categories: ["Hair Cut", "Hair Styling", "Hair Treatments", "Combo", "Nails"],
    },
    {
      id: "salon-avenue",
      image: oliviaSalon,
      name: "Salon Avenue",
      distance: "2.3 km",
      location: "No 03, Mashtan Kadalana, Moratuwa",
      rating: 4.7,
      reviews: 312,
      hours: "9AM - 10PM, Mon - Sun",
      description:
        "Hair Avenue provides expert haircuts, styling, along with services like facials, cleanups, skincare and makeup to keep you looking your best.",
      services: [
        { id: 1, name: "Hair Cut", price: "67 BD", duration: "30 Mins" },
        { id: 2, name: "Hair Wash", price: "6 BD", duration: "30 Mins" },
        { id: 3, name: "Beard Trim", price: "5 BD", duration: "20 Mins" },
      ],
      categories: ["Hair Cut", "Hair Styling", "Hair Treatments", "Combo", "Nails"],
    },
    {
      id: "blend-salon",
      image: oliviaSalon,
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
        { id: 3, name: "Blow Dry", price: "10 BD", duration: "25 Mins" },
      ],
      categories: ["Coloring", "Highlights", "Styling", "Spa"],
    },
    {
      id: "fresh-salon",
      image: oliviaSalon,
      name: "Fresh Salon",
      distance: "2.0 km",
      location: "Palm Avenue, Colombo",
      rating: 4.6,
      reviews: 198,
      hours: "9AM - 9PM, Mon - Sun",
      description:
        "Fresh Salon offers modern hair and nail care services using eco-friendly products and techniques.",
      services: [
        { id: 1, name: "Nail Polish", price: "8 BD", duration: "25 Mins" },
        { id: 2, name: "Hair Spa", price: "25 BD", duration: "60 Mins" },
      ],
      categories: ["Nails", "Hair Care", "Spa", "Massage"],
    },
    {
      id: "signature-salon",
      image: oliviaSalon,
      name: "Signature Salon",
      distance: "2.0 km",
      location: "Palm Avenue, Colombo",
      rating: 4.6,
      reviews: 198,
      hours: "9AM - 9PM, Mon - Sun",
      description:
        "Signature Salon offers modern hair and nail care services using eco-friendly products and techniques.",
      services: [
        { id: 1, name: "Nail Polish", price: "8 BD", duration: "25 Mins" },
        { id: 2, name: "Hair Spa", price: "25 BD", duration: "60 Mins" },
      ],
      categories: ["Nails", "Hair Care", "Spa", "Massage"],
    },
    {
      id: "man-salon",
      image: oliviaSalon,
      name: "Man Salon",
      distance: "1.8 km",
      location: "King’s Road, Colombo",
      rating: 4.9,
      reviews: 342,
      hours: "10AM - 8PM, Tue - Sun",
      description:
        "Man Salon is a premium grooming spot for men, offering haircuts, shaves, and relaxing treatments.",
      services: [
        { id: 1, name: "Haircut + Shave", price: "15 BD", duration: "45 Mins" },
        { id: 2, name: "Hot Towel Shave", price: "8 BD", duration: "25 Mins" },
        { id: 3, name: "Facial Treatment", price: "18 BD", duration: "50 Mins" },
      ],
      categories: ["Men’s Grooming", "Haircuts", "Beard Care", "Spa"],
    },
  ];

  // ===== OFFERS (3 offers) =====
  const offers = [
    {
      id: 1,
      salonId: "hair-avenue",
      title: "Glow-Up Hair Package",
      discountText: "20% OFF",
      servicesText: "Haircut • Blowdry • Treatment",
    },
    {
      id: 2,
      salonId: "salon-avenue",
      title: "Weekend Pamper Deal",
      discountText: "15% OFF",
      servicesText: "Facial • Manicure • Pedicure",
    },
    {
      id: 3,
      salonId: "man-salon",
      title: "Grooming Essentials",
      discountText: "25% OFF",
      servicesText: "Haircut + Shave • Facial",
    },
  ];

  const offersWithImages = offers.map((offer) => {
    const salon = salons.find((s) => s.id === offer.salonId);
    return {
      ...offer,
      image: salon?.image || promotionHeader, // fallback
    };
  });

  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  useEffect(() => {
    if (offersWithImages.length === 0) return;

    const interval = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % offersWithImages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [offersWithImages.length]);

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollPositions, setScrollPositions] = useState<number[]>([]);

  const CARDS_PER_PAGE = 5;
  const CARD_WIDTH = 255 + 18;

  const handleScroll = (index: number, direction: "left" | "right") => {
    const container = scrollRefs.current[index];
    if (!container) return;

    const delta = direction === "right" ? CARD_WIDTH * CARDS_PER_PAGE : -CARD_WIDTH * CARDS_PER_PAGE;
    container.scrollBy({ left: delta, behavior: "smooth" });

    setScrollPositions((prev) => {
      const updated = [...prev];
      const newPos = (updated[index] || 0) + (direction === "right" ? 1 : -1);
      updated[index] = Math.max(0, newPos);
      return updated;
    });
  };

  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        <WelcomeText>Welcome Back, Enid!</WelcomeText>

        {/* ===== OFFERS CAROUSEL (one banner at a time) ===== */}
        <OfferCarouselWrapper>
          <OfferTrack
            style={{
              transform: `translateX(-${activeOfferIndex * 100}%)`,
            }}
          >
            {offersWithImages.map((offer) => (
              <PromoBanner key={offer.id}>
  <BannerImage src={offer.image} alt={offer.title} />

  <OfferTextContainer>
    <OfferTitle>{offer.title}</OfferTitle>
    <OfferDiscount>{offer.discountText}</OfferDiscount>
    <OfferServices>{offer.servicesText}</OfferServices>
  </OfferTextContainer>

  <SalonNameText>
    {salons.find((s) => s.id === offer.salonId)?.name}
  </SalonNameText>

  <BookNowButton>Book Now</BookNowButton>
</PromoBanner>

            ))}
        
          </OfferTrack>
        </OfferCarouselWrapper>

        <DotsWrapper>
          {offersWithImages.map((offer, index) => (
            <Dot
              key={offer.id}
              active={index === activeOfferIndex}
              onClick={() => setActiveOfferIndex(index)}
            />
          ))}
        </DotsWrapper>

        {["Trending Now", "Near You", "For Her", "For Him"].map((category, index) => {
          const start = (scrollPositions[index] || 0) * CARDS_PER_PAGE;
          const visibleSalons = salons.slice(start, start + CARDS_PER_PAGE);
          const hasMore = start + CARDS_PER_PAGE < salons.length;
          const canScrollBack = start > 0;

          return (
            <div key={category}>
              {/* ✅ Only the title has white background */}
              <CategoryHeader>
                <SectionTitle>{category}</SectionTitle>
              </CategoryHeader>

              {/* ✅ Cards and arrows remain below */}
              <ScrollWrapper>
                {canScrollBack && (
                  <ScrollButton side="left" onClick={() => handleScroll(index, "left")}>
                    <ArrowIcon direction="left" />
                  </ScrollButton>
                )}

                <HorizontalScroll ref={(el) => { scrollRefs.current[index] = el; }}>
                  {visibleSalons.map((salon) => (
                    <SalonCard
                      key={`${category}-${salon.id}`}
                      id={salon.id}
                      image={salon.image}
                      name={salon.name}
                      distance={salon.distance}
                      location={salon.location}
                      rating={salon.rating}
                      reviews={salon.reviews}
                      onClick={() => navigate(`/business/${salon.id}`, { state: salon })}
                    />
                  ))}
                </HorizontalScroll>

                {hasMore && (
                  <ScrollButton side="right" onClick={() => handleScroll(index, "right")}>
                    <ArrowIcon direction="right" />
                  </ScrollButton>
                )}
              </ScrollWrapper>
            </div>
          );
        })}
      </ContentWrapper>
    </PageWrapper>
  );
};

export default HomePage;

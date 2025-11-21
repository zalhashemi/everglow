import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SalonCard from "../../components/common/SalonCard";
import TabBar from "../../components/common/TabBar";
import PromoBanner from "../../components/common/PromoBanner";
import errorLoading from "../../images/errorLoading.png"; 
import promotionHeader from "../../images/promotionHeader.png";

/* ============================================================
   Styled Components
============================================================ */
const PageWrapper = styled.div`
  background-color: #f2dcdc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 20px 3%;
  box-sizing: border-box;
`;

const WelcomeText = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #4a5074;
  margin: 40px 0 30px;
`;

/* ===== Offers Carousel ===== */
const OfferCarouselWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
`;

const OfferTrack = styled.div`
  display: flex;
  width: 100%;
  height: 220px;
  transition: transform 0.5s ease;
`;

const DotsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${(p) => (p.active ? "#0b1c36" : "#d3d3d3")};
  cursor: pointer;
`;

/* ===== Salon Category Styling ===== */
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
  color: #4a5074;
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

/* ============================================================
   Component
============================================================ */

const CATEGORY_NAMES = ["Trending Now", "Near You", "For Her", "For Him"];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [salons, setSalons] = useState<any[]>([]);
  const [loadingSalons, setLoadingSalons] = useState(true);

  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollPositions, setScrollPositions] = useState<number[]>(
    () => Array(CATEGORY_NAMES.length).fill(0)
  );

  const CARDS_PER_PAGE = 5;
  const CARD_WIDTH = 310 + 18;

  /* ============================================================
     Fetch salons
  ============================================================ */
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/public/businesses");
        const data = await res.json();
        setSalons(data);
      } catch (err) {
        console.error("Error fetching salons:", err);
      } finally {
        setLoadingSalons(false);
      }
    };

    fetchSalons();
  }, []);

  /* ============================================================
     Fetch offers
  ============================================================ */
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/public/offers");
        const data = await res.json();
        setOffers(data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchOffers();
  }, []);

  /* ============================================================
     Auto-slide carousel
  ============================================================ */
  useEffect(() => {
    if (offers.length === 0) return;

    const interval = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % offers.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [offers.length]);

  /* ============================================================
     Scroll handling
  ============================================================ */
  const handleScroll = (index: number, direction: "left" | "right") => {
    const container = scrollRefs.current[index];
    if (!container) return;

    const delta =
      direction === "right"
        ? CARDS_PER_PAGE * CARD_WIDTH
        : -(CARDS_PER_PAGE * CARD_WIDTH);

    container.scrollBy({ left: delta, behavior: "smooth" });

    setScrollPositions((prev) => {
      const updated = [...prev];
      const nextPage =
        direction === "right"
          ? updated[index] + 1
          : Math.max(0, updated[index] - 1);
      updated[index] = nextPage;
      return updated;
    });
  };

  /* ============================================================
     Loading Screen
  ============================================================ */
  if (loadingSalons) {
    return (
      <PageWrapper>
        <TabBar type="customer" />
        <ContentWrapper>
          <WelcomeText>Loading salons…</WelcomeText>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  /* ============================================================
     Page UI
  ============================================================ */
  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        <WelcomeText>Welcome Back!</WelcomeText>

        {/* ====== OFFERS CAROUSEL ====== */}
        {!loadingOffers && offers.length > 0 && (
          <>
            <OfferCarouselWrapper>
              <OfferTrack
                style={{
                  transform: `translateX(-${activeOfferIndex * 100}%)`,
                }}
              >
                {offers.map((offer) => (
                  <PromoBanner
                    key={offer._id}
                    image={
                      offer.business?.imageUrl
                        ? `http://localhost:5000${offer.business.imageUrl}`
                        : errorLoading
                    }
                    title={offer.title}
                    salonName={offer.business?.businessName || ""}
                    onBookNow={() =>
                      navigate(`/business/${offer.business._id}`)
                    }
                  />
                ))}
              </OfferTrack>
            </OfferCarouselWrapper>

            <DotsWrapper>
              {offers.map((_, index) => (
                <Dot
                  key={index}
                  active={index === activeOfferIndex}
                  onClick={() => setActiveOfferIndex(index)}
                />
              ))}
            </DotsWrapper>
          </>
        )}

        {/* ===== SALON CATEGORIES ===== */}
        {CATEGORY_NAMES.map((category, index) => {
          const pageIndex = scrollPositions[index];
          const start = pageIndex * CARDS_PER_PAGE;
          const visibleSalons = salons.slice(start, start + CARDS_PER_PAGE);
          const hasMore = start + CARDS_PER_PAGE < salons.length;
          const canScrollBack = start > 0;

          return (
            <div key={category}>
              <CategoryHeader>
                <SectionTitle>{category}</SectionTitle>
              </CategoryHeader>

              <ScrollWrapper>
                {canScrollBack && (
                  <ScrollButton
                    side="left"
                    onClick={() => handleScroll(index, "left")}
                  >
                    <ArrowIcon direction="left" />
                  </ScrollButton>
                )}

                <HorizontalScroll
                  ref={(el) => {
                    scrollRefs.current[index] = el;
                  }}
                >
                  {visibleSalons.map((salon: any) => (
                    <SalonCard
  key={`${category}-${salon._id}`}
  id={salon._id}
  image={
    salon.imageUrl
      ? `http://localhost:5000${salon.imageUrl}`
      : errorLoading
  }
  name={salon.businessName}
  distance="—"
  location={`${salon.address}, ${salon.city}`}
  rating={salon.averageRating}     // ⭐ NOW FROM BACKEND
  reviews={salon.reviewCount}      // ⭐ NOW FROM BACKEND
  onClick={() => navigate(`/business/${salon._id}`)}
/>

                  ))}
                </HorizontalScroll>

                {hasMore && (
                  <ScrollButton
                    side="right"
                    onClick={() => handleScroll(index, "right")}
                  >
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

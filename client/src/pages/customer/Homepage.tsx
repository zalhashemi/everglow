// src/pages/customer/Homepage.tsx
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SalonCard from "../../components/common/SalonCard";
import TabBar from "../../components/common/TabBar";
import PromoBanner from "../../components/common/PromoBanner";
import errorLoading from "../../images/errorLoading.png";
import Footer from "../../components/common/Footer";


/* ============================================================
   Styled Components
============================================================ */
const PageWrapper = styled.div`
  background-color: #FAF6EA;
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

// Order matters: Trending first, then Highest Rated, then For Her / For Him
const CATEGORIES = [
  { title: "Trending Now", key: "trending" as const },
  { title: "Highest Rated", key: "highestRated" as const },
  { title: "For Her", key: "forHer" as const },
  { title: "For Him", key: "forHis" as const },
];

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const CARD_WIDTH = 310 + 18; // card + gap
const SCROLL_CARDS = 4;
const SCROLL_AMOUNT = CARD_WIDTH * SCROLL_CARDS;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // All salons (used for For Her / For Him – same as current behavior)
  const [allSalons, setAllSalons] = useState<any[]>([]);
  // New datasets
  const [trendingSalons, setTrendingSalons] = useState<any[]>([]);
  const [highestRatedSalons, setHighestRatedSalons] = useState<any[]>([]);
  const [loadingSalons, setLoadingSalons] = useState(true);

  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scrollInfo, setScrollInfo] = useState(
    CATEGORIES.map(() => ({ atStart: true, atEnd: false }))
  );

  /* ============================================================
     Fetch salons (all + trending + highest rated)
  ============================================================ */
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const [allRes, trendingRes, highestRes] = await Promise.all([
          fetch("http://localhost:5000/api/public/businesses"),
          fetch("http://localhost:5000/api/public/businesses/trending"),
          fetch("http://localhost:5000/api/public/businesses/highest-rated"),
        ]);

        const [allData, trendingData, highestData] = await Promise.all([
          allRes.json(),
          trendingRes.json(),
          highestRes.json(),
        ]);

        setAllSalons(allData || []);
        setTrendingSalons(trendingData || []);
        setHighestRatedSalons(highestData || []);
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
     Scroll handling (max 4 cards)
  ============================================================ */
  const handleScroll = (index: number, direction: "left" | "right") => {
    const container = scrollRefs.current[index];
    if (!container) return;

    const delta = direction === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT;

    container.scrollBy({ left: delta, behavior: "smooth" });

    setTimeout(() => {
      const atStart = container.scrollLeft <= 5;
      const atEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 5;

      setScrollInfo((prev) => {
        const arr = [...prev];
        arr[index] = { atStart, atEnd };
        return arr;
      });
    }, 350);
  };

  /* ============================================================
     Attach scroll listeners (same behavior as before)
  ============================================================ */
  useEffect(() => {
    const elements = scrollRefs.current;

    const listeners: Array<() => void> = [];

    elements.forEach((el, index) => {
      if (!el) return;

      const onScroll = () => {
        const atStart = el.scrollLeft <= 5;
        const atEnd =
          el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

        setScrollInfo((prev) => {
          const arr = [...prev];
          arr[index] = { atStart, atEnd };
          return arr;
        });
      };

      el.addEventListener("scroll", onScroll);
      listeners.push(() => el.removeEventListener("scroll", onScroll));
    });

    return () => {
      listeners.forEach((cleanup) => cleanup());
    };
  }, [allSalons, trendingSalons, highestRatedSalons]);

  /* ============================================================
     Helper: which salons to show for each category
  ============================================================ */
  const getSalonsForCategory = (key: CategoryKey) => {
    switch (key) {
      case "trending":
        return trendingSalons;
      case "highestRated":
        return highestRatedSalons;
      case "forHer":
      case "forHis":
      default:
        // For now: same behavior as before = show all salons
        return allSalons;
    }
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
        {CATEGORIES.map((category, index) => {
          const salonsForCategory = getSalonsForCategory(category.key);

          return (
            <div key={category.title}>
              <CategoryHeader>
                <SectionTitle>{category.title}</SectionTitle>
              </CategoryHeader>

              <ScrollWrapper>
                {/* LEFT ARROW (only show if not at start) */}
                {!scrollInfo[index].atStart && (
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
                  {salonsForCategory.slice(0, 13).map((salon: any) => (

                    <SalonCard
                      key={`${category.title}-${salon._id}`}
                      id={salon._id}
                      image={
                        salon.imageUrl
                          ? `http://localhost:5000${salon.imageUrl}`
                          : errorLoading
                      }
                      name={salon.businessName}
                      distance="—"
                      location={`${salon.address}, ${salon.city}`}
                      rating={salon.averageRating}
                      reviews={salon.reviewCount}
                      onClick={() => navigate(`/business/${salon._id}`)}
                    />
                  ))}
                </HorizontalScroll>

                {/* RIGHT ARROW (only show if not at end) */}
                {!scrollInfo[index].atEnd && (
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
      <Footer />

    </PageWrapper>
  );
};



export default HomePage;

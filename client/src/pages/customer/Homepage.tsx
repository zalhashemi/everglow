import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SalonCard from "../../components/common/SalonCard";
import TabBar from "../../components/common/TabBar";
import PromoBanner from "../../components/common/PromoBanner";
import errorLoading from "../../images/errorLoading.png";
import Footer from "../../components/common/Footer";
import { API_BASE } from "../../utils/config";


//styled components
const PageWrapper = styled.div`
  background-color: #faf6ea;
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

  @media (max-width: 768px) {
    padding: 16px 4%;
  }

  @media (max-width: 480px) {
    padding: 12px 3%;
  }
`;

const WelcomeText = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #4a5074;
  margin: 40px 0 30px;

  @media (max-width: 1024px) {
    font-size: 40px;
    margin: 32px 0 24px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
    margin: 24px 0 20px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin: 20px 0 16px;
  }
`;

const OfferCarouselWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const OfferTrack = styled.div`
  display: flex;
  width: 100%;
  height: 220px;
  transition: transform 0.5s ease;

  @media (max-width: 1024px) {
    height: 200px;
  }

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

const DotsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    gap: 6px;
    margin-top: 8px;
    margin-bottom: 16px;
  }
`;

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${(p) => (p.active ? "#0b1c36" : "#d3d3d3")};
  cursor: pointer;

  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
  }
`;

const CategoryHeader = styled.div`
  background-color: #fff;
  display: inline-block;
  padding: 8px 18px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;

  @media (max-width: 768px) {
    padding: 6px 14px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 5px 12px;
    margin-bottom: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #4a5074;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ScrollWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    margin-bottom: 32px;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  width: 100%;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 8px;

    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 0 4px 8px 4px;
  }

  /* Make cards responsive within scroll container */
  & > * {
    @media (max-width: 768px) {
      min-width: 280px;
      width: 280px;
    }

    @media (max-width: 480px) {
      min-width: calc(100vw - 40px);
      width: calc(100vw - 40px);
      max-width: 350px;
    }
  }
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

  @media (max-width: 1024px) {
    width: 40px;
    height: 40px;
    ${(p) => (p.side === "left" ? "left: -20px;" : "right: -20px;")}
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    ${(p) => (p.side === "left" ? "left: -18px;" : "right: -18px;")}
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    ${(p) => (p.side === "left" ? "left: -16px;" : "right: -16px;")}
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
    className="arrow-icon"
  >
    <path d="M9 18l6-6-6-6" />
    <style>{`
      @media (max-width: 768px) {
        .arrow-icon {
          width: 18px;
          height: 18px;
        }
      }
      @media (max-width: 480px) {
        .arrow-icon {
          width: 16px;
          height: 16px;
        }
      }
    `}</style>
  </svg>
);

//main component

const CATEGORIES = [
  { title: "Trending Now", key: "trending" as const },
  { title: "Highest Rated", key: "highestRated" as const },
  { title: "For Her", key: "forHer" as const },
  { title: "For Him", key: "forHis" as const },
];

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const CARD_WIDTH = 310 + 18; 
const SCROLL_CARDS = 4;
const SCROLL_AMOUNT = CARD_WIDTH * SCROLL_CARDS;

type Salon = {
  _id: string;
  businessName: string;
  address: string;
  city: string;
  imageUrl?: string | null;
  averageRating?: number;
  reviewCount?: number;
  genderTag?: string; 
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [allSalons, setAllSalons] = useState<Salon[]>([]);
  const [trendingSalons, setTrendingSalons] = useState<Salon[]>([]);
  const [highestRatedSalons, setHighestRatedSalons] = useState<Salon[]>([]);
  const [loadingSalons, setLoadingSalons] = useState(true);

  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollInfo, setScrollInfo] = useState(
    CATEGORIES.map(() => ({ atStart: true, atEnd: false }))
  );

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/public/businesses`);
        if (!res.ok) {
          throw new Error(`Failed /api/public/businesses: ${res.status}`);
        }
        const data = await res.json();
        const list: Salon[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any).businesses)
          ? (data as any).businesses
          : [];

        setAllSalons(list);

        const highest = [...list].sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
        setHighestRatedSalons(highest);

        setTrendingSalons(list);
      } catch (err) {
        console.error("Error fetching salons:", err);
      } finally {
        setLoadingSalons(false);
      }
    };

    fetchSalons();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/public/offers`);
        if (!res.ok) {
          throw new Error(`Failed offers: ${res.status}`);
        }
        const data = await res.json();
        setOffers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (offers.length === 0) return;

    const interval = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % offers.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [offers.length]);

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
  }, [allSalons]);

  const getSalonsForCategory = (key: CategoryKey): Salon[] => {
    switch (key) {
      case "trending":
        return trendingSalons;
      case "highestRated":
        return highestRatedSalons;
      case "forHer":
        return allSalons.filter(
          (salon) => salon.genderTag?.toLowerCase() === "women"
        );
      case "forHis":
        return allSalons.filter(
          (salon) => salon.genderTag?.toLowerCase() === "men"
        );
      default:
        return allSalons;
    }
  };

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

  return (
    <PageWrapper>
      <TabBar type="customer" />

      <ContentWrapper>
        <WelcomeText>Welcome Back!</WelcomeText>

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
                        ? `${API_BASE}${offer.business.imageUrl}`
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

        {CATEGORIES.map((category, index) => {
          const salonsForCategory = getSalonsForCategory(category.key).slice(
            0,
            13
          );

          if (salonsForCategory.length === 0) {
            return null;
          }

          return (
            <div key={category.title}>
              <CategoryHeader>
                <SectionTitle>{category.title}</SectionTitle>
              </CategoryHeader>

              <ScrollWrapper>
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
                  {salonsForCategory.map((salon) => (
                    <SalonCard
                      key={`${category.title}-${salon._id}`}
                      id={salon._id}
                      image={
                        salon.imageUrl
                          ? `${API_BASE}${salon.imageUrl}`
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

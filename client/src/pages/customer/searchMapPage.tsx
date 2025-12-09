import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import L, { userIcon } from "../../leafletSetup";

import TabBar from "../../components/common/TabBar";
import api from "../../utils/api";

interface BusinessLocation {
  type: "Point";
  coordinates: [number, number];
}

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  address?: string;
  city: string;
  description?: string;
  imageUrl?: string | null;
  location?: BusinessLocation;
}

const PageWrapper = styled.div`
  background-color: #faf6ea;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px 3% 40px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px 4% 32px;
  }

  @media (max-width: 480px) {
    padding: 12px 5% 24px;
  }
`;

const Heading = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #4a5074;
  margin: 30px 0 16px;

  @media (max-width: 1024px) {
    font-size: 28px;
    margin: 24px 0 12px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    margin: 20px 0 10px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin: 16px 0 8px;
  }
`;

const Subheading = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 12px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 550px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #e5e5e5;

  @media (max-width: 1100px) {
    height: 450px;
    order: 2;
  }

  @media (max-width: 768px) {
    height: 400px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    height: 350px;
    border-radius: 10px;
  }
`;

const ResultsPanel = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-height: 550px;
  overflow-y: auto;

  @media (max-width: 1100px) {
    order: 1;
    max-height: 400px;
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 12px;
    max-height: 350px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 10px;
    max-height: 300px;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
`;

const ResultsTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #4a5074;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const ResultsCount = styled.span`
  font-size: 13px;
  color: #777;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const ResultCard = styled.button<{ selected?: boolean }>`
  width: 100%;
  text-align: left;
  border: none;
  background-color: ${(p) => (p.selected ? "#f2f5ff" : "#ffffff")};
  border-radius: 10px;
  padding: 12px 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    background-color: #f7f7f7;
  }

  @media (max-width: 768px) {
    padding: 10px 8px;
    margin-bottom: 8px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 8px 6px;
    margin-bottom: 6px;
  }
`;

const ResultName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #0b1c36;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 3px;
  }
`;

const ResultMeta = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 3px;
  }
`;

const ResultDescription = styled.div`
  font-size: 12px;
  color: #888;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Placeholder = styled.div`
  font-size: 14px;
  color: #777;
  margin-top: 8px;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #777;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: #b3261e;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const DEFAULT_CENTER = {
  lat: 26.2285,
  lng: 50.586,
  zoom: 11,
};

const hasValidCoords = (
  b: Business
): b is Business & { location: BusinessLocation } => {
  const coords = b.location?.coordinates;
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number" &&
    !Number.isNaN(coords[0]) &&
    !Number.isNaN(coords[1])
  );
};

const SearchMapPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialQueryFromUrl = params.get("query") || "";

  const [searchTerm, setSearchTerm] = useState(initialQueryFromUrl);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mapCenter, setMapCenter] = useState({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    zoom: DEFAULT_CENTER.zoom,
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null
  );

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const businessLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [mapCenter.lat, mapCenter.lng],
        mapCenter.zoom
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      businessLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setMapCenter({ lat, lng, zoom: 13 });
      },
      () => {
        setUserLocation(null);
        setMapCenter(DEFAULT_CENTER);
      }
    );
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null); 
        const res = await api.get<Business[]>("/business");
        setBusinesses(res.data || []);
      } catch (err) {
        console.error("Error loading salons:", err);
        setBusinesses([]);
        setError("Couldn't load salons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleSearchSubmit = (value: string) => setSearchTerm(value);

  const businessesWithCoords = useMemo(
    () => businesses.filter(hasValidCoords),
    [businesses]
  );

  const filteredBusinesses = useMemo(() => {
    const base = businessesWithCoords;
    if (!searchTerm) return base;
    const term = searchTerm.toLowerCase();
    return base.filter((b) => {
      const name = b.businessName?.toLowerCase() || "";
      const city = b.city?.toLowerCase() || "";
      const type = b.businessType?.toLowerCase() || "";
      return (
        name.includes(term) || city.includes(term) || type.includes(term)
      );
    });
  }, [businessesWithCoords, searchTerm]);

  useEffect(() => {
    if (mapRef.current)
      mapRef.current.setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);
  }, [mapCenter]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      return;
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      })
        .addTo(mapRef.current)
        .bindPopup("You are here");
    } else {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current || !businessLayerRef.current) return;

    businessLayerRef.current.clearLayers();

    filteredBusinesses.forEach((b) => {
      if (!b.location) return;
      const [lng, lat] = b.location.coordinates;

      const popupHtml = `
        <div style="max-width:220px;">
          <strong>${b.businessName}</strong><br/>
          <span style="font-size:12px;color:#666">${b.businessType}</span><br/>
          <span style="font-size:12px;color:#666">${b.address ?? ""} ${
        b.city
      }</span><br/>
          <button 
            class="popup-view-btn"
            style="
              margin-top:8px;
              background:#4a5074;
              color:white;
              border:none;
              padding:6px 10px;
              border-radius:6px;
              font-size:12px;
              cursor:pointer;
            "
          >
            View Salon
          </button>
        </div>
      `;

      const marker = L.marker([lat, lng]).addTo(businessLayerRef.current!);

      marker.bindPopup(popupHtml);

      marker.on("popupopen", (e: any) => {
        const container: HTMLElement | null = e.popup?.getElement?.() ?? null;
        if (!container) return;
        const btn = container.querySelector<HTMLButtonElement>(
          ".popup-view-btn"
        );
        if (btn) {
          btn.onclick = () => navigate(`/business/${b._id}`);
        }
      });

      marker.on("click", () => {
        setSelectedBusinessId(b._id);
      });
    });
  }, [filteredBusinesses, navigate]);

  return (
    <PageWrapper>
      <TabBar
        type="customer"
        initialSearchValue={searchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      <ContentWrapper>
        <Heading>Search Salons &amp; Barbers</Heading>
        <Subheading>
          Explore salons on the map or search by name/city using the bar above.
        </Subheading>

        <Layout>
          <MapWrapper>
            <div
              ref={mapContainerRef}
              style={{ width: "100%", height: "100%" }}
            />
          </MapWrapper>

          <ResultsPanel>
            <ResultsHeader>
              <ResultsTitle>Results</ResultsTitle>

              <div
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px",
                  flexWrap: "wrap"
                }}
              >
                {!error && (
                  <ResultsCount>
                    {filteredBusinesses.length} salon
                    {filteredBusinesses.length === 1 ? "" : "s"} found
                  </ResultsCount>
                )}

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "12px",
                      color: "#b3261e",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </ResultsHeader>

            {loading && <LoadingText>Loading salons…</LoadingText>}
            {error && <ErrorText>{error}</ErrorText>}

            {!loading && !error && filteredBusinesses.length === 0 && (
              <Placeholder>No salons match this search.</Placeholder>
            )}

            {!loading &&
              !error &&
              filteredBusinesses.map((b) => {
                if (!b.location) return null;
                const [lng, lat] = b.location.coordinates;

                return (
                  <ResultCard
                    key={b._id}
                    selected={selectedBusinessId === b._id}
                    onClick={() => {
                      setSelectedBusinessId(b._id);
                      setMapCenter({ lat, lng, zoom: 13 });
                    }}
                  >
                    <ResultName>{b.businessName}</ResultName>
                    <ResultMeta>
                      {b.businessType} • {b.city}
                    </ResultMeta>
                    <ResultDescription>
                      {b.address ?? ""}{" "}
                      {b.description ? `• ${b.description}` : ""}
                    </ResultDescription>

                    <div
                      style={{ marginTop: "10px", textAlign: "right" }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/business/${b._id}`);
                        }}
                        style={{
                          backgroundColor: "#4a5074",
                          color: "white",
                          fontSize: "12px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        View Salon
                      </button>
                    </div>
                  </ResultCard>
                );
              })}
          </ResultsPanel>
        </Layout>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default SearchMapPage;

import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import L, { userIcon } from "../../leafletSetup";

import TabBar from "../../components/common/TabBar";
import api from "../../utils/api";

interface BusinessLocation {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
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
  background-color: #f2dcdc;
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
`;

const Heading = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #4a5074;
  margin: 30px 0 16px;
`;

const Subheading = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 550px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #e5e5e5;
`;

const ResultsPanel = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-height: 550px;
  overflow-y: auto;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ResultsTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #4a5074;
`;

const ResultsCount = styled.span`
  font-size: 13px;
  color: #777;
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
`;

const ResultName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #0b1c36;
  margin-bottom: 4px;
`;

const ResultMeta = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
`;

const ResultDescription = styled.div`
  font-size: 12px;
  color: #888;
`;

const Placeholder = styled.div`
  font-size: 14px;
  color: #777;
  margin-top: 8px;
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #777;
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: #b3261e;
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

  // Leaflet refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const businessLayerRef = useRef<L.LayerGroup | null>(null);

  // Init map once
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
        businessLayerRef.current = null;
        userMarkerRef.current = null;
      }
    };
  }, []);

  // Get user location (only for centering + "You are here")
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

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

  // Fetch ALL businesses once
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Business[]>("/business");
        setBusinesses(res.data || []);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError("Couldn't load salons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleSearchSubmit = (value: string) => {
    setSearchTerm(value);
  };

  // Only businesses that actually have coordinates
  const businessesWithCoords = useMemo(
    () => businesses.filter(hasValidCoords),
    [businesses]
  );

  // Apply text search on top of that
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

  // Update map center when mapCenter state changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);
  }, [mapCenter]);

  // Update user marker
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
      userMarkerRef.current = L.marker(
        [userLocation.lat, userLocation.lng],
        { icon: userIcon }
      ).addTo(mapRef.current);
      userMarkerRef.current.bindPopup("You are here");
    } else {
      userMarkerRef.current.setLatLng([
        userLocation.lat,
        userLocation.lng,
      ]);
    }
  }, [userLocation]);

  // Update business markers
  useEffect(() => {
    if (!mapRef.current || !businessLayerRef.current) return;

    businessLayerRef.current.clearLayers();

    filteredBusinesses.forEach((b) => {
      const [lng, lat] = b.location!.coordinates;
      const marker = L.marker([lat, lng]).addTo(businessLayerRef.current!);

      const popupHtml = `
        <div style="max-width:220px">
          <strong>${b.businessName}</strong><br/>
          <span style="font-size:12px;color:#666">${b.businessType}</span><br/>
          <span style="font-size:12px;color:#666">${b.address ?? ""} ${
        b.city ?? ""
      }</span>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on("click", () => {
        setSelectedBusinessId(b._id);
      });
    });
  }, [filteredBusinesses]);

  return (
    <PageWrapper>
      <TabBar
        type="customer"
        initialSearchValue={searchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      <ContentWrapper>
        <Heading>Search Salons & Barbers</Heading>
        <Subheading>
          Explore salons on the map, or search by name/city using the search bar
          above.
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

  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <ResultsCount>
      {filteredBusinesses.length} salon
      {filteredBusinesses.length === 1 ? "" : "s"} found
    </ResultsCount>

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
              <Placeholder>
                No salons found for this search. Try another name or city.
              </Placeholder>
            )}

            {!loading &&
              !error &&
              filteredBusinesses.map((b) => {
                const [lng, lat] = b.location!.coordinates;
                return (
                  <ResultCard
                    key={b._id}
                    selected={selectedBusinessId === b._id}
                    onClick={() => {
                      setSelectedBusinessId(b._id);
                      setMapCenter((prev) => ({
                        ...prev,
                        lat,
                        lng,
                        zoom: Math.max(prev.zoom, 13),
                      }));
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

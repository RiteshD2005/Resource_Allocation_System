/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Users, X } from "lucide-react";
import { getValidToken } from "@/utils/auth";
import { API_BASE_URL } from "@/lib/api";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  imageUrls: string[];
  active: boolean;
  type: "HALL" | "LAB" | "CLASSROOM" | "CABIN";
};

export default function HallsPage() {
  const router = useRouter();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState("HALL");
  const [searchCapacity, setSearchCapacity] = useState("");
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);

  useEffect(() => {
    const fetchHalls = async () => {
      const token = getValidToken();
      if (!token) {
        router.push("/login");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/halls`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/login");
            return;
          }
          throw new Error(`Failed to fetch halls (${res.status})`);
        }

        const data = await res.json();
        setHalls(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load halls. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, [router]);

  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      const matchesType = hall.type === selectedType;
      const matchesCapacity = !searchCapacity || hall.capacity >= Number(searchCapacity);
      return matchesType && matchesCapacity;
    });
  }, [halls, selectedType, searchCapacity]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Explore Halls
            </h1>
            <p className="max-w-2xl text-sm text-gray-500">
              Browse seminar halls, laboratories, classrooms, and cabins
              available for booking. View seating capacity, amenities,
              hall images, and availability details.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Type Buttons */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Halls", value: "HALL" },
                { label: "Labs", value: "LAB" },
                { label: "Classrooms", value: "CLASSROOM" },
                { label: "Cabins", value: "CABIN" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSelectedType(item.value)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    selectedType === item.value
                      ? "bg-indigo-600 text-white shadow-md"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Capacity Search */}
            <div className="relative w-full lg:w-[260px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="Search by capacity..."
                value={searchCapacity}
                onChange={(e) => setSearchCapacity(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2">Loading halls...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 py-20 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredHalls.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-gray-500">
              No halls found for selected filters.
            </p>
          </div>
        )}

        {/* Hall Cards Grid */}
        {!loading && !error && filteredHalls.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredHalls.map((hall) => (
              <div
                key={hall.id}
                onClick={() => setSelectedHall(hall)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={
                      hall.imageUrls?.[0] ||
                      "https://images.unsplash.com/photo-1497366754035-f200968a6e72"
                    }
                    alt={hall.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium shadow ${
                        hall.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {hall.active ? "Available" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {hall.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {hall.location}
                    </div>
                  </div>

                  {/* Capacity & Type */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Capacity
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-800">
                        <Users className="h-4 w-4" />
                        {hall.capacity} Seats
                      </div>
                    </div>
                    <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                      {hall.type}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {hall.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hall.amenities?.length > 3 && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                        +{hall.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedHall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Top Image */}
            <div className="relative">
              <img
                src={
                  selectedHall.imageUrls?.[0] ||
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72"
                }
                alt={selectedHall.name}
                className="h-72 w-full object-cover"
              />
              <button
                onClick={() => setSelectedHall(null)}
                className="absolute right-4 top-4 rounded-full bg-white p-2 shadow hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-5 p-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedHall.name}
                </h2>
                <p className="mt-2 flex items-center gap-1 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {selectedHall.location}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Capacity
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {selectedHall.capacity}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Type
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {selectedHall.type}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Status
                  </p>
                  <p
                    className={`mt-1 text-lg font-semibold ${
                      selectedHall.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {selectedHall.active ? "Available" : "Inactive"}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedHall.amenities?.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {selectedHall.imageUrls?.length > 1 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {selectedHall.imageUrls.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Hall ${idx}`}
                        className="h-32 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
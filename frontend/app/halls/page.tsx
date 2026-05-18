"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";
import { getValidToken } from "@/utils/auth";
import {
  Calendar,
  Clock,
  History,
  User,
  LogOut,
  ChevronDown,
  Eye,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Hall {
  id: number;
  name: string;
  capacity: number;
  location: string;
  imageUrls?: string[];
}

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || "User");
        } catch {
          setUserName("User");
        }
      } else {
        setUserName("User");
      }
    }
  }, []);

  // Fetch halls
  const fetchHalls = useCallback(async () => {
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
      if (!res.ok) throw new Error("Failed to fetch halls");
      const data = await res.json();
      setHalls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load available resources. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchHalls();
  }, [fetchHalls]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const displayedHalls = halls.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/home" className="text-xl font-bold text-indigo-600">
              Resource Booking System
            </Link>

            <div className="flex items-center gap-4">
              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/SendRequest"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Send Request
                </Link>
                <Link
                  href="/check-slot"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Check Slots
                </Link>
                <Link
                  href="/my-history"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  History
                </Link>
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
                  aria-label="User menu"
                >
                  <span className="text-sm font-medium">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Welcome to Resource Booking Portal
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Book seminar halls, manage requests, and track your history easily.
          </p>
          <div className="mt-8">
            <button
              onClick={() => router.push("/SendRequest")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Send Request",
              description: "Book a seminar hall by submitting a request.",
              icon: Calendar,
              path: "/SendRequest",
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              title: "Check Slots",
              description: "Check availability of halls on a specific date.",
              icon: Clock,
              path: "/check-slot",
              color: "bg-green-50 text-green-600",
            },
            {
              title: "Booking History",
              description: "View approved, pending, or declined requests.",
              icon: History,
              path: "/my-history",
              color: "bg-amber-50 text-amber-600",
            },
            {
              title: "Profile",
              description: "Manage your personal details and account settings.",
              icon: User,
              path: "/profile",
              color: "bg-purple-50 text-purple-600",
            },
          ].map((card) => (
            <div
              key={card.title}
              onClick={() => router.push(card.path)}
              className="cursor-pointer group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-lg ${card.color} mb-4`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About System */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">About Our System</h2>
          <p className="mt-4 text-gray-600 text-lg">
            This platform allows students and faculty to seamlessly book seminar
            halls and classrooms. It ensures efficient scheduling, avoids
            conflicts, and provides transparency in request approvals.
          </p>
        </div>
      </section>

      {/* Available Resources Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Available Resources
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-gray-700">{error}</p>
            <button
              onClick={fetchHalls}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {/* Halls Grid (2 halls + View More) */}
        {!loading && !error && (
          <>
            {halls.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">No halls available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* First 2 halls */}
                {displayedHalls.map((hall) => (
                  <div
                    key={hall.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
                  >
                    <div className="relative w-full h-40">
                      <Image
                        src={
                          hall.imageUrls?.[0] ||
                          "https://placehold.co/600x400?text=No+Image"
                        }
                        alt={hall.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={!hall.imageUrls?.[0]?.startsWith("/")}
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {hall.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Capacity: {hall.capacity}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Location: {hall.location}
                      </p>
                      <button
                        onClick={() => router.push("/check-slot")}
                        className="mt-4 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition self-start"
                      >
                        Check Availability
                      </button>
                    </div>
                  </div>
                ))}

                {/* View More Card */}
                <div
                  onClick={() => router.push("/halls")}
                  className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 text-center"
                >
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                    <Eye className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    View More
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Explore all available seminar halls and classrooms.
                  </p>
                  <span className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg">
                    Browse All Halls →
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Resource Booking System — VIT Pune
            </p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-gray-500 hover:text-indigo-600">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-indigo-600">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
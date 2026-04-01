# Stayvio
What is Stayvio?

Stayvio is a full-stack vacation rental web application built with Node.js, Express, MongoDB, and EJS. The idea is similar to Airbnb — a platform where property owners (hosts) can list their spaces and travelers (guests) can discover, book, and pay for stays. The name "Stayvio" blends "stay" with a modern vibe, positioning it as a travel-focused rental marketplace.

The Core Idea

You wanted to build something real — not just a CRUD app, but a platform with actual business logic. That means a host lists a property, a guest finds it, requests a booking, the host approves it, and then the guest pays. Every step has validation, status tracking, and role-based access. It's a complete booking lifecycle.

Tech Stack

Node.js + Express for the backend server and routing
MongoDB + Mongoose for the database with well-defined schemas and relationships
EJS + EJS-Mate for server-side templating with layouts
Passport.js (passport-local-mongoose) for authentication — signup, login, sessions
Cloudinary for image storage and transformation (listing photos)
Mapbox for geocoding and interactive maps on listing pages
Razorpay for real payment integration (not fake/mock — actual payment gateway)
Joi for server-side input validation
Multer for handling file/image uploads
connect-flash for flash messages (success/error feedback)
dotenv for environment variable management
Features Built

Listings:

Full CRUD — create, read, update, delete listings
Each listing has title, description, price, location, country, images, amenities, property type, max guests, bedrooms, bathrooms, house rules, cancellation policy, cleaning fee, service fee, check-in instructions, accessibility notes
10 categories: Trending, Hill Stations, Beaches, Heritage, Backwaters, Forests, Desert, Pilgrimage, Farms, Houseboats
10 property types: Villa, Homestay, Cabin, Beach House, Heritage Haveli, Apartment, Farm Stay, Treehouse, Houseboat, Tent/Glamping
Search by title, description, location, or country (case-insensitive regex)
Filter by category and property type
Sort by price (low-high, high-low) or newest first
Mapbox geocoding converts location text to coordinates and renders an interactive map on each listing page
Cloudinary image transformation for optimized thumbnails
Booking System (multi-step lifecycle):

Guest selects check-in/check-out dates and number of guests
Validation: no past dates, checkout must be after checkin, guest count within listing's max
Overlap detection — checks if dates conflict with existing confirmed bookings
Auto-calculates number of nights and total price
Booking goes through statuses: pending_approval → pending_payment → confirmed (or cancelled)
Host must approve the booking first before guest can pay
Host can also reject a booking
Payment (Razorpay integration):

After host approval, guest initiates payment
Backend creates a Razorpay order with the booking amount
Frontend handles the Razorpay checkout popup
After payment, backend verifies the signature using HMAC SHA-256 (crypto module) to confirm authenticity
On success: booking status → confirmed, payment status → paid
On failure: booking cancelled, payment marked failed
Payment records stored separately in Payment model with Razorpay order ID, payment ID, and signature
Reviews:

Guests can leave a rating (1-5) and comment on listings
Reviews are linked to both the listing and the author (user)
Listing owner or review author can delete reviews
Reviews are populated with author info when displaying
Wishlist:

Logged-in users can save listings to a wishlist
Heart icon on listing cards shows filled/unfilled state based on wishlist
Add/remove from wishlist with AJAX-friendly redirect
Dedicated wishlist page showing all saved listings
User Roles & Auth:

4 roles: guest, host, both, admin
Passport.js handles local strategy auth with sessions
Role-based access — only hosts/both can create listings, only admins can access admin panel
Profile page shows upcoming journeys (confirmed/pending bookings with future check-in) and past journeys (completed stays)
Host Dashboard:

Hosts see all their listings
See all bookings for their listings with guest info
Pending approvals section — approve or reject incoming booking requests
Total earnings calculated from confirmed bookings
All reviews across their listings in one place
Admin Panel:

Full view of all users, listings, and bookings
Total revenue across all confirmed bookings
Total host count
Manage everything from one place
Architecture & Design Patterns

MVC pattern — Models in /models, Views in /views, Controllers in /controllers, Routes in /routes
RESTful routing conventions
Centralized error handling with custom ExpressError class and wrapAsync utility for async error catching
Middleware file for reusable auth checks (isLoggedIn, isOwner, isAdmin, etc.)
Schema validation with Joi before data hits the database
Mongoose post middleware for cascade deletes (deleting a listing auto-deletes its reviews)
Session-based auth with httpOnly cookies, 7-day expiry

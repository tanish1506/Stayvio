# Stayvio — Complete Project Documentation

> AI-powered budget travel planning platform for students and solo travelers in India.

---

## 🌐 Live URL
**https://stayvio.onrender.com**

---

## 🎯 Project Vision

Stayvio is a full-stack web application that combines:
- A **property listing & booking platform** (like Airbnb)
- An **AI-powered trip planner** (the main USP) using Google Gemini
- Budget-focused features for students and solo travelers in India

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Templating | EJS + ejs-mate |
| Authentication | Passport.js (Local Strategy) |
| Image Upload | Cloudinary + Multer |
| Maps | Mapbox |
| Payments | Razorpay |
| AI | Google Gemini API (`@google/generative-ai`) |
| Weather | Open-Meteo API (free, no key) |
| PDF Export | PDFKit |
| Session Store | connect-mongo |
| Deployment | Render (free tier) |
| CSS Framework | Bootstrap 5 |
| Fonts | Poppins (Google Fonts) |
| Icons | Font Awesome 7 |

---

## 🎨 Design System

| Variable | Value |
|---|---|
| Background | `#F5EFE6` (warm beige) |
| Text | `#2C2416` (dark brown) |
| Navbar/Primary | `#708238` (olive green) |
| CTA/Buttons | `#E07B39` (orange) |
| Muted | `#8a7968` |
| Font | Poppins |
| Border Radius | 12px |

---

## 📁 Project Structure

```
Stayvio/
├── app.js                    # Main Express app, middleware, routes
├── cloudConfig.js            # Cloudinary configuration
├── middlewares.js            # All custom middleware functions
├── schema.js                 # Joi validation schemas
├── package.json              # Dependencies
├── .env                      # Environment variables (not in git)
│
├── models/
│   ├── user.js               # User model
│   ├── listing.js            # Listing model
│   ├── booking.js            # Booking model
│   ├── payment.js            # Payment model
│   ├── review.js             # Review model
│   └── tripPlan.js           # TripPlan model
│
├── controllers/
│   ├── user.js               # Auth, profile
│   ├── listings.js           # CRUD listings
│   ├── booking.js            # Booking logic
│   ├── payment.js            # Razorpay integration
│   ├── reviews.js            # Reviews
│   ├── wishlist.js           # Wishlist
│   ├── dashboard.js          # Host + Guest dashboard
│   ├── admin.js              # Admin panel
│   └── tripPlanner.js        # AI Trip Planner (all functions)
│
├── routes/
│   ├── user.js               # Auth routes
│   ├── listing.js            # Listing routes
│   ├── booking.js            # Booking routes
│   ├── payment.js            # Payment routes
│   ├── review.js             # Review routes
│   ├── wishlist.js           # Wishlist routes
│   ├── dashboard.js          # Dashboard routes
│   ├── admin.js              # Admin routes
│   └── tripPlanner.js        # Trip Planner routes
│
├── utils/
│   ├── ExpressError.js       # Custom error class
│   ├── wrapAsync.js          # Async error wrapper
│   ├── geminiClient.js       # Gemini AI functions
│   └── weatherClient.js      # Open-Meteo weather functions
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs   # Main layout (navbar + footer)
│   ├── includes/
│   │   ├── navbar.ejs        # Navbar with auth modal
│   │   ├── footer.ejs        # Footer
│   │   └── flash.ejs         # Flash messages
│   ├── listings/
│   │   ├── index.ejs         # Home page (listings grid)
│   │   ├── show.ejs          # Listing detail page
│   │   ├── new.ejs           # Create listing form
│   │   └── edit.ejs          # Edit listing form
│   ├── bookings/
│   │   ├── index.ejs         # My bookings list
│   │   └── show.ejs          # Booking detail
│   ├── users/
│   │   ├── dashboard.ejs     # Host + Guest dashboard
│   │   ├── profile.ejs       # User profile
│   │   ├── editProfile.ejs   # Edit profile form
│   │   └── admin.ejs         # Admin panel
│   ├── wishlist/
│   │   └── index.ejs         # Wishlist page
│   ├── tripPlanner/
│   │   ├── new.ejs           # Trip planner form
│   │   ├── show.ejs          # Trip plan detail page
│   │   └── share.ejs         # Public shared plan view
│   └── error.ejs             # Custom error page
│
└── public/
    ├── css/
    │   ├── style.css         # Main stylesheet + design system
    │   ├── dashboard.css     # Dashboard styles
    │   ├── admin.css         # Admin panel styles
    │   └── rating.css        # Star rating styles
    ├── js/
    │   ├── script.js         # Main JS (navbar, filters)
    │   ├── auth.js           # Auth modal JS
    │   ├── map.js            # Mapbox integration
    │   └── payment.js        # Razorpay frontend
    └── images/
        ├── logo-white.png    # Stayvio logo
        └── favicon.png       # Favicon
```

---

## 👤 User Roles

| Role | Permissions |
|---|---|
| `guest` | Browse, book, wishlist, trip planner |
| `host` | All guest permissions + create/manage listings, host dashboard |
| `both` | All permissions of guest + host |
| `admin` | Full platform access, admin dashboard |

---

## 🔐 Authentication System

- **Passport.js** with Local Strategy
- **Login/Signup Modal** — no separate page, modal popup on any page
- Role selection on signup (Travel & Book / List My Space)
- Session stored in **MongoDB** via `connect-mongo`
- Admin role set manually via MongoDB Atlas

---

## 🏠 Listings Feature

### What it does:
- Create, Edit, Delete listings
- Image upload via **Cloudinary**
- **Mapbox** map on listing detail page

### Listing Fields:
- Title, Description, Location, Country
- Price per night, Cleaning Fee, Service Fee
- Property Type (Villa, Homestay, Cabin, etc.)
- Category (Hill Stations, Beaches, Heritage, etc.)
- Amenities (WiFi, Pool, Kitchen, etc.)
- House Rules, Cancellation Policy
- Max Guests, Bedrooms, Bathrooms
- Availability toggle

### Home Page Features:
- Search by location, description, title
- Category filter sidebar
- Property type filter
- Sort by price / newest
- 50 India-focused seed listings

---

## 📅 Booking System

### Flow:
```
User selects dates → Availability check → Booking created (pending_payment) 
→ Razorpay payment → Payment verified → Booking confirmed
```

### Features:
- Date picker with min date validation
- Live price calculation (nights × price)
- Availability check (no overlapping bookings)
- Booking status: `pending_payment` → `confirmed` → `cancelled` / `completed`
- Cancel booking (only future bookings)
- My Bookings page

### Booking Model Fields:
- user, listing, checkIn, checkOut
- guests, nights, totalPrice
- status, paymentStatus
- payment (ref to Payment)

---

## 💳 Payment System (Razorpay)

### Security:
- **Server-side amount calculation** — client cannot tamper
- **HMAC SHA256 signature verification** — prevents fake payments
- Idempotency check — prevents duplicate processing

### Flow:
```
Create Booking → Create Razorpay Order (server) → 
Razorpay Checkout (frontend) → Verify Signature (server) → 
Update Booking to confirmed
```

### Payment Model Fields:
- booking, amount, currency
- razorpay_order_id, razorpay_payment_id, razorpay_signature
- status: `created` → `success` / `failed`

---

## ❤️ Wishlist Feature

- Add/Remove listings from wishlist (heart button on cards)
- Wishlist page with smart suggestions sidebar
- Wishlist destinations auto-populate Trip Planner form

---

## ⭐ Reviews Feature

- Add review with 1-5 star rating + comment
- Delete own review
- Average rating calculation displayed on listing
- Rating badge on listing cards

---

## 🤖 AI Trip Planner (Main USP)

### What it does:
User fills a form → Gemini AI generates a complete budget-focused trip plan

### Form Inputs:
- Destination (with wishlist suggestions)
- Total Budget (₹)
- Duration (days)
- Number of Travelers
- Interests (Adventure, Culture, Food, Relaxation)
- Source City (optional — for travel day)
- Transport Preference (Cheapest/Fastest/No Preference)
- Travel Dates (optional — for weather forecast)
- Plan Label (optional)

### AI Output (Gemini):
- Budget Breakdown (Travel/Stay/Food/Activities/Transport)
- Day-wise Itinerary (activities, food spots, local transport per day)
- Money Saving Tips
- Packing List

### Additional Features:
- **Suggested Listings** — Stayvio listings matching destination + budget
- **Weather Integration** — Open-Meteo API injects forecast into Gemini prompt
- **Save Plan** — draft → saved status
- **Regenerate** — change budget/duration/travelers, AI regenerates
- **Share Plan** — public shareable link (crypto token), revokable
- **PDF Export** — download full plan as PDF (PDFKit)
- **Delete Plan**

### TripPlan Model Fields:
- user, destination, sourceCity, transportPreference
- totalBudget, duration, travelers, interests
- travelDates, label
- itinerary (AI JSON), suggestedListings, packingList, weatherSummary
- shareToken, isPublic
- status (draft/saved)
- rating, feedbackNote, chatHistory

### Gemini Functions (`utils/geminiClient.js`):
- `generateItinerary(inputs, weatherSummary)` — main itinerary
- `generatePackingList(inputs)` — packing list
- `chatFollowUp(plan, message)` — AI chat (future)

### Weather Functions (`utils/weatherClient.js`):
- `geocode(destination)` — lat/lon from destination name
- `getForecast(lat, lon, startDate, endDate)` — daily forecast

---

## 📊 Dashboards

### Host Dashboard (`/dashboard` for hosts/both)
- Stats: Total Listings, Total Bookings, Total Earnings, Pending Payments
- My Listings (with edit/delete/availability toggle)
- Recent Bookings (with status badges)
- Reviews Received
- Pending Approvals

### Guest Dashboard (`/dashboard` for guests)
- My Bookings (upcoming + past)
- My Trip Plans

### Admin Dashboard (`/admin`)
- Platform stats (users, listings, bookings, revenue)
- Chart.js analytics (bookings by status, users by role, monthly revenue)
- Manage Users (view, delete with cleanup)
- Manage Listings (view, delete)
- Manage Bookings (view all)
- Unified search bar

---

## 🛡️ Middleware

| Middleware | Purpose |
|---|---|
| `isLoggedIn` | Blocks unauthenticated users |
| `saveRedirectUrl` | Saves URL before login redirect |
| `isOwner` | Checks listing ownership |
| `isHost` | Blocks non-host users |
| `isAdmin` | Blocks non-admin users |
| `isBookingOwner` | Checks booking ownership |
| `isTripPlanOwner` | Checks trip plan ownership |
| `validateListing` | Joi validation for listing form |
| `validateBooking` | Joi validation for booking form |
| `validateReview` | Joi validation for review form |
| `validateTripPlan` | Joi validation for trip planner form |

---

## 🌐 All Routes

### Auth
- `POST /signup` — Register
- `POST /login` — Login
- `GET /logout` — Logout
- `GET /profile` — View profile
- `GET /profile/edit` — Edit profile form
- `PUT /profile` — Update profile

### Listings
- `GET /listings` — Home page (all listings)
- `GET /listings/new` — New listing form
- `POST /listings` — Create listing
- `GET /listings/:id` — Listing detail
- `GET /listings/:id/edit` — Edit form
- `PUT /listings/:id` — Update listing
- `DELETE /listings/:id` — Delete listing
- `POST /listings/:id/toggle-availability` — Toggle availability

### Bookings
- `POST /listings/:id/bookings` — Create booking
- `GET /bookings` — My bookings
- `GET /bookings/:id` — Booking detail
- `DELETE /bookings/:id` — Cancel booking

### Payments
- `GET /bookings/:id/payment` — Payment page
- `POST /bookings/:id/payment/create` — Create Razorpay order
- `POST /payment/verify` — Verify payment

### Reviews
- `POST /listings/:id/reviews` — Add review
- `DELETE /listings/:id/reviews/:reviewId` — Delete review

### Wishlist
- `POST /wishlist/:id/toggle` — Add/Remove from wishlist
- `GET /wishlist` — Wishlist page

### Dashboard
- `GET /dashboard` — Dashboard (host or guest based on role)

### Admin
- `GET /admin` — Admin dashboard
- `DELETE /admin/users/:id` — Delete user

### Trip Planner
- `GET /trip-planner/new` — Trip planner form
- `POST /trip-planner` — Generate plan (AI)
- `GET /trip-planner/share/:token` — Public shared plan
- `GET /trip-planner/:id` — View plan
- `PATCH /trip-planner/:id/save` — Save plan
- `PATCH /trip-planner/:id/regenerate` — Regenerate plan
- `PATCH /trip-planner/:id/share` — Toggle share
- `GET /trip-planner/:id/export/pdf` — Download PDF
- `DELETE /trip-planner/:id` — Delete plan

---

## 🎨 UI Overview

### Navbar
- Olive background, white Stayvio logo
- Links: Home, Explore, Trip Planner (logged in only)
- Right: List Your Space button, Wishlist heart icon, Profile dropdown
- Profile dropdown: Profile, My Bookings, Dashboard, Admin Panel (if admin), Logout
- Login/Signup modal (no separate page)

### Home Page (`/listings`)
- Search bar (destination, guests)
- Left sidebar: Category filters, Property type, Sort
- Right: Listing cards grid
- Listing cards: image, title, location, price, property type badge, heart button

### Listing Show Page
- Hero image with thumbnail strip
- 2-column layout: left (details) + right (sticky booking form)
- Amenity badges, house rules, cancellation policy
- Mapbox map
- Reviews section with star ratings

### Trip Planner Form (`/trip-planner/new`)
- Gradient hero section with feature highlights
- 3 cards: Trip Details, Interests (emoji cards), Optional Details
- Interest selection with clickable emoji cards
- Transport preference toggle (shows when source city filled)
- Animated submit button with spinner

### Trip Plan Show Page (`/trip-planner/:id`)
- Gradient hero with destination, budget, duration info
- Save Plan / Saved badge button
- Regenerate button (inline form)
- Share Plan / Revoke + copy URL
- Budget Breakdown (5 cards in a row)
- Day-wise Itinerary (olive header cards per day)
- Money Saving Tips (numbered cards)
- Suggested Listings from Stayvio
- Packing List (checkbox grid)
- Download PDF button
- Delete Plan button

### Dashboard
- Host: Stats cards + Listings + Bookings + Reviews + Trip Plans
- Guest: My Bookings + Trip Plans
- Role-based conditional rendering

---

## 🚀 Deployment

### Platform: Render (Free Tier)
- **URL**: https://stayvio.onrender.com
- **Build Command**: `npm install`
- **Start Command**: `node app.js`
- **Note**: Free tier spins down after inactivity — first request may take 50+ seconds

### Environment Variables on Render:
- `NODE_ENV=production`
- `MONGO_URL` — MongoDB Atlas connection string
- `SECRET` — Session secret key
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_KEY` — Cloudinary API key
- `CLOUDINARY_SECRET` — Cloudinary API secret
- `MAPBOX_TOKEN` — Mapbox access token
- `GEMINI_API_KEY` — Google Gemini API key
- `RAZORPAY_KEY_ID` — Razorpay key ID
- `RAZORPAY_KEY_SECRET` — Razorpay key secret

### Session Storage:
- `connect-mongo` — sessions stored in MongoDB Atlas
- Survives server restarts on Render

---

## 📦 Key Dependencies

```json
{
  "@google/generative-ai": "AI trip planning",
  "@mapbox/mapbox-sdk": "Maps on listing pages",
  "cloudinary": "Image storage",
  "connect-flash": "Flash messages",
  "connect-mongo": "MongoDB session store",
  "dotenv": "Environment variables",
  "ejs": "Templating",
  "ejs-mate": "Layout support for EJS",
  "express": "Web framework",
  "express-session": "Session management",
  "joi": "Form validation",
  "method-override": "PUT/DELETE from HTML forms",
  "mongoose": "MongoDB ODM",
  "multer": "File upload handling",
  "multer-storage-cloudinary": "Cloudinary + Multer integration",
  "passport": "Authentication",
  "passport-local": "Username/password strategy",
  "passport-local-mongoose": "Mongoose + Passport integration",
  "pdfkit": "PDF generation",
  "razorpay": "Payment gateway"
}
```

---

## 🔮 Future Features (Post-Deployment)

### Complex Features (Planned):
- **AI Chat** — Chat with AI about your trip plan
- **Compare Plans** — Compare 2-3 plans side by side
- **Rating & Feedback** — Rate trip after returning

### Version 2.0:
- Google OAuth login
- Email notifications (Nodemailer)
- Host-Guest messaging
- Calendar view for bookings
- Multiple image upload
- Modify reservation
- Export admin data as CSV

---

## 📈 Resume Impact

| Stage | Rating |
|---|---|
| Before (basic CRUD) | 5/10 |
| After AI Planner + Deployment | 8/10 |
| After complex features | 9/10 |

**Key talking points:**
- Full-stack Node.js + MongoDB application
- Google Gemini AI integration for trip planning
- Razorpay payment gateway with HMAC signature verification
- JWT-less auth with Passport.js + MongoDB sessions
- Deployed on Render with production MongoDB Atlas
- PDF generation, public share links with crypto tokens
- Role-based access control (guest/host/admin)

---

*Last updated: AI Trip Planner complete + Deployed on Render*

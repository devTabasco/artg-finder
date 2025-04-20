# ARTG Finder - Australian Medicine Search

## Project Overview
ARTG Finder is an Australian medicine search and learning tool. This project is designed to help healthcare professionals and students easily find and learn about medicines used in Australia. The application is built upon data from the [Australian Register of Therapeutic Goods (ARTG)](https://www.tga.gov.au/products/australian-register-therapeutic-goods-artg), which is the official public database maintained by the Therapeutic Goods Administration (TGA).

### Data Source
- Based on the ARTG public database
- Regular updates to maintain accuracy
- Comprehensive medicine information from Australia's official therapeutic goods registry
- Compliance with TGA data usage guidelines

### Key Features
- **Medicine Search**: Real-time medicine search based on product names
- **Detailed Information**: Provides the following information for each medicine
  - Product Name
  - Active Ingredients
  - Indications
  - Warnings
  - Additional Product Information
  - Poison Schedule
  - Product Image
- **Essential Study List**: Curated list of medicines that need to be studied
- **Pagination**: Page-based display for efficient data exploration

## Tech Stack

### Frontend
- **HTML5**: Semantic markup for web structure
- **CSS3**: 
  - Responsive design (mobile-friendly)
  - Flexbox layout system
  - Media queries for various screen sizes
  - Modern UI/UX design
- **Vanilla JavaScript**: 
  - Dynamic data handling
  - Asynchronous API communication
  - DOM manipulation
  - Event handling

### Backend & Database
- **Supabase**:
  - PostgreSQL database for medicine data storage
  - Real-time data synchronization
  - Row Level Security (RLS)
  - RESTful API endpoints
  - **Storage**:
    - Medicine image storage and management
    - Automatic image optimization
    - Secure file uploads and downloads
    - CDN-powered image delivery
  - Authentication and authorization

### Security
- XSS prevention through HTML escaping
- Utilization of Supabase security features
- API key management through environment variables

### Performance Optimization
- Data loading optimization through pagination
- Image optimization (size and caching)
- Efficient DOM updates

### How to use
- visit : https://devTabasco.github.io/artg-finder

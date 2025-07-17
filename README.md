# InStalkgram - Instagram Story Viewer

A modern, responsive website for viewing Instagram stories anonymously. Built with HTML, CSS, JavaScript, Bootstrap, and other modern web technologies.

## Features

- **Anonymous Story Viewing**: View Instagram stories without revealing your identity
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes
- **Modern UI**: Clean, Instagram-inspired design with smooth animations
- **Fast Loading**: Optimized for quick loading times
- **Cross-Browser Compatible**: Works on all modern browsers

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with custom properties and animations
- **JavaScript (ES6+)**: Interactive functionality and API integration
- **Bootstrap 5**: Responsive grid system and components
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Typography (Inter font family)

## File Structure

```
instagram-story-viewer/
├── index.html              # Main homepage
├── blog.html              # Blog listing page
├── about.html             # About us page
├── contact.html           # Contact form page
├── privacy.html           # Privacy policy page
├── terms.html             # Terms and conditions page
├── assets/
│   ├── css/
│   │   ├── main.css       # Core styles and layout
│   │   ├── components.css # Component-specific styles
│   │   └── responsive.css # Responsive design styles
│   ├── js/
│   │   ├── main.js        # Core JavaScript functionality
│   │   ├── instagram-api.js # Instagram API integration
│   │   └── modal.js       # Modal and popup functionality
│   └── images/
│       ├── logo.png       # Site logo
│       ├── hero-bg.jpg    # Hero section background
│       ├── feature-*.jpg  # Feature section images
│       └── favicon.ico    # Site favicon
└── README.md              # This file
```

## Setup Instructions

1. **Clone or Download**: Get the project files
2. **Local Server**: Serve the files using a local web server
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Open Browser**: Navigate to `http://localhost:8000`

## Features Overview

### Homepage
- Hero section with search functionality
- Feature highlights with icons and descriptions
- Trending content section
- FAQ section
- Call-to-action sections

### Blog
- Article listing with categories
- Search functionality
- Responsive card layout
- Category filtering

### Contact
- Contact form with validation
- Contact information
- FAQ section
- Social media links

### About
- Company information
- Team details
- Mission and values
- Feature explanations

### Legal Pages
- Comprehensive privacy policy
- Terms and conditions
- GDPR compliance information

## Customization

### Colors
The website uses CSS custom properties for easy color customization:

```css
:root {
  --primary-color: #e91e63;
  --secondary-color: #9c27b0;
  --accent-color: #2196f3;
  /* ... more colors */
}
```

### Fonts
The website uses the Inter font family from Google Fonts. You can change it by updating the Google Fonts import and CSS font-family declarations.

### Layout
The responsive layout is built with Bootstrap 5 grid system and custom CSS. Modify the grid classes and CSS to adjust the layout.

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- Optimized images with proper sizing
- Minified CSS and JavaScript (in production)
- Lazy loading for images
- Efficient CSS animations
- Fast loading times

## Security

- No sensitive data stored in frontend
- HTTPS ready
- XSS protection
- Content Security Policy ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes. Please ensure compliance with Instagram's Terms of Service when using any Instagram-related functionality.

## Support

For support or questions, please contact us through the contact form on the website or email support@instalkgram.com.

## Disclaimer

This tool is for educational purposes only. Users are responsible for complying with Instagram's Terms of Service and applicable laws. The developers are not responsible for any misuse of this tool.


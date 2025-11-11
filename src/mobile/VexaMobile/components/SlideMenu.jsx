import React, { useState } from 'react';
import logoImage from './logo.png'; 
import { router } from 'expo-router';
// React-compatible inline SVG icons
const Icon = ({ name, size = 24, color = '#FFFFFF', style }) => {
  const iconComponents = {
    menu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"/>
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
    category: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M10 4H4c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm10 0h-6c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM4 18h6c1.11 0 2 .89 2 2v6c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2v-6c0-1.11.89-2 2-2zm16 0h-6c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2v-6c0-1.11-.89-2-2-2z"/>
      </svg>
    ),
    map: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    history: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>
    ),
    help: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2ZM13,19H11V17H13V19ZM15.07,11.25L14.17,12.17C13.45,12.9 13,13.5 13,15H11V14.5C11,13.4 11.45,12.4 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.9 13.1,7 12,7C10.9,7 10,7.9 10,9H8C8,6.79 9.79,5 12,5C14.21,5 16,6.79 16,9C16,9.88 15.64,10.68 15.07,11.25Z"/>
      </svg>
    ),
    'credit-card': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4M20,18H4V12H20V18M20,8H4V6H20V8Z"/>
      </svg>
    ),
    'contact-support': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
        <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
      </svg>
    )
  };

  return iconComponents[name] || iconComponents.help;
};

const SlideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mock API functions
  const mockAPI = {
    getCategories: () => new Promise(resolve => {
      setTimeout(() => resolve([
        { id: 1, name: 'Festivali' },
        { id: 2, name: 'Koncerti' },
        { id: 3, name: 'Seminari' }
      ]), 1000);
    }),
    
    getEvents: () => new Promise(resolve => {
      setTimeout(() => resolve([
        { id: 1, title: 'Exit Festival' },
        { id: 2, title: 'Belgrade Music Week' },
        { id: 3, title: 'Tech Conference' }
      ]), 1500);
    }),
    
    getUserHistory: () => new Promise(resolve => {
      setTimeout(() => resolve([
        { id: 1, place: 'Exit Festival', date: '2024-07-15' },
        { id: 2, place: 'Concert Hall', date: '2024-06-20' }
      ]), 800);
    }),
    
    getFAQ: () => new Promise(resolve => {
      setTimeout(() => resolve([
        { id: 1, question: 'Kako da kupim ulaznicu?' },
        { id: 2, question: 'Kako da otkažem rezervaciju?' }
      ]), 600);
    }),
    
    getUserCredit: () => new Promise(resolve => {
      setTimeout(() => resolve({
        balance: 1250,
        currency: 'RSD',
        lastUpdate: '2024-07-30'
      }), 900);
    }),
    
    logout: () => new Promise(resolve => {
      setTimeout(() => resolve({ success: true }), 500);
    })
  };

  const handleMenuItemPress = async (item) => {
    setLoading(true);
    setLoadingItem(item);
    toggleMenu(); // Close menu immediately upon selection
    
    try {
      switch(item) {
        case 'Početna':
          console.log('🏠 Navigating to Home...');
          alert('Početna - Navigacija na početnu stranicu');
          break;
          
        case 'Kategorije':
          console.log('📂 Loading categories...');
          const categories = await mockAPI.getCategories();
          alert(
            `Kategorije učitane\n\nPronađeno ${categories.length} kategorija:\n` + 
            categories.map(cat => `• ${cat.name}`).join('\n')
          );
          break;
          
        case 'Lista dogadjaja':
          router.push('../app/(tabs)/EventList')
          break;
          
        case 'Istorija':
          console.log('📚 Loading history...');
          const history = await mockAPI.getUserHistory();
          alert(
            `Istorija učitana\n\nPronađeno ${history.length} transakcija\n` +
            `Poslednja: ${history[0]?.place || 'N/A'}`
          );
          break;
          
        case 'Podešavanja':
          console.log('⚙️ Opening settings...');
          alert('Podešavanja - Otvaranje stranice sa podešavanjima');
          break;
          
        case 'FAQ':
          /*
          console.log('❓ Loading FAQ...');
          const faqData = await mockAPI.getFAQ();
          alert(
            `FAQ učitan\n\nPronađeno ${faqData.length} pitanja\n` +
            `Prvo pitanje: ${faqData[0]?.question || 'N/A'}`
          );
          */
          router.push('../app/(tabs)/FAQ');
          break;
          
        case 'Kredit':
          console.log('💳 Loading credit info...');
          const creditInfo = await mockAPI.getUserCredit();
          alert(
            `Kredit informacije\n\nStanje: ${creditInfo.balance} ${creditInfo.currency}\n` +
            `Poslednje ažuriranje: ${creditInfo.lastUpdate}`
          );
          break;
          
        case 'Kontakt podrška':
          console.log('📞 Opening support...');
          alert(
            'Kontakt podrška\n\nEmail: support@vexa.rs\nTelefon: 011/123-456'
          );
          break;
          
        case 'Odjavi se':
          if (window.confirm('Da li ste sigurni da se želite odjaviti?')) {
            setLoading(true); // Keep loading state for logout specific
            setLoadingItem('Odjavi se');
            try {
              await mockAPI.logout();
              alert('Uspeh - Uspešno ste se odjavili!');
            } catch (error) {
              alert('Greška - Greška pri odjavi');
            } finally {
              setLoading(false);
              setLoadingItem('');
            }
          }
          return; // Prevent final loading state reset for logout confirm
          
        default:
          console.log(`Unknown menu item: ${item}`);
      }
    } catch (error) {
      console.error('Mock API Error:', error);
      alert(
        `Greška\n\nDošlo je do greške pri učitavanju ${item.toLowerCase()}.\n\nGreška: ${error.message}`
      );
    } finally {
      // Only reset loading if it's not the logout confirmation
      if (item !== 'Odjavi se' || !loading) {
        setLoading(false);
        setLoadingItem('');
      }
    }
  };

  const MenuItem = ({ icon, title, onPress }) => {
    const isItemLoading = loading && loadingItem === title;
    
    return (
      <div 
        className={`menu-item ${isItemLoading ? 'loading-item' : ''} ${loading && !isItemLoading ? 'disabled-item' : ''}`}
        onClick={loading && !isItemLoading ? undefined : onPress}
      >
        <div style={{ marginRight: '1.25rem', width: '24px' }}>
          <Icon 
            name={icon} 
            size={24} 
            color={loading && !isItemLoading ? "#CCCCCC" : "#FFFFFF"} 
          />
        </div>
        <span 
          style={{ 
            color: loading && !isItemLoading ? '#C0C0C0' : '#FFFFFF', 
            fontSize: '1rem', 
            fontWeight: '600' 
          }}
        >
          {title}
        </span>
        {isItemLoading && (
          <div className="spinner">
            <div className="animate-spin-custom"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#F3F4F6' }}>
      <style>
        {`
          .header {
            height: 60px; /* Equivalent to h-15 (15 * 4 = 60px) */
            background-color: #B91C1C; /* red-700 */
            display: flex;
            align-items: center;
            padding: 0 1rem; /* px-4 */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
          }

          .header button {
            padding: 0.5rem; /* p-2 */
            border-radius: 0.25rem; /* rounded */
            transition: background-color 0.15s ease-in-out; /* transition-colors */
          }

          .header button:hover {
            background-color: rgba(0, 0, 0, 0.1); /* hover:bg-black hover:bg-opacity-10 */
          }

          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1.25rem; /* p-5 */
          }

          .main-content h2 {
            font-size: 1.5rem; /* text-2xl */
            font-weight: bold;
            color: #1F2937; /* text-gray-800 */
            text-align: center;
            margin-bottom: 0.75rem; /* mb-3 */
          }

          .main-content p {
            font-size: 1rem; /* text-base */
            color: #4B5563; /* text-gray-600 */
            text-align: center;
          }

          .loading-container {
            margin-top: 2rem; /* mt-8 */
            text-align: center;
          }

          .loading-spinner-main {
            border: 2px solid transparent;
            border-bottom-color: #B91C1C; /* border-red-700 */
            border-radius: 50%;
            width: 40px; /* h-10 w-10 */
            height: 40px;
            animation: spin 1s linear infinite; /* animate-spin */
            margin: 0 auto; /* mx-auto */
          }

          .loading-text {
            margin-top: 0.75rem; /* mt-3 */
            font-size: 1rem; /* text-base */
            color: #4B5563; /* text-gray-600 */
          }

          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5); /* bg-black bg-opacity-50 */
            z-index: 40;
          }

          .slide-menu {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 80%; /* w-4/5 */
            max-width: 384px; /* max-w-sm */
            /* AŽURIRANI GRADIJENT */
            background: linear-gradient(to bottom, #8F123A 20%, #F51E63 40%); 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out; /* transition-transform duration-300 */
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .slide-menu.open {
            transform: translateX(0);
          }

          .logo-section {
            padding: 2.5rem 1.25rem 1.25rem; /* p-5 pt-10 */
            border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* border-b border-white border-opacity-30 */
            /* Nema potrebe za inherit, gradijent je na .slide-menu */
          }

          .logo-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 0.5rem; /* mb-2 */
          }

          /* NOVI STIL ZA LOGO SLIKU */
          .logo-image {
            width: 80px; /* Podesite širinu po potrebi */
            height: 80px; /* Podesite visinu po potrebi */
            margin-bottom: 0.75rem; /* mb-3 */
            border-radius: 0.75rem; /* Opciono: zaobljeni uglovi za logo */
          }

          /* Sakrij stare elemente "V" i "Vexa" */
          .logo-circle, .logo-title {
            display: none; 
          }

          .logo-subtitle {
            color: rgba(255, 255, 255, 0.9); /* text-white text-opacity-90 */
            font-size: 0.75rem; /* text-xs */
            font-weight: 600; /* font-semibold */
            letter-spacing: 0.05em; /* tracking-wider */
            text-align: center;
          }

          .menu-items-section {
            flex: 1;
            padding-top: 1.25rem; /* pt-5 */
          }

          .menu-category-title {
            color: rgba(255, 255, 255, 0.9); /* text-white text-opacity-90 */
            font-size: 0.875rem; /* text-sm */
            font-weight: bold;
            padding: 0 1.25rem 1rem; /* px-5 pb-4 */
            letter-spacing: 0.05em; /* tracking-wider */
          }

          .menu-item {
            display: flex;
            align-items: center;
            padding: 1rem 1.25rem; /* py-4 px-5 */
            cursor: pointer;
            transition: background-color 0.2s ease-in-out; /* transition-all duration-200 */
          }

          .menu-item:hover {
            background-color: rgba(255, 255, 255, 0.05); /* hover:bg-white hover:bg-opacity-5 */
          }

          .menu-item.loading-item {
            background-color: rgba(255, 255, 255, 0.1); /* bg-white bg-opacity-10 */
          }

          .menu-item.disabled-item {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .menu-item .spinner {
            margin-left: auto;
          }

          .menu-item .animate-spin-custom {
            border: 2px solid transparent;
            border-bottom-color: #FFFFFF;
            border-radius: 50%;
            width: 20px; /* h-5 w-5 */
            height: 20px;
            animation: spin 1s linear infinite; /* animate-spin */
          }

          .logout-section {
            border-top: 1px solid rgba(255, 255, 255, 0.2); /* border-t border-white border-opacity-20 */
            padding: 1.25rem; /* p-5 */
          }

          .logout-section div {
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: opacity 0.2s ease-in-out; /* transition-opacity */
          }

          .logout-section div.disabled-item {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .logout-section span {
            color: #FFFFFF;
            font-size: 1rem; /* text-base */
            font-weight: 600; /* font-semibold */
            margin-left: 1.25rem; /* ml-5 */
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Main Content (Header and central text) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="header">
          <button 
            onClick={toggleMenu}
            className="menu-button"
          >
            <Icon name="menu" size={28} color="#FFFFFF" />
          </button>
          <h1 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 'bold', marginLeft: '1rem' }}>Vexa App - Mock Test</h1>
        </div>
        
        {/* Central Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: '0.75rem' }}>
            Test verzija aplikacije
          </h2>
          <p style={{ fontSize: '1rem', color: '#4B5563', textAlign: 'center' }}>
            Meni koristi mock API podatke za testiranje
          </p>
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner-main"></div>
              <p className="loading-text">
                Učitavam {loadingItem}...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="overlay"
          onClick={toggleMenu}
        />
      )}

      {/* Slide Menu */}
      <div 
        className={`slide-menu ${isMenuOpen ? 'open' : ''}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-content">
              {/* === MESTO ZA LOGO SLIKU === */}
              <img
                src={logoImage} // Koristi uvezenu `logoImage` promenljivu
                alt="Vexa Logo"
                className="logo-image" // Dodatna klasa za lakše stilizovanje ako treba
              />
              {/* === KRAJ MESTA ZA LOGO SLIKU === */}
            </div>
            <p className="logo-subtitle">
              POWER OF LOYALTY - TEST MODE
            </p>
          </div>

          {/* Menu Items */}
          <div className="menu-items-section">
            <h3 className="menu-category-title">
              MENI
            </h3>
            
            <MenuItem
              icon="home"
              title="Početna"
              onPress={() => handleMenuItemPress('Početna')}
            />
            <MenuItem
              icon="category"
              title="Kategorije"
              onPress={() => handleMenuItemPress('Kategorije')}
            />
            <MenuItem
              icon="map"
              title="Lista dogadjaja"
              onPress={() => handleMenuItemPress('Lista dogadjaja')}
            />
            <MenuItem
              icon="history"
              title="Istorija"
              onPress={() => handleMenuItemPress('Istorija')}
            />
            <MenuItem
              icon="settings"
              title="Podešavanja"
              onPress={() => handleMenuItemPress('Podešavanja')}
            />
            <MenuItem
              icon="help"
              title="FAQ"
              onPress={() => handleMenuItemPress('FAQ')}
            />
            <MenuItem
              icon="credit-card"
              title="Kredit"
              onPress={() => handleMenuItemPress('Kredit')}
            />
            <MenuItem
              icon="contact-support"
              title="Kontakt podrška"
              onPress={() => handleMenuItemPress('Kontakt podrška')}
            />
          </div>
          <div className="logout-section">
            <MenuItem
              icon="logout"
              title="Odjavi se"
              onPress={() => handleMenuItemPress('Odjavi se')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideMenu;
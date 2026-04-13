import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COUNTRY_DATA: Record<string, { name: string; capital: string; population: string; area: string; continent: string; currency: string; language: string }> = {
  "004": { name: "Afghanistan", capital: "Kabul", population: "40.1M", area: "652,864 km²", continent: "Asia", currency: "Afghan Afghani", language: "Dari, Pashto" },
  "008": { name: "Albania", capital: "Tirana", population: "2.8M", area: "28,748 km²", continent: "Europe", currency: "Albanian Lek", language: "Albanian" },
  "012": { name: "Algeria", capital: "Algiers", population: "44.6M", area: "2,381,741 km²", continent: "Africa", currency: "Algerian Dinar", language: "Arabic, Tamazight" },
  "024": { name: "Angola", capital: "Luanda", population: "34.5M", area: "1,246,700 km²", continent: "Africa", currency: "Kwanza", language: "Portuguese" },
  "032": { name: "Argentina", capital: "Buenos Aires", population: "45.8M", area: "2,780,400 km²", continent: "South America", currency: "Argentine Peso", language: "Spanish" },
  "036": { name: "Australia", capital: "Canberra", population: "26.1M", area: "7,692,024 km²", continent: "Oceania", currency: "Australian Dollar", language: "English" },
  "040": { name: "Austria", capital: "Vienna", population: "9.1M", area: "83,871 km²", continent: "Europe", currency: "Euro", language: "German" },
  "050": { name: "Bangladesh", capital: "Dhaka", population: "168.1M", area: "147,570 km²", continent: "Asia", currency: "Bangladeshi Taka", language: "Bengali" },
  "056": { name: "Belgium", capital: "Brussels", population: "11.6M", area: "30,528 km²", continent: "Europe", currency: "Euro", language: "Dutch, French, German" },
  "064": { name: "Bhutan", capital: "Thimphu", population: "0.8M", area: "38,394 km²", continent: "Asia", currency: "Bhutanese Ngultrum", language: "Dzongkha" },
  "068": { name: "Bolivia", capital: "Sucre", population: "12.1M", area: "1,098,581 km²", continent: "South America", currency: "Bolivian Boliviano", language: "Spanish" },
  "076": { name: "Brazil", capital: "Brasília", population: "215.3M", area: "8,515,767 km²", continent: "South America", currency: "Brazilian Real", language: "Portuguese" },
  "100": { name: "Bulgaria", capital: "Sofia", population: "6.5M", area: "110,879 km²", continent: "Europe", currency: "Bulgarian Lev", language: "Bulgarian" },
  "116": { name: "Cambodia", capital: "Phnom Penh", population: "16.7M", area: "181,035 km²", continent: "Asia", currency: "Cambodian Riel", language: "Khmer" },
  "120": { name: "Cameroon", capital: "Yaoundé", population: "27.2M", area: "475,442 km²", continent: "Africa", currency: "Central African CFA Franc", language: "French, English" },
  "124": { name: "Canada", capital: "Ottawa", population: "38.2M", area: "9,984,670 km²", continent: "North America", currency: "Canadian Dollar", language: "English, French" },
  "152": { name: "Chile", capital: "Santiago", population: "19.5M", area: "756,102 km²", continent: "South America", currency: "Chilean Peso", language: "Spanish" },
  "156": { name: "China", capital: "Beijing", population: "1.4B", area: "9,596,960 km²", continent: "Asia", currency: "Chinese Yuan", language: "Mandarin Chinese" },
  "170": { name: "Colombia", capital: "Bogotá", population: "51.9M", area: "1,141,748 km²", continent: "South America", currency: "Colombian Peso", language: "Spanish" },
  "178": { name: "Republic of the Congo", capital: "Brazzaville", population: "5.8M", area: "342,000 km²", continent: "Africa", currency: "Central African CFA Franc", language: "French" },
  "180": { name: "DR Congo", capital: "Kinshasa", population: "99.0M", area: "2,344,858 km²", continent: "Africa", currency: "Congolese Franc", language: "French" },
  "188": { name: "Costa Rica", capital: "San José", population: "5.2M", area: "51,100 km²", continent: "North America", currency: "Costa Rican Colón", language: "Spanish" },
  "191": { name: "Croatia", capital: "Zagreb", population: "3.9M", area: "56,594 km²", continent: "Europe", currency: "Euro", language: "Croatian" },
  "196": { name: "Cyprus", capital: "Nicosia", population: "1.2M", area: "9,251 km²", continent: "Europe", currency: "Euro", language: "Greek, Turkish" },
  "203": { name: "Czech Republic", capital: "Prague", population: "10.9M", area: "78,866 km²", continent: "Europe", currency: "Czech Koruna", language: "Czech" },
  "208": { name: "Denmark", capital: "Copenhagen", population: "5.9M", area: "43,094 km²", continent: "Europe", currency: "Danish Krone", language: "Danish" },
  "214": { name: "Dominican Republic", capital: "Santo Domingo", population: "11.1M", area: "48,671 km²", continent: "North America", currency: "Dominican Peso", language: "Spanish" },
  "218": { name: "Ecuador", capital: "Quito", population: "18.0M", area: "283,561 km²", continent: "South America", currency: "US Dollar", language: "Spanish" },
  "818": { name: "Egypt", capital: "Cairo", population: "102.3M", area: "1,002,450 km²", continent: "Africa", currency: "Egyptian Pound", language: "Arabic" },
  "222": { name: "El Salvador", capital: "San Salvador", population: "6.5M", area: "21,041 km²", continent: "North America", currency: "US Dollar", language: "Spanish" },
  "231": { name: "Ethiopia", capital: "Addis Ababa", population: "120.8M", area: "1,104,300 km²", continent: "Africa", currency: "Ethiopian Birr", language: "Amharic" },
  "246": { name: "Finland", capital: "Helsinki", population: "5.5M", area: "338,435 km²", continent: "Europe", currency: "Euro", language: "Finnish, Swedish" },
  "250": { name: "France", capital: "Paris", population: "67.8M", area: "551,695 km²", continent: "Europe", currency: "Euro", language: "French" },
  "266": { name: "Gabon", capital: "Libreville", population: "2.3M", area: "267,668 km²", continent: "Africa", currency: "Central African CFA Franc", language: "French" },
  "276": { name: "Germany", capital: "Berlin", population: "83.8M", area: "357,114 km²", continent: "Europe", currency: "Euro", language: "German" },
  "288": { name: "Ghana", capital: "Accra", population: "32.8M", area: "238,533 km²", continent: "Africa", currency: "Ghanaian Cedi", language: "English" },
  "300": { name: "Greece", capital: "Athens", population: "10.4M", area: "131,957 km²", continent: "Europe", currency: "Euro", language: "Greek" },
  "320": { name: "Guatemala", capital: "Guatemala City", population: "17.8M", area: "108,889 km²", continent: "North America", currency: "Guatemalan Quetzal", language: "Spanish" },
  "332": { name: "Haiti", capital: "Port-au-Prince", population: "11.5M", area: "27,750 km²", continent: "North America", currency: "Haitian Gourde", language: "French, Haitian Creole" },
  "340": { name: "Honduras", capital: "Tegucigalpa", population: "10.3M", area: "112,492 km²", continent: "North America", currency: "Honduran Lempira", language: "Spanish" },
  "348": { name: "Hungary", capital: "Budapest", population: "9.7M", area: "93,028 km²", continent: "Europe", currency: "Hungarian Forint", language: "Hungarian" },
  "356": { name: "India", capital: "New Delhi", population: "1.4B", area: "3,287,263 km²", continent: "Asia", currency: "Indian Rupee", language: "Hindi, English" },
  "360": { name: "Indonesia", capital: "Jakarta", population: "273.8M", area: "1,904,569 km²", continent: "Asia", currency: "Indonesian Rupiah", language: "Indonesian" },
  "364": { name: "Iran", capital: "Tehran", population: "85.9M", area: "1,648,195 km²", continent: "Asia", currency: "Iranian Rial", language: "Persian" },
  "368": { name: "Iraq", capital: "Baghdad", population: "42.2M", area: "438,317 km²", continent: "Asia", currency: "Iraqi Dinar", language: "Arabic, Kurdish" },
  "372": { name: "Ireland", capital: "Dublin", population: "5.1M", area: "70,273 km²", continent: "Europe", currency: "Euro", language: "English, Irish" },
  "376": { name: "Israel", capital: "Jerusalem", population: "9.5M", area: "20,770 km²", continent: "Asia", currency: "Israeli New Shekel", language: "Hebrew, Arabic" },
  "380": { name: "Italy", capital: "Rome", population: "60.0M", area: "301,340 km²", continent: "Europe", currency: "Euro", language: "Italian" },
  "388": { name: "Jamaica", capital: "Kingston", population: "3.0M", area: "10,991 km²", continent: "North America", currency: "Jamaican Dollar", language: "English" },
  "392": { name: "Japan", capital: "Tokyo", population: "125.7M", area: "377,975 km²", continent: "Asia", currency: "Japanese Yen", language: "Japanese" },
  "400": { name: "Jordan", capital: "Amman", population: "10.3M", area: "89,342 km²", continent: "Asia", currency: "Jordanian Dinar", language: "Arabic" },
  "398": { name: "Kazakhstan", capital: "Astana", population: "19.2M", area: "2,724,900 km²", continent: "Asia", currency: "Kazakhstani Tenge", language: "Kazakh, Russian" },
  "404": { name: "Kenya", capital: "Nairobi", population: "54.0M", area: "580,367 km²", continent: "Africa", currency: "Kenyan Shilling", language: "Swahili, English" },
  "408": { name: "North Korea", capital: "Pyongyang", population: "25.9M", area: "120,538 km²", continent: "Asia", currency: "North Korean Won", language: "Korean" },
  "410": { name: "South Korea", capital: "Seoul", population: "51.7M", area: "100,210 km²", continent: "Asia", currency: "South Korean Won", language: "Korean" },
  "414": { name: "Kuwait", capital: "Kuwait City", population: "4.3M", area: "17,818 km²", continent: "Asia", currency: "Kuwaiti Dinar", language: "Arabic" },
  "418": { name: "Laos", capital: "Vientiane", population: "7.4M", area: "236,800 km²", continent: "Asia", currency: "Lao Kip", language: "Lao" },
  "422": { name: "Lebanon", capital: "Beirut", population: "6.8M", area: "10,452 km²", continent: "Asia", currency: "Lebanese Pound", language: "Arabic" },
  "430": { name: "Liberia", capital: "Monrovia", population: "5.2M", area: "111,369 km²", continent: "Africa", currency: "Liberian Dollar", language: "English" },
  "434": { name: "Libya", capital: "Tripoli", population: "7.0M", area: "1,759,541 km²", continent: "Africa", currency: "Libyan Dinar", language: "Arabic" },
  "440": { name: "Lithuania", capital: "Vilnius", population: "2.8M", area: "65,300 km²", continent: "Europe", currency: "Euro", language: "Lithuanian" },
  "484": { name: "Mexico", capital: "Mexico City", population: "130.3M", area: "1,964,375 km²", continent: "North America", currency: "Mexican Peso", language: "Spanish" },
  "496": { name: "Mongolia", capital: "Ulaanbaatar", population: "3.4M", area: "1,564,116 km²", continent: "Asia", currency: "Mongolian Tögrög", language: "Mongolian" },
  "504": { name: "Morocco", capital: "Rabat", population: "37.5M", area: "446,550 km²", continent: "Africa", currency: "Moroccan Dirham", language: "Arabic, Tamazight" },
  "508": { name: "Mozambique", capital: "Maputo", population: "32.8M", area: "801,590 km²", continent: "Africa", currency: "Mozambican Metical", language: "Portuguese" },
  "516": { name: "Namibia", capital: "Windhoek", population: "2.6M", area: "824,292 km²", continent: "Africa", currency: "Namibian Dollar", language: "English" },
  "524": { name: "Nepal", capital: "Kathmandu", population: "29.7M", area: "147,181 km²", continent: "Asia", currency: "Nepalese Rupee", language: "Nepali" },
  "528": { name: "Netherlands", capital: "Amsterdam", population: "17.7M", area: "41,543 km²", continent: "Europe", currency: "Euro", language: "Dutch" },
  "554": { name: "New Zealand", capital: "Wellington", population: "5.1M", area: "270,467 km²", continent: "Oceania", currency: "New Zealand Dollar", language: "English, Māori" },
  "558": { name: "Nicaragua", capital: "Managua", population: "6.7M", area: "130,373 km²", continent: "North America", currency: "Nicaraguan Córdoba", language: "Spanish" },
  "562": { name: "Niger", capital: "Niamey", population: "25.2M", area: "1,267,000 km²", continent: "Africa", currency: "West African CFA Franc", language: "French" },
  "566": { name: "Nigeria", capital: "Abuja", population: "218.5M", area: "923,768 km²", continent: "Africa", currency: "Nigerian Naira", language: "English" },
  "578": { name: "Norway", capital: "Oslo", population: "5.4M", area: "385,207 km²", continent: "Europe", currency: "Norwegian Krone", language: "Norwegian" },
  "586": { name: "Pakistan", capital: "Islamabad", population: "231.4M", area: "881,913 km²", continent: "Asia", currency: "Pakistani Rupee", language: "Urdu, English" },
  "591": { name: "Panama", capital: "Panama City", population: "4.4M", area: "75,417 km²", continent: "North America", currency: "Panamanian Balboa", language: "Spanish" },
  "600": { name: "Paraguay", capital: "Asunción", population: "7.4M", area: "406,752 km²", continent: "South America", currency: "Paraguayan Guaraní", language: "Spanish, Guaraní" },
  "604": { name: "Peru", capital: "Lima", population: "33.4M", area: "1,285,216 km²", continent: "South America", currency: "Peruvian Sol", language: "Spanish" },
  "608": { name: "Philippines", capital: "Manila", population: "114.1M", area: "300,000 km²", continent: "Asia", currency: "Philippine Peso", language: "Filipino, English" },
  "616": { name: "Poland", capital: "Warsaw", population: "37.8M", area: "312,696 km²", continent: "Europe", currency: "Polish Złoty", language: "Polish" },
  "620": { name: "Portugal", capital: "Lisbon", population: "10.3M", area: "92,212 km²", continent: "Europe", currency: "Euro", language: "Portuguese" },
  "630": { name: "Puerto Rico", capital: "San Juan", population: "3.3M", area: "9,104 km²", continent: "North America", currency: "US Dollar", language: "Spanish, English" },
  "634": { name: "Qatar", capital: "Doha", population: "2.9M", area: "11,586 km²", continent: "Asia", currency: "Qatari Riyal", language: "Arabic" },
  "642": { name: "Romania", capital: "Bucharest", population: "19.0M", area: "238,397 km²", continent: "Europe", currency: "Romanian Leu", language: "Romanian" },
  "643": { name: "Russia", capital: "Moscow", population: "145.5M", area: "17,098,242 km²", continent: "Europe/Asia", currency: "Russian Ruble", language: "Russian" },
  "682": { name: "Saudi Arabia", capital: "Riyadh", population: "35.6M", area: "2,149,690 km²", continent: "Asia", currency: "Saudi Riyal", language: "Arabic" },
  "686": { name: "Senegal", capital: "Dakar", population: "17.8M", area: "196,722 km²", continent: "Africa", currency: "West African CFA Franc", language: "French" },
  "694": { name: "Sierra Leone", capital: "Freetown", population: "8.2M", area: "71,740 km²", continent: "Africa", currency: "Sierra Leonean Leone", language: "English" },
  "705": { name: "Slovenia", capital: "Ljubljana", population: "2.1M", area: "20,273 km²", continent: "Europe", currency: "Euro", language: "Slovenian" },
  "706": { name: "Somalia", capital: "Mogadishu", population: "17.1M", area: "637,657 km²", continent: "Africa", currency: "Somali Shilling", language: "Somali, Arabic" },
  "710": { name: "South Africa", capital: "Pretoria", population: "60.0M", area: "1,221,037 km²", continent: "Africa", currency: "South African Rand", language: "11 official languages" },
  "724": { name: "Spain", capital: "Madrid", population: "47.4M", area: "505,990 km²", continent: "Europe", currency: "Euro", language: "Spanish" },
  "729": { name: "Sudan", capital: "Khartoum", population: "44.9M", area: "1,861,484 km²", continent: "Africa", currency: "Sudanese Pound", language: "Arabic, English" },
  "752": { name: "Sweden", capital: "Stockholm", population: "10.5M", area: "450,295 km²", continent: "Europe", currency: "Swedish Krona", language: "Swedish" },
  "756": { name: "Switzerland", capital: "Bern", population: "8.7M", area: "41,285 km²", continent: "Europe", currency: "Swiss Franc", language: "German, French, Italian, Romansh" },
  "760": { name: "Syria", capital: "Damascus", population: "21.3M", area: "185,180 km²", continent: "Asia", currency: "Syrian Pound", language: "Arabic" },
  "158": { name: "Taiwan", capital: "Taipei", population: "23.6M", area: "36,193 km²", continent: "Asia", currency: "New Taiwan Dollar", language: "Mandarin Chinese" },
  "762": { name: "Tajikistan", capital: "Dushanbe", population: "10.0M", area: "143,100 km²", continent: "Asia", currency: "Tajikistani Somoni", language: "Tajik" },
  "834": { name: "Tanzania", capital: "Dodoma", population: "63.7M", area: "945,087 km²", continent: "Africa", currency: "Tanzanian Shilling", language: "Swahili, English" },
  "764": { name: "Thailand", capital: "Bangkok", population: "71.6M", area: "513,120 km²", continent: "Asia", currency: "Thai Baht", language: "Thai" },
  "788": { name: "Tunisia", capital: "Tunis", population: "12.1M", area: "163,610 km²", continent: "Africa", currency: "Tunisian Dinar", language: "Arabic" },
  "792": { name: "Turkey", capital: "Ankara", population: "84.7M", area: "783,562 km²", continent: "Asia/Europe", currency: "Turkish Lira", language: "Turkish" },
  "800": { name: "Uganda", capital: "Kampala", population: "47.1M", area: "241,550 km²", continent: "Africa", currency: "Ugandan Shilling", language: "English, Swahili" },
  "804": { name: "Ukraine", capital: "Kyiv", population: "44.0M", area: "603,550 km²", continent: "Europe", currency: "Ukrainian Hryvnia", language: "Ukrainian" },
  "784": { name: "United Arab Emirates", capital: "Abu Dhabi", population: "10.0M", area: "83,600 km²", continent: "Asia", currency: "UAE Dirham", language: "Arabic" },
  "826": { name: "United Kingdom", capital: "London", population: "67.1M", area: "242,495 km²", continent: "Europe", currency: "British Pound", language: "English" },
  "840": { name: "United States", capital: "Washington D.C.", population: "334.0M", area: "9,833,517 km²", continent: "North America", currency: "US Dollar", language: "English" },
  "858": { name: "Uruguay", capital: "Montevideo", population: "3.5M", area: "176,215 km²", continent: "South America", currency: "Uruguayan Peso", language: "Spanish" },
  "860": { name: "Uzbekistan", capital: "Tashkent", population: "35.3M", area: "448,978 km²", continent: "Asia", currency: "Uzbekistani Som", language: "Uzbek" },
  "862": { name: "Venezuela", capital: "Caracas", population: "28.7M", area: "912,050 km²", continent: "South America", currency: "Venezuelan Bolívar", language: "Spanish" },
  "704": { name: "Vietnam", capital: "Hanoi", population: "97.3M", area: "331,212 km²", continent: "Asia", currency: "Vietnamese Dong", language: "Vietnamese" },
  "887": { name: "Yemen", capital: "Sana'a", population: "33.7M", area: "527,968 km²", continent: "Asia", currency: "Yemeni Rial", language: "Arabic" },
  "894": { name: "Zambia", capital: "Lusaka", population: "19.5M", area: "752,618 km²", continent: "Africa", currency: "Zambian Kwacha", language: "English" },
  "716": { name: "Zimbabwe", capital: "Harare", population: "15.1M", area: "390,757 km²", continent: "Africa", currency: "Zimbabwe Gold", language: "English and 15 others" },
};

const CONTINENT_COLORS: Record<string, string> = {
  "Africa": "#f59e0b",
  "Asia": "#10b981",
  "Europe": "#3b82f6",
  "North America": "#ef4444",
  "South America": "#8b5cf6",
  "Oceania": "#06b6d4",
  "Asia/Europe": "#6366f1",
  "Europe/Asia": "#6366f1",
};

function getCountryColor(numericCode: string, isSelected: boolean, isHovered: boolean) {
  const data = COUNTRY_DATA[numericCode];
  if (isSelected) return "#f97316";
  if (isHovered) {
    const base = data ? CONTINENT_COLORS[data.continent] ?? "#64748b" : "#64748b";
    return base;
  }
  if (data) {
    const base = CONTINENT_COLORS[data.continent] ?? "#64748b";
    return base + "cc";
  }
  return "#94a3b8";
}

interface CountryInfo {
  name: string;
  capital: string;
  population: string;
  area: string;
  continent: string;
  currency: string;
  language: string;
}

export default function App() {
  const [selected, setSelected] = useState<{ code: string; info: CountryInfo } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipName, setTooltipName] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);

  const handleClick = useCallback((geo: { id: string }) => {
    const code = geo.id;
    const info = COUNTRY_DATA[code];
    if (info) {
      setSelected({ code, info });
    } else {
      setSelected(null);
    }
  }, []);

  const handleMouseEnter = useCallback((geo: { id: string }, evt: React.MouseEvent) => {
    setHovered(geo.id);
    const info = COUNTRY_DATA[geo.id];
    setTooltipName(info ? info.name : "Unknown territory");
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  }, []);

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    setTooltipName("");
  }, []);

  const continents = Object.values(COUNTRY_DATA).reduce<Record<string, number>>((acc, c) => {
    acc[c.continent] = (acc[c.continent] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">World Map</h1>
          <p className="text-sm text-slate-400 mt-0.5">Click any country to explore</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setZoom(z => Math.min(z * 1.5, 8))}
            className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium"
          >
            +
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z / 1.5, 0.5))}
            className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium"
          >
            −
          </button>
          <button
            onClick={() => { setZoom(1); setCenter([0, 20]); setSelected(null); }}
            className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative overflow-hidden bg-slate-950">
          <ComposableMap
            projection="geoMercator"
            style={{ width: "100%", height: "100%" }}
            projectionConfig={{ scale: 130, center: [0, 20] }}
          >
            <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({ zoom: z, coordinates }) => { setZoom(z); setCenter(coordinates); }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isSelected = selected?.code === geo.id;
                    const isHovered = hovered === geo.id;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleClick(geo)}
                        onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: {
                            fill: getCountryColor(geo.id, isSelected, false),
                            stroke: "#1e293b",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: "pointer",
                            transition: "fill 0.15s ease",
                          },
                          hover: {
                            fill: getCountryColor(geo.id, isSelected, true),
                            stroke: "#334155",
                            strokeWidth: 0.8,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: "#f97316",
                            stroke: "#ea580c",
                            strokeWidth: 0.8,
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {hovered && tooltipName && (
            <div
              className="fixed z-50 pointer-events-none bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg shadow-xl border border-slate-600 font-medium"
              style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 36 }}
            >
              {tooltipName}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col overflow-y-auto">
          {selected ? (
            <div className="p-6 flex-1">
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
              >
                ← Back
              </button>
              <div
                className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3 text-white"
                style={{ backgroundColor: CONTINENT_COLORS[selected.info.continent] ?? "#64748b" }}
              >
                {selected.info.continent}
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{selected.info.name}</h2>
              <p className="text-slate-400 text-sm mb-6">ISO Numeric: {selected.code}</p>

              <div className="space-y-4">
                {[
                  { label: "Capital", value: selected.info.capital, icon: "🏛️" },
                  { label: "Population", value: selected.info.population, icon: "👥" },
                  { label: "Area", value: selected.info.area, icon: "📏" },
                  { label: "Currency", value: selected.info.currency, icon: "💰" },
                  { label: "Language", value: selected.info.language, icon: "🗣️" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-medium text-white mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1">
              <h2 className="text-lg font-semibold text-white mb-1">Explore the World</h2>
              <p className="text-slate-400 text-sm mb-6">Click any country on the map to see its details.</p>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Legend</h3>
                <div className="space-y-2">
                  {Object.entries(CONTINENT_COLORS)
                    .filter(([name]) => !name.includes("/") || name === "Asia/Europe")
                    .map(([continent, color]) => (
                      <div key={continent} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-sm text-slate-300">{continent}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/60 text-center">
                    <p className="text-2xl font-bold text-white">{Object.keys(COUNTRY_DATA).length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Countries</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/60 text-center">
                    <p className="text-2xl font-bold text-white">7</p>
                    <p className="text-xs text-slate-400 mt-0.5">Continents</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Controls</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• Scroll to zoom in/out</p>
                  <p>• Drag to pan the map</p>
                  <p>• Click a country to explore</p>
                  <p>• Use + / − buttons to zoom</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

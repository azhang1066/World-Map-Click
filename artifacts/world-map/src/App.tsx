import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

interface StadiumInfo {
  team: string;
  stadium: string;
  division: string;
  capacity: string;
  city: string;
  coordinates: [number, number];
}

const MLB_STADIUMS: StadiumInfo[] = [
  // AL East
  { team: "Baltimore Orioles", stadium: "Oriole Park at Camden Yards", division: "AL East", capacity: "45,971", city: "Baltimore, MD", coordinates: [-76.6217, 39.2838] },
  { team: "Boston Red Sox", stadium: "Fenway Park", division: "AL East", capacity: "37,755", city: "Boston, MA", coordinates: [-71.0972, 42.3467] },
  { team: "New York Yankees", stadium: "Yankee Stadium", division: "AL East", capacity: "46,537", city: "Bronx, NY", coordinates: [-73.9262, 40.8296] },
  { team: "Tampa Bay Rays", stadium: "Tropicana Field", division: "AL East", capacity: "25,025", city: "St. Petersburg, FL", coordinates: [-82.6534, 27.7682] },
  { team: "Toronto Blue Jays", stadium: "Rogers Centre", division: "AL East", capacity: "49,282", city: "Toronto, ON", coordinates: [-79.3894, 43.6414] },
  // AL Central
  { team: "Chicago White Sox", stadium: "Guaranteed Rate Field", division: "AL Central", capacity: "40,615", city: "Chicago, IL", coordinates: [-87.6339, 41.8300] },
  { team: "Cleveland Guardians", stadium: "Progressive Field", division: "AL Central", capacity: "34,830", city: "Cleveland, OH", coordinates: [-81.6852, 41.4962] },
  { team: "Detroit Tigers", stadium: "Comerica Park", division: "AL Central", capacity: "41,297", city: "Detroit, MI", coordinates: [-83.0485, 42.3390] },
  { team: "Kansas City Royals", stadium: "Kauffman Stadium", division: "AL Central", capacity: "37,903", city: "Kansas City, MO", coordinates: [-94.4803, 39.0518] },
  { team: "Minnesota Twins", stadium: "Target Field", division: "AL Central", capacity: "38,544", city: "Minneapolis, MN", coordinates: [-93.2781, 44.9817] },
  // AL West
  { team: "Houston Astros", stadium: "Minute Maid Park", division: "AL West", capacity: "41,168", city: "Houston, TX", coordinates: [-95.3555, 29.7573] },
  { team: "Los Angeles Angels", stadium: "Angel Stadium", division: "AL West", capacity: "45,517", city: "Anaheim, CA", coordinates: [-117.8827, 33.8003] },
  { team: "Oakland Athletics", stadium: "Sutter Health Park", division: "AL West", capacity: "14,014", city: "Sacramento, CA", coordinates: [-121.5083, 38.5733] },
  { team: "Seattle Mariners", stadium: "T-Mobile Park", division: "AL West", capacity: "47,943", city: "Seattle, WA", coordinates: [-122.3325, 47.5914] },
  { team: "Texas Rangers", stadium: "Globe Life Field", division: "AL West", capacity: "40,000", city: "Arlington, TX", coordinates: [-97.0845, 32.7473] },
  // NL East
  { team: "Atlanta Braves", stadium: "Truist Park", division: "NL East", capacity: "41,084", city: "Cumberland, GA", coordinates: [-84.4678, 33.8908] },
  { team: "Miami Marlins", stadium: "loanDepot park", division: "NL East", capacity: "36,742", city: "Miami, FL", coordinates: [-80.2197, 25.7781] },
  { team: "New York Mets", stadium: "Citi Field", division: "NL East", capacity: "41,922", city: "Queens, NY", coordinates: [-73.8458, 40.7571] },
  { team: "Philadelphia Phillies", stadium: "Citizens Bank Park", division: "NL East", capacity: "42,792", city: "Philadelphia, PA", coordinates: [-75.1665, 39.9061] },
  { team: "Washington Nationals", stadium: "Nationals Park", division: "NL East", capacity: "41,339", city: "Washington, DC", coordinates: [-77.0075, 38.8731] },
  // NL Central
  { team: "Chicago Cubs", stadium: "Wrigley Field", division: "NL Central", capacity: "41,649", city: "Chicago, IL", coordinates: [-87.6553, 41.9484] },
  { team: "Cincinnati Reds", stadium: "Great American Ball Park", division: "NL Central", capacity: "42,319", city: "Cincinnati, OH", coordinates: [-84.5066, 39.0975] },
  { team: "Milwaukee Brewers", stadium: "American Family Field", division: "NL Central", capacity: "41,900", city: "Milwaukee, WI", coordinates: [-87.9712, 43.0280] },
  { team: "Pittsburgh Pirates", stadium: "PNC Park", division: "NL Central", capacity: "38,362", city: "Pittsburgh, PA", coordinates: [-80.0057, 40.4469] },
  { team: "St. Louis Cardinals", stadium: "Busch Stadium", division: "NL Central", capacity: "44,383", city: "St. Louis, MO", coordinates: [-90.1928, 38.6226] },
  // NL West
  { team: "Arizona Diamondbacks", stadium: "Chase Field", division: "NL West", capacity: "48,686", city: "Phoenix, AZ", coordinates: [-112.0667, 33.4453] },
  { team: "Colorado Rockies", stadium: "Coors Field", division: "NL West", capacity: "50,144", city: "Denver, CO", coordinates: [-104.9942, 39.7559] },
  { team: "Los Angeles Dodgers", stadium: "Dodger Stadium", division: "NL West", capacity: "56,000", city: "Los Angeles, CA", coordinates: [-118.2400, 34.0739] },
  { team: "San Diego Padres", stadium: "Petco Park", division: "NL West", capacity: "42,524", city: "San Diego, CA", coordinates: [-117.1570, 32.7076] },
  { team: "San Francisco Giants", stadium: "Oracle Park", division: "NL West", capacity: "41,915", city: "San Francisco, CA", coordinates: [-122.3893, 37.7786] },
];

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const US_STATES_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const CA_PROVINCES_URL = `${import.meta.env.BASE_URL}canada-provinces.geojson`;

interface RegionInfo {
  name: string;
  regionType: "country" | "us-state" | "ca-province";
  capital: string;
  population: string;
  area: string;
  currency?: string;
  language?: string;
  continent?: string;
  joined?: string;
  nickname?: string;
  flag?: string;
}

type RegionRecord = Record<string, RegionInfo>;

const COUNTRY_DATA: RegionRecord = {
  "004": { name: "Afghanistan", regionType: "country", capital: "Kabul", population: "40.1M", area: "652,864 km²", continent: "Asia", currency: "Afghan Afghani", language: "Dari, Pashto" },
  "008": { name: "Albania", regionType: "country", capital: "Tirana", population: "2.8M", area: "28,748 km²", continent: "Europe", currency: "Albanian Lek", language: "Albanian" },
  "012": { name: "Algeria", regionType: "country", capital: "Algiers", population: "44.6M", area: "2,381,741 km²", continent: "Africa", currency: "Algerian Dinar", language: "Arabic, Tamazight" },
  "024": { name: "Angola", regionType: "country", capital: "Luanda", population: "34.5M", area: "1,246,700 km²", continent: "Africa", currency: "Kwanza", language: "Portuguese" },
  "032": { name: "Argentina", regionType: "country", capital: "Buenos Aires", population: "45.8M", area: "2,780,400 km²", continent: "South America", currency: "Argentine Peso", language: "Spanish" },
  "036": { name: "Australia", regionType: "country", capital: "Canberra", population: "26.1M", area: "7,692,024 km²", continent: "Oceania", currency: "Australian Dollar", language: "English" },
  "040": { name: "Austria", regionType: "country", capital: "Vienna", population: "9.1M", area: "83,871 km²", continent: "Europe", currency: "Euro", language: "German" },
  "050": { name: "Bangladesh", regionType: "country", capital: "Dhaka", population: "168.1M", area: "147,570 km²", continent: "Asia", currency: "Bangladeshi Taka", language: "Bengali" },
  "056": { name: "Belgium", regionType: "country", capital: "Brussels", population: "11.6M", area: "30,528 km²", continent: "Europe", currency: "Euro", language: "Dutch, French, German" },
  "064": { name: "Bhutan", regionType: "country", capital: "Thimphu", population: "0.8M", area: "38,394 km²", continent: "Asia", currency: "Bhutanese Ngultrum", language: "Dzongkha" },
  "068": { name: "Bolivia", regionType: "country", capital: "Sucre", population: "12.1M", area: "1,098,581 km²", continent: "South America", currency: "Bolivian Boliviano", language: "Spanish" },
  "076": { name: "Brazil", regionType: "country", capital: "Brasília", population: "215.3M", area: "8,515,767 km²", continent: "South America", currency: "Brazilian Real", language: "Portuguese" },
  "100": { name: "Bulgaria", regionType: "country", capital: "Sofia", population: "6.5M", area: "110,879 km²", continent: "Europe", currency: "Bulgarian Lev", language: "Bulgarian" },
  "116": { name: "Cambodia", regionType: "country", capital: "Phnom Penh", population: "16.7M", area: "181,035 km²", continent: "Asia", currency: "Cambodian Riel", language: "Khmer" },
  "120": { name: "Cameroon", regionType: "country", capital: "Yaoundé", population: "27.2M", area: "475,442 km²", continent: "Africa", currency: "Central African CFA Franc", language: "French, English" },
  "152": { name: "Chile", regionType: "country", capital: "Santiago", population: "19.5M", area: "756,102 km²", continent: "South America", currency: "Chilean Peso", language: "Spanish" },
  "156": { name: "China", regionType: "country", capital: "Beijing", population: "1.4B", area: "9,596,960 km²", continent: "Asia", currency: "Chinese Yuan", language: "Mandarin Chinese" },
  "170": { name: "Colombia", regionType: "country", capital: "Bogotá", population: "51.9M", area: "1,141,748 km²", continent: "South America", currency: "Colombian Peso", language: "Spanish" },
  "178": { name: "Republic of the Congo", regionType: "country", capital: "Brazzaville", population: "5.8M", area: "342,000 km²", continent: "Africa", currency: "Central African CFA Franc", language: "French" },
  "180": { name: "DR Congo", regionType: "country", capital: "Kinshasa", population: "99.0M", area: "2,344,858 km²", continent: "Africa", currency: "Congolese Franc", language: "French" },
  "188": { name: "Costa Rica", regionType: "country", capital: "San José", population: "5.2M", area: "51,100 km²", continent: "North America", currency: "Costa Rican Colón", language: "Spanish" },
  "191": { name: "Croatia", regionType: "country", capital: "Zagreb", population: "3.9M", area: "56,594 km²", continent: "Europe", currency: "Euro", language: "Croatian" },
  "203": { name: "Czech Republic", regionType: "country", capital: "Prague", population: "10.9M", area: "78,866 km²", continent: "Europe", currency: "Czech Koruna", language: "Czech" },
  "208": { name: "Denmark", regionType: "country", capital: "Copenhagen", population: "5.9M", area: "43,094 km²", continent: "Europe", currency: "Danish Krone", language: "Danish" },
  "214": { name: "Dominican Republic", regionType: "country", capital: "Santo Domingo", population: "11.1M", area: "48,671 km²", continent: "North America", currency: "Dominican Peso", language: "Spanish" },
  "218": { name: "Ecuador", regionType: "country", capital: "Quito", population: "18.0M", area: "283,561 km²", continent: "South America", currency: "US Dollar", language: "Spanish" },
  "818": { name: "Egypt", regionType: "country", capital: "Cairo", population: "102.3M", area: "1,002,450 km²", continent: "Africa", currency: "Egyptian Pound", language: "Arabic" },
  "231": { name: "Ethiopia", regionType: "country", capital: "Addis Ababa", population: "120.8M", area: "1,104,300 km²", continent: "Africa", currency: "Ethiopian Birr", language: "Amharic" },
  "246": { name: "Finland", regionType: "country", capital: "Helsinki", population: "5.5M", area: "338,435 km²", continent: "Europe", currency: "Euro", language: "Finnish, Swedish" },
  "250": { name: "France", regionType: "country", capital: "Paris", population: "67.8M", area: "551,695 km²", continent: "Europe", currency: "Euro", language: "French" },
  "276": { name: "Germany", regionType: "country", capital: "Berlin", population: "83.8M", area: "357,114 km²", continent: "Europe", currency: "Euro", language: "German" },
  "288": { name: "Ghana", regionType: "country", capital: "Accra", population: "32.8M", area: "238,533 km²", continent: "Africa", currency: "Ghanaian Cedi", language: "English" },
  "300": { name: "Greece", regionType: "country", capital: "Athens", population: "10.4M", area: "131,957 km²", continent: "Europe", currency: "Euro", language: "Greek" },
  "320": { name: "Guatemala", regionType: "country", capital: "Guatemala City", population: "17.8M", area: "108,889 km²", continent: "North America", currency: "Guatemalan Quetzal", language: "Spanish" },
  "348": { name: "Hungary", regionType: "country", capital: "Budapest", population: "9.7M", area: "93,028 km²", continent: "Europe", currency: "Hungarian Forint", language: "Hungarian" },
  "356": { name: "India", regionType: "country", capital: "New Delhi", population: "1.4B", area: "3,287,263 km²", continent: "Asia", currency: "Indian Rupee", language: "Hindi, English" },
  "360": { name: "Indonesia", regionType: "country", capital: "Jakarta", population: "273.8M", area: "1,904,569 km²", continent: "Asia", currency: "Indonesian Rupiah", language: "Indonesian" },
  "364": { name: "Iran", regionType: "country", capital: "Tehran", population: "85.9M", area: "1,648,195 km²", continent: "Asia", currency: "Iranian Rial", language: "Persian" },
  "368": { name: "Iraq", regionType: "country", capital: "Baghdad", population: "42.2M", area: "438,317 km²", continent: "Asia", currency: "Iraqi Dinar", language: "Arabic, Kurdish" },
  "372": { name: "Ireland", regionType: "country", capital: "Dublin", population: "5.1M", area: "70,273 km²", continent: "Europe", currency: "Euro", language: "English, Irish" },
  "376": { name: "Israel", regionType: "country", capital: "Jerusalem", population: "9.5M", area: "20,770 km²", continent: "Asia", currency: "Israeli New Shekel", language: "Hebrew, Arabic" },
  "380": { name: "Italy", regionType: "country", capital: "Rome", population: "60.0M", area: "301,340 km²", continent: "Europe", currency: "Euro", language: "Italian" },
  "392": { name: "Japan", regionType: "country", capital: "Tokyo", population: "125.7M", area: "377,975 km²", continent: "Asia", currency: "Japanese Yen", language: "Japanese" },
  "400": { name: "Jordan", regionType: "country", capital: "Amman", population: "10.3M", area: "89,342 km²", continent: "Asia", currency: "Jordanian Dinar", language: "Arabic" },
  "398": { name: "Kazakhstan", regionType: "country", capital: "Astana", population: "19.2M", area: "2,724,900 km²", continent: "Asia", currency: "Kazakhstani Tenge", language: "Kazakh, Russian" },
  "404": { name: "Kenya", regionType: "country", capital: "Nairobi", population: "54.0M", area: "580,367 km²", continent: "Africa", currency: "Kenyan Shilling", language: "Swahili, English" },
  "408": { name: "North Korea", regionType: "country", capital: "Pyongyang", population: "25.9M", area: "120,538 km²", continent: "Asia", currency: "North Korean Won", language: "Korean" },
  "410": { name: "South Korea", regionType: "country", capital: "Seoul", population: "51.7M", area: "100,210 km²", continent: "Asia", currency: "South Korean Won", language: "Korean" },
  "418": { name: "Laos", regionType: "country", capital: "Vientiane", population: "7.4M", area: "236,800 km²", continent: "Asia", currency: "Lao Kip", language: "Lao" },
  "434": { name: "Libya", regionType: "country", capital: "Tripoli", population: "7.0M", area: "1,759,541 km²", continent: "Africa", currency: "Libyan Dinar", language: "Arabic" },
  "484": { name: "Mexico", regionType: "country", capital: "Mexico City", population: "130.3M", area: "1,964,375 km²", continent: "North America", currency: "Mexican Peso", language: "Spanish" },
  "496": { name: "Mongolia", regionType: "country", capital: "Ulaanbaatar", population: "3.4M", area: "1,564,116 km²", continent: "Asia", currency: "Mongolian Tögrög", language: "Mongolian" },
  "504": { name: "Morocco", regionType: "country", capital: "Rabat", population: "37.5M", area: "446,550 km²", continent: "Africa", currency: "Moroccan Dirham", language: "Arabic, Tamazight" },
  "508": { name: "Mozambique", regionType: "country", capital: "Maputo", population: "32.8M", area: "801,590 km²", continent: "Africa", currency: "Mozambican Metical", language: "Portuguese" },
  "524": { name: "Nepal", regionType: "country", capital: "Kathmandu", population: "29.7M", area: "147,181 km²", continent: "Asia", currency: "Nepalese Rupee", language: "Nepali" },
  "528": { name: "Netherlands", regionType: "country", capital: "Amsterdam", population: "17.7M", area: "41,543 km²", continent: "Europe", currency: "Euro", language: "Dutch" },
  "554": { name: "New Zealand", regionType: "country", capital: "Wellington", population: "5.1M", area: "270,467 km²", continent: "Oceania", currency: "New Zealand Dollar", language: "English, Māori" },
  "562": { name: "Niger", regionType: "country", capital: "Niamey", population: "25.2M", area: "1,267,000 km²", continent: "Africa", currency: "West African CFA Franc", language: "French" },
  "566": { name: "Nigeria", regionType: "country", capital: "Abuja", population: "218.5M", area: "923,768 km²", continent: "Africa", currency: "Nigerian Naira", language: "English" },
  "578": { name: "Norway", regionType: "country", capital: "Oslo", population: "5.4M", area: "385,207 km²", continent: "Europe", currency: "Norwegian Krone", language: "Norwegian" },
  "586": { name: "Pakistan", regionType: "country", capital: "Islamabad", population: "231.4M", area: "881,913 km²", continent: "Asia", currency: "Pakistani Rupee", language: "Urdu, English" },
  "600": { name: "Paraguay", regionType: "country", capital: "Asunción", population: "7.4M", area: "406,752 km²", continent: "South America", currency: "Paraguayan Guaraní", language: "Spanish, Guaraní" },
  "604": { name: "Peru", regionType: "country", capital: "Lima", population: "33.4M", area: "1,285,216 km²", continent: "South America", currency: "Peruvian Sol", language: "Spanish" },
  "608": { name: "Philippines", regionType: "country", capital: "Manila", population: "114.1M", area: "300,000 km²", continent: "Asia", currency: "Philippine Peso", language: "Filipino, English" },
  "616": { name: "Poland", regionType: "country", capital: "Warsaw", population: "37.8M", area: "312,696 km²", continent: "Europe", currency: "Polish Złoty", language: "Polish" },
  "620": { name: "Portugal", regionType: "country", capital: "Lisbon", population: "10.3M", area: "92,212 km²", continent: "Europe", currency: "Euro", language: "Portuguese" },
  "642": { name: "Romania", regionType: "country", capital: "Bucharest", population: "19.0M", area: "238,397 km²", continent: "Europe", currency: "Romanian Leu", language: "Romanian" },
  "643": { name: "Russia", regionType: "country", capital: "Moscow", population: "145.5M", area: "17,098,242 km²", continent: "Europe/Asia", currency: "Russian Ruble", language: "Russian" },
  "682": { name: "Saudi Arabia", regionType: "country", capital: "Riyadh", population: "35.6M", area: "2,149,690 km²", continent: "Asia", currency: "Saudi Riyal", language: "Arabic" },
  "686": { name: "Senegal", regionType: "country", capital: "Dakar", population: "17.8M", area: "196,722 km²", continent: "Africa", currency: "West African CFA Franc", language: "French" },
  "706": { name: "Somalia", regionType: "country", capital: "Mogadishu", population: "17.1M", area: "637,657 km²", continent: "Africa", currency: "Somali Shilling", language: "Somali, Arabic" },
  "710": { name: "South Africa", regionType: "country", capital: "Pretoria", population: "60.0M", area: "1,221,037 km²", continent: "Africa", currency: "South African Rand", language: "11 official languages" },
  "724": { name: "Spain", regionType: "country", capital: "Madrid", population: "47.4M", area: "505,990 km²", continent: "Europe", currency: "Euro", language: "Spanish" },
  "729": { name: "Sudan", regionType: "country", capital: "Khartoum", population: "44.9M", area: "1,861,484 km²", continent: "Africa", currency: "Sudanese Pound", language: "Arabic, English" },
  "752": { name: "Sweden", regionType: "country", capital: "Stockholm", population: "10.5M", area: "450,295 km²", continent: "Europe", currency: "Swedish Krona", language: "Swedish" },
  "756": { name: "Switzerland", regionType: "country", capital: "Bern", population: "8.7M", area: "41,285 km²", continent: "Europe", currency: "Swiss Franc", language: "German, French, Italian, Romansh" },
  "760": { name: "Syria", regionType: "country", capital: "Damascus", population: "21.3M", area: "185,180 km²", continent: "Asia", currency: "Syrian Pound", language: "Arabic" },
  "762": { name: "Tajikistan", regionType: "country", capital: "Dushanbe", population: "10.0M", area: "143,100 km²", continent: "Asia", currency: "Tajikistani Somoni", language: "Tajik" },
  "834": { name: "Tanzania", regionType: "country", capital: "Dodoma", population: "63.7M", area: "945,087 km²", continent: "Africa", currency: "Tanzanian Shilling", language: "Swahili, English" },
  "764": { name: "Thailand", regionType: "country", capital: "Bangkok", population: "71.6M", area: "513,120 km²", continent: "Asia", currency: "Thai Baht", language: "Thai" },
  "788": { name: "Tunisia", regionType: "country", capital: "Tunis", population: "12.1M", area: "163,610 km²", continent: "Africa", currency: "Tunisian Dinar", language: "Arabic" },
  "792": { name: "Turkey", regionType: "country", capital: "Ankara", population: "84.7M", area: "783,562 km²", continent: "Asia/Europe", currency: "Turkish Lira", language: "Turkish" },
  "800": { name: "Uganda", regionType: "country", capital: "Kampala", population: "47.1M", area: "241,550 km²", continent: "Africa", currency: "Ugandan Shilling", language: "English, Swahili" },
  "804": { name: "Ukraine", regionType: "country", capital: "Kyiv", population: "44.0M", area: "603,550 km²", continent: "Europe", currency: "Ukrainian Hryvnia", language: "Ukrainian" },
  "784": { name: "United Arab Emirates", regionType: "country", capital: "Abu Dhabi", population: "10.0M", area: "83,600 km²", continent: "Asia", currency: "UAE Dirham", language: "Arabic" },
  "826": { name: "United Kingdom", regionType: "country", capital: "London", population: "67.1M", area: "242,495 km²", continent: "Europe", currency: "British Pound", language: "English" },
  "858": { name: "Uruguay", regionType: "country", capital: "Montevideo", population: "3.5M", area: "176,215 km²", continent: "South America", currency: "Uruguayan Peso", language: "Spanish" },
  "860": { name: "Uzbekistan", regionType: "country", capital: "Tashkent", population: "35.3M", area: "448,978 km²", continent: "Asia", currency: "Uzbekistani Som", language: "Uzbek" },
  "862": { name: "Venezuela", regionType: "country", capital: "Caracas", population: "28.7M", area: "912,050 km²", continent: "South America", currency: "Venezuelan Bolívar", language: "Spanish" },
  "704": { name: "Vietnam", regionType: "country", capital: "Hanoi", population: "97.3M", area: "331,212 km²", continent: "Asia", currency: "Vietnamese Dong", language: "Vietnamese" },
  "887": { name: "Yemen", regionType: "country", capital: "Sana'a", population: "33.7M", area: "527,968 km²", continent: "Asia", currency: "Yemeni Rial", language: "Arabic" },
  "894": { name: "Zambia", regionType: "country", capital: "Lusaka", population: "19.5M", area: "752,618 km²", continent: "Africa", currency: "Zambian Kwacha", language: "Zambian Kwacha" },
  "716": { name: "Zimbabwe", regionType: "country", capital: "Harare", population: "15.1M", area: "390,757 km²", continent: "Africa", currency: "Zimbabwe Gold", language: "English and 15 others" },
};

// US States by FIPS code (zero-padded 2-digit string)
const US_STATE_DATA: RegionRecord = {
  "01": { name: "Alabama", regionType: "us-state", capital: "Montgomery", population: "5.1M", area: "135,767 km²", joined: "1819", nickname: "The Yellowhammer State" },
  "02": { name: "Alaska", regionType: "us-state", capital: "Juneau", population: "0.7M", area: "1,723,337 km²", joined: "1959", nickname: "The Last Frontier" },
  "04": { name: "Arizona", regionType: "us-state", capital: "Phoenix", population: "7.4M", area: "295,234 km²", joined: "1912", nickname: "The Grand Canyon State" },
  "05": { name: "Arkansas", regionType: "us-state", capital: "Little Rock", population: "3.0M", area: "137,732 km²", joined: "1836", nickname: "The Natural State" },
  "06": { name: "California", regionType: "us-state", capital: "Sacramento", population: "39.0M", area: "423,970 km²", joined: "1850", nickname: "The Golden State" },
  "08": { name: "Colorado", regionType: "us-state", capital: "Denver", population: "5.8M", area: "269,601 km²", joined: "1876", nickname: "The Centennial State" },
  "09": { name: "Connecticut", regionType: "us-state", capital: "Hartford", population: "3.6M", area: "14,357 km²", joined: "1788", nickname: "The Constitution State" },
  "10": { name: "Delaware", regionType: "us-state", capital: "Dover", population: "1.0M", area: "6,446 km²", joined: "1787", nickname: "The First State" },
  "11": { name: "District of Columbia", regionType: "us-state", capital: "Washington D.C.", population: "0.7M", area: "177 km²", joined: "1791", nickname: "The Nation's Capital" },
  "12": { name: "Florida", regionType: "us-state", capital: "Tallahassee", population: "22.6M", area: "170,312 km²", joined: "1845", nickname: "The Sunshine State" },
  "13": { name: "Georgia", regionType: "us-state", capital: "Atlanta", population: "10.9M", area: "153,910 km²", joined: "1788", nickname: "The Peach State" },
  "15": { name: "Hawaii", regionType: "us-state", capital: "Honolulu", population: "1.4M", area: "28,313 km²", joined: "1959", nickname: "The Aloha State" },
  "16": { name: "Idaho", regionType: "us-state", capital: "Boise", population: "1.9M", area: "216,443 km²", joined: "1890", nickname: "The Gem State" },
  "17": { name: "Illinois", regionType: "us-state", capital: "Springfield", population: "12.6M", area: "149,995 km²", joined: "1818", nickname: "The Prairie State" },
  "18": { name: "Indiana", regionType: "us-state", capital: "Indianapolis", population: "6.8M", area: "94,326 km²", joined: "1816", nickname: "The Hoosier State" },
  "19": { name: "Iowa", regionType: "us-state", capital: "Des Moines", population: "3.2M", area: "145,746 km²", joined: "1846", nickname: "The Hawkeye State" },
  "20": { name: "Kansas", regionType: "us-state", capital: "Topeka", population: "2.9M", area: "213,100 km²", joined: "1861", nickname: "The Sunflower State" },
  "21": { name: "Kentucky", regionType: "us-state", capital: "Frankfort", population: "4.5M", area: "104,656 km²", joined: "1792", nickname: "The Bluegrass State" },
  "22": { name: "Louisiana", regionType: "us-state", capital: "Baton Rouge", population: "4.6M", area: "135,659 km²", joined: "1812", nickname: "The Pelican State" },
  "23": { name: "Maine", regionType: "us-state", capital: "Augusta", population: "1.4M", area: "91,633 km²", joined: "1820", nickname: "The Pine Tree State" },
  "24": { name: "Maryland", regionType: "us-state", capital: "Annapolis", population: "6.2M", area: "32,133 km²", joined: "1788", nickname: "The Old Line State" },
  "25": { name: "Massachusetts", regionType: "us-state", capital: "Boston", population: "7.0M", area: "27,336 km²", joined: "1788", nickname: "The Bay State" },
  "26": { name: "Michigan", regionType: "us-state", capital: "Lansing", population: "10.0M", area: "250,487 km²", joined: "1837", nickname: "The Great Lakes State" },
  "27": { name: "Minnesota", regionType: "us-state", capital: "Saint Paul", population: "5.7M", area: "225,163 km²", joined: "1858", nickname: "The North Star State" },
  "28": { name: "Mississippi", regionType: "us-state", capital: "Jackson", population: "2.9M", area: "125,438 km²", joined: "1817", nickname: "The Magnolia State" },
  "29": { name: "Missouri", regionType: "us-state", capital: "Jefferson City", population: "6.2M", area: "180,540 km²", joined: "1821", nickname: "The Show-Me State" },
  "30": { name: "Montana", regionType: "us-state", capital: "Helena", population: "1.1M", area: "380,831 km²", joined: "1889", nickname: "Big Sky Country" },
  "31": { name: "Nebraska", regionType: "us-state", capital: "Lincoln", population: "1.9M", area: "200,330 km²", joined: "1867", nickname: "The Cornhusker State" },
  "32": { name: "Nevada", regionType: "us-state", capital: "Carson City", population: "3.1M", area: "286,352 km²", joined: "1864", nickname: "The Silver State" },
  "33": { name: "New Hampshire", regionType: "us-state", capital: "Concord", population: "1.4M", area: "24,214 km²", joined: "1788", nickname: "The Granite State" },
  "34": { name: "New Jersey", regionType: "us-state", capital: "Trenton", population: "9.3M", area: "22,591 km²", joined: "1787", nickname: "The Garden State" },
  "35": { name: "New Mexico", regionType: "us-state", capital: "Santa Fe", population: "2.1M", area: "314,917 km²", joined: "1912", nickname: "Land of Enchantment" },
  "36": { name: "New York", regionType: "us-state", capital: "Albany", population: "20.2M", area: "141,297 km²", joined: "1788", nickname: "The Empire State" },
  "37": { name: "North Carolina", regionType: "us-state", capital: "Raleigh", population: "10.7M", area: "139,391 km²", joined: "1789", nickname: "The Tar Heel State" },
  "38": { name: "North Dakota", regionType: "us-state", capital: "Bismarck", population: "0.8M", area: "183,108 km²", joined: "1889", nickname: "The Peace Garden State" },
  "39": { name: "Ohio", regionType: "us-state", capital: "Columbus", population: "11.8M", area: "116,098 km²", joined: "1803", nickname: "The Buckeye State" },
  "40": { name: "Oklahoma", regionType: "us-state", capital: "Oklahoma City", population: "4.0M", area: "181,037 km²", joined: "1907", nickname: "The Sooner State" },
  "41": { name: "Oregon", regionType: "us-state", capital: "Salem", population: "4.2M", area: "254,800 km²", joined: "1859", nickname: "The Beaver State" },
  "42": { name: "Pennsylvania", regionType: "us-state", capital: "Harrisburg", population: "13.0M", area: "119,279 km²", joined: "1787", nickname: "The Keystone State" },
  "44": { name: "Rhode Island", regionType: "us-state", capital: "Providence", population: "1.1M", area: "4,001 km²", joined: "1790", nickname: "The Ocean State" },
  "45": { name: "South Carolina", regionType: "us-state", capital: "Columbia", population: "5.3M", area: "82,933 km²", joined: "1788", nickname: "The Palmetto State" },
  "46": { name: "South Dakota", regionType: "us-state", capital: "Pierre", population: "0.9M", area: "199,729 km²", joined: "1889", nickname: "The Mount Rushmore State" },
  "47": { name: "Tennessee", regionType: "us-state", capital: "Nashville", population: "7.0M", area: "109,153 km²", joined: "1796", nickname: "The Volunteer State" },
  "48": { name: "Texas", regionType: "us-state", capital: "Austin", population: "30.0M", area: "695,662 km²", joined: "1845", nickname: "The Lone Star State" },
  "49": { name: "Utah", regionType: "us-state", capital: "Salt Lake City", population: "3.4M", area: "219,882 km²", joined: "1896", nickname: "The Beehive State" },
  "50": { name: "Vermont", regionType: "us-state", capital: "Montpelier", population: "0.6M", area: "24,906 km²", joined: "1791", nickname: "The Green Mountain State" },
  "51": { name: "Virginia", regionType: "us-state", capital: "Richmond", population: "8.7M", area: "110,787 km²", joined: "1788", nickname: "The Old Dominion" },
  "53": { name: "Washington", regionType: "us-state", capital: "Olympia", population: "7.8M", area: "184,661 km²", joined: "1889", nickname: "The Evergreen State" },
  "54": { name: "West Virginia", regionType: "us-state", capital: "Charleston", population: "1.8M", area: "62,756 km²", joined: "1863", nickname: "The Mountain State" },
  "55": { name: "Wisconsin", regionType: "us-state", capital: "Madison", population: "5.9M", area: "169,635 km²", joined: "1848", nickname: "The Badger State" },
  "56": { name: "Wyoming", regionType: "us-state", capital: "Cheyenne", population: "0.6M", area: "253,335 km²", joined: "1890", nickname: "The Equality State" },
};

// Canadian provinces/territories — keyed by name as it appears in the TopoJSON
const CA_PROVINCE_DATA: Record<string, RegionInfo> = {
  "Alberta": { name: "Alberta", regionType: "ca-province", capital: "Edmonton", population: "4.6M", area: "661,848 km²", joined: "1905", nickname: "Wild Rose Country" },
  "British Columbia": { name: "British Columbia", regionType: "ca-province", capital: "Victoria", population: "5.4M", area: "944,735 km²", joined: "1871", nickname: "Beautiful British Columbia" },
  "Manitoba": { name: "Manitoba", regionType: "ca-province", capital: "Winnipeg", population: "1.4M", area: "647,797 km²", joined: "1870", nickname: "The Keystone Province" },
  "New Brunswick": { name: "New Brunswick", regionType: "ca-province", capital: "Fredericton", population: "0.8M", area: "72,908 km²", joined: "1867", nickname: "The Picture Province" },
  "Newfoundland and Labrador": { name: "Newfoundland and Labrador", regionType: "ca-province", capital: "St. John's", population: "0.5M", area: "405,212 km²", joined: "1949", nickname: "The Rock" },
  "Northwest Territories": { name: "Northwest Territories", regionType: "ca-province", capital: "Yellowknife", population: "0.045M", area: "1,346,106 km²", joined: "1870", nickname: "Spectacular NWT" },
  "Nova Scotia": { name: "Nova Scotia", regionType: "ca-province", capital: "Halifax", population: "1.0M", area: "55,284 km²", joined: "1867", nickname: "Canada's Ocean Playground" },
  "Nunavut": { name: "Nunavut", regionType: "ca-province", capital: "Iqaluit", population: "0.04M", area: "2,093,190 km²", joined: "1999", nickname: "Our Land" },
  "Ontario": { name: "Ontario", regionType: "ca-province", capital: "Toronto", population: "14.9M", area: "1,076,395 km²", joined: "1867", nickname: "Yours to Discover" },
  "Prince Edward Island": { name: "Prince Edward Island", regionType: "ca-province", capital: "Charlottetown", population: "0.17M", area: "5,660 km²", joined: "1873", nickname: "The Garden Province" },
  "Quebec": { name: "Quebec", regionType: "ca-province", capital: "Quebec City", population: "8.8M", area: "1,542,056 km²", joined: "1867", nickname: "La Belle Province" },
  "Saskatchewan": { name: "Saskatchewan", regionType: "ca-province", capital: "Regina", population: "1.2M", area: "651,036 km²", joined: "1905", nickname: "The Land of Living Skies" },
  "Yukon Territory": { name: "Yukon Territory", regionType: "ca-province", capital: "Whitehorse", population: "0.04M", area: "482,443 km²", joined: "1898", nickname: "Canada's True North" },
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

const US_STATE_COLOR = "#ef4444";
const US_STATE_HOVER_COLOR = "#dc2626";
const CA_PROVINCE_COLOR = "#f97316";
const CA_PROVINCE_HOVER_COLOR = "#ea580c";
const SELECTED_COLOR = "#facc15";

function getCountryFill(numericCode: string, isSelected: boolean, isHovered: boolean) {
  if (isSelected) return SELECTED_COLOR;
  const data = COUNTRY_DATA[numericCode];
  if (data) {
    const base = CONTINENT_COLORS[data.continent ?? ""] ?? "#64748b";
    return isHovered ? base : base + "cc";
  }
  return isHovered ? "#64748b" : "#475569";
}

function getStateFill(isSelected: boolean, isHovered: boolean) {
  if (isSelected) return SELECTED_COLOR;
  return isHovered ? US_STATE_HOVER_COLOR : US_STATE_COLOR + "cc";
}

function getProvinceFill(isSelected: boolean, isHovered: boolean) {
  if (isSelected) return SELECTED_COLOR;
  return isHovered ? CA_PROVINCE_HOVER_COLOR : CA_PROVINCE_COLOR + "cc";
}

const DIVISION_COLORS: Record<string, string> = {
  "AL East": "#1d4ed8",
  "AL Central": "#2563eb",
  "AL West": "#3b82f6",
  "NL East": "#1e40af",
  "NL Central": "#1e3a8a",
  "NL West": "#1d4ed8",
};

export default function App() {
  const [selected, setSelected] = useState<{ key: string; info: RegionInfo } | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<StadiumInfo | null>(null);
  const [hoveredStadium, setHoveredStadium] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipName, setTooltipName] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);

  const handleCountryClick = useCallback((geo: { id: string }) => {
    const code = geo.id;
    const info = COUNTRY_DATA[code];
    setSelectedStadium(null);
    if (info) setSelected({ key: `country-${code}`, info });
    else setSelected(null);
  }, []);

  const handleStateClick = useCallback((geo: { id: string }) => {
    const fips = String(geo.id).padStart(2, "0");
    const info = US_STATE_DATA[fips];
    setSelectedStadium(null);
    if (info) setSelected({ key: `state-${fips}`, info });
  }, []);

  const handleProvinceClick = useCallback((geo: { properties: Record<string, string> }) => {
    const name = geo.properties.name || geo.properties.NAME_1 || geo.properties.NAME;
    const info = CA_PROVINCE_DATA[name];
    setSelectedStadium(null);
    if (info) setSelected({ key: `province-${name}`, info });
  }, []);

  const handleStadiumClick = useCallback((stadium: StadiumInfo) => {
    setSelected(null);
    setSelectedStadium(stadium);
  }, []);

  const handleMouseEnter = useCallback((name: string, evt: React.MouseEvent) => {
    setHovered(name);
    setTooltipName(name);
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  }, []);

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    setTooltipName("");
  }, []);

  const regionTypeLabel = (type: RegionInfo["regionType"]) => {
    if (type === "us-state") return "U.S. State";
    if (type === "ca-province") return "Canadian Province / Territory";
    return selected?.info.continent ?? "Country";
  };

  const badgeColor = (info: RegionInfo) => {
    if (info.regionType === "us-state") return US_STATE_COLOR;
    if (info.regionType === "ca-province") return CA_PROVINCE_COLOR;
    return CONTINENT_COLORS[info.continent ?? ""] ?? "#64748b";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">World Map</h1>
          <p className="text-sm text-slate-400 mt-0.5">Click any country, U.S. state, Canadian province, or MLB stadium to explore</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setZoom(z => Math.min(z * 1.5, 12))} className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium">+</button>
          <button onClick={() => setZoom(z => Math.max(z / 1.5, 0.5))} className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium">−</button>
          <button onClick={() => { setZoom(1); setCenter([0, 20]); setSelected(null); setSelectedStadium(null); }} className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium">Reset</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative overflow-hidden bg-slate-950">
          <ComposableMap
            projection="geoMercator"
            style={{ width: "100%", height: "100%" }}
            projectionConfig={{ scale: 130, center: [0, 20] }}
          >
            <ZoomableGroup zoom={zoom} center={center} onMoveEnd={({ zoom: z, coordinates }) => { setZoom(z); setCenter(coordinates); }}>
              {/* World countries — excluding US (840) and Canada (124) */}
              <Geographies geography={WORLD_URL}>
                {({ geographies }) =>
                  geographies
                    .filter(geo => geo.id !== "840" && geo.id !== "124")
                    .map((geo) => {
                      const key = `country-${geo.id}`;
                      const isSelected = selected?.key === key;
                      const countryName = COUNTRY_DATA[geo.id]?.name ?? "";
                      const isHovered = hovered === countryName;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleCountryClick(geo)}
                          onMouseEnter={(evt) => handleMouseEnter(countryName || "Unknown territory", evt)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            default: { fill: getCountryFill(geo.id, isSelected, false), stroke: "#1e293b", strokeWidth: 0.5, outline: "none", cursor: "pointer", transition: "fill 0.1s" },
                            hover: { fill: getCountryFill(geo.id, isSelected, true), stroke: "#334155", strokeWidth: 0.7, outline: "none", cursor: "pointer" },
                            pressed: { fill: SELECTED_COLOR, outline: "none" },
                          }}
                        />
                      );
                    })
                }
              </Geographies>

              {/* US States */}
              <Geographies geography={US_STATES_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const fips = String(geo.id).padStart(2, "0");
                    const key = `state-${fips}`;
                    const isSelected = selected?.key === key;
                    const stateName = US_STATE_DATA[fips]?.name ?? "Unknown State";
                    const isHovered = hovered === stateName;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleStateClick(geo)}
                        onMouseEnter={(evt) => handleMouseEnter(stateName, evt)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: { fill: getStateFill(isSelected, false), stroke: "#1e293b", strokeWidth: 0.4, outline: "none", cursor: "pointer", transition: "fill 0.1s" },
                          hover: { fill: getStateFill(isSelected, true), stroke: "#334155", strokeWidth: 0.6, outline: "none", cursor: "pointer" },
                          pressed: { fill: SELECTED_COLOR, outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Canadian Provinces */}
              <Geographies geography={CA_PROVINCES_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name || geo.properties.NAME_1 || geo.properties.NAME || "";
                    const key = `province-${name}`;
                    const isSelected = selected?.key === key;
                    const isHovered = hovered === name;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleProvinceClick(geo)}
                        onMouseEnter={(evt) => handleMouseEnter(name || "Canadian Province", evt)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: { fill: getProvinceFill(isSelected, false), stroke: "#1e293b", strokeWidth: 0.4, outline: "none", cursor: "pointer", transition: "fill 0.1s" },
                          hover: { fill: getProvinceFill(isSelected, true), stroke: "#334155", strokeWidth: 0.6, outline: "none", cursor: "pointer" },
                          pressed: { fill: SELECTED_COLOR, outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              {/* MLB Stadium Markers */}
              {MLB_STADIUMS.map((stadium) => {
                const isSelected = selectedStadium?.team === stadium.team;
                const isHov = hoveredStadium === stadium.team;
                const s = 1 / zoom;
                return (
                  <Marker key={stadium.team} coordinates={stadium.coordinates}>
                    <g
                      transform={`scale(${s})`}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => { e.stopPropagation(); handleStadiumClick(stadium); }}
                      onMouseEnter={(e) => { setHoveredStadium(stadium.team); setTooltipName(stadium.team); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
                      onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => { setHoveredStadium(null); setTooltipName(""); }}
                    >
                      {/* Flag pole */}
                      <line x1="0" y1="0" x2="0" y2="-20" stroke={isSelected ? "#facc15" : "#93c5fd"} strokeWidth={isHov || isSelected ? 2 : 1.5} />
                      {/* Flag body */}
                      <polygon
                        points="0,-20 12,-16 0,-12"
                        fill={isSelected ? "#facc15" : isHov ? "#60a5fa" : "#2563eb"}
                        stroke={isSelected ? "#f59e0b" : "#1d4ed8"}
                        strokeWidth="0.5"
                      />
                      {/* Base dot */}
                      <circle r={isHov || isSelected ? 3.5 : 2.5} fill={isSelected ? "#facc15" : "#1d4ed8"} stroke="#0f172a" strokeWidth="0.8" />
                    </g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {(hovered || hoveredStadium) && tooltipName && (
            <div
              className="fixed z-50 pointer-events-none bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg shadow-xl border border-slate-600 font-medium whitespace-nowrap"
              style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 36 }}
            >
              {tooltipName}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col overflow-y-auto">
          {selectedStadium ? (
            <div className="p-6 flex-1">
              <button onClick={() => setSelectedStadium(null)} className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
                ← Back
              </button>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 text-white bg-blue-700">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="5" y1="10" x2="5" y2="2" stroke="white" strokeWidth="1.5"/>
                  <polygon points="5,2 10,4 5,6" fill="white"/>
                </svg>
                MLB Stadium
              </div>
              <h2 className="text-xl font-bold text-white mb-0.5">{selectedStadium.team}</h2>
              <p className="text-slate-400 text-sm mb-5">{selectedStadium.city}</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                  <span className="text-xl">🏟️</span>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Stadium</p>
                    <p className="text-sm font-medium text-white mt-0.5">{selectedStadium.stadium}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                  <span className="text-xl">⚾</span>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Division</p>
                    <p className="text-sm font-medium text-white mt-0.5">{selectedStadium.division}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                  <span className="text-xl">💺</span>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Capacity</p>
                    <p className="text-sm font-medium text-white mt-0.5">{selectedStadium.capacity} seats</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Location</p>
                    <p className="text-sm font-medium text-white mt-0.5">{selectedStadium.city}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Other Teams in {selectedStadium.division}</p>
                <div className="space-y-2">
                  {MLB_STADIUMS
                    .filter(s => s.division === selectedStadium.division && s.team !== selectedStadium.team)
                    .map(s => (
                      <button
                        key={s.team}
                        onClick={() => setSelectedStadium(s)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 transition-colors text-sm text-slate-300 hover:text-white"
                      >
                        {s.team}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ) : selected ? (
            <div className="p-6 flex-1">
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
                ← Back
              </button>
              <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3 text-white" style={{ backgroundColor: badgeColor(selected.info) }}>
                {regionTypeLabel(selected.info.regionType)}
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{selected.info.name}</h2>
              {selected.info.nickname && (
                <p className="text-slate-400 text-sm italic mb-5">"{selected.info.nickname}"</p>
              )}
              {!selected.info.nickname && <div className="mb-5" />}

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Capital</p>
                    <p className="text-sm font-medium text-white mt-0.5">{selected.info.capital}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Population</p>
                    <p className="text-sm font-medium text-white mt-0.5">{selected.info.population}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                  <span className="text-xl">📏</span>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Area</p>
                    <p className="text-sm font-medium text-white mt-0.5">{selected.info.area}</p>
                  </div>
                </div>
                {selected.info.joined && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                    <span className="text-xl">📅</span>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        {selected.info.regionType === "us-state" ? "Year of Statehood" : "Year Joined Confederation"}
                      </p>
                      <p className="text-sm font-medium text-white mt-0.5">{selected.info.joined}</p>
                    </div>
                  </div>
                )}
                {selected.info.currency && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Currency</p>
                      <p className="text-sm font-medium text-white mt-0.5">{selected.info.currency}</p>
                    </div>
                  </div>
                )}
                {selected.info.language && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                    <span className="text-xl">🗣️</span>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Language</p>
                      <p className="text-sm font-medium text-white mt-0.5">{selected.info.language}</p>
                    </div>
                  </div>
                )}
                {selected.info.regionType !== "country" && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60">
                    <span className="text-xl">🌎</span>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Country</p>
                      <p className="text-sm font-medium text-white mt-0.5">{selected.info.regionType === "us-state" ? "United States" : "Canada"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1">
              <h2 className="text-lg font-semibold text-white mb-1">Explore the World</h2>
              <p className="text-slate-400 text-sm mb-6">Click any region on the map to see its details.</p>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Legend</h3>
                <div className="space-y-2">
                  {[
                    { label: "Africa", color: "#f59e0b" },
                    { label: "Asia", color: "#10b981" },
                    { label: "Europe", color: "#3b82f6" },
                    { label: "North America", color: "#ef4444" },
                    { label: "South America", color: "#8b5cf6" },
                    { label: "Oceania", color: "#06b6d4" },
                    { label: "U.S. States", color: US_STATE_COLOR },
                    { label: "Canadian Provinces", color: CA_PROVINCE_COLOR },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm text-slate-300">{label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="-2 -14 14 14" fill="none" className="flex-shrink-0">
                      <line x1="0" y1="0" x2="0" y2="-12" stroke="#93c5fd" strokeWidth="1.5"/>
                      <polygon points="0,-12 8,-9 0,-6" fill="#2563eb"/>
                      <circle cy="0" r="2.5" fill="#1d4ed8"/>
                    </svg>
                    <span className="text-sm text-slate-300">MLB Stadium</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-slate-800/60 text-center">
                    <p className="text-xl font-bold text-white">{Object.keys(COUNTRY_DATA).length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Countries</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/60 text-center">
                    <p className="text-xl font-bold text-white">51</p>
                    <p className="text-xs text-slate-400 mt-0.5">US States</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/60 text-center">
                    <p className="text-xl font-bold text-white">13</p>
                    <p className="text-xs text-slate-400 mt-0.5">CA Provinces</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/60 text-center">
                    <p className="text-xl font-bold text-white">30</p>
                    <p className="text-xs text-slate-400 mt-0.5">MLB Stadiums</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Controls</h3>
                <div className="space-y-1.5 text-sm text-slate-400">
                  <p>• Scroll to zoom in/out</p>
                  <p>• Drag to pan the map</p>
                  <p>• Click any region to explore</p>
                  <p>• Use + / − buttons to zoom</p>
                  <p>• Zoom into North America to click individual US states or Canadian provinces</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

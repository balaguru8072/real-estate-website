// "use client"
// import React from 'react'
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

// function GoogleAddress() {
//     return (
//         <div>
//             <GooglePlacesAutocomplete
//                 apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
//                 selectProps={{
//                     placeholder: "Search Properly Address",
//                     isClearable: true,
//                     className: "w-full",
//                     onChange: (place) =>{
//                         console.log(place)
//                     }
//                 }}
//             />
//         </div>
//     )
// }

// export default GoogleAddress



"use client";
import React , { useState } from "react";
import { MapPin } from "lucide-react";

export default function LocationSearch({ onSelectAddress }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://photon.komoot.io/api/?q=${value}&limit=5`
    );

    const data = await res.json();
    setResults(data.features);
  };

  return (
    <div className="w-full flex gap-1 items-center ">
    <MapPin className="h-10 w-10 p-2 rounded-l-lg text-primary bg-purple-200"/>
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Search location..."
        className="w-full p-2 border"
      />

      {results.length > 0 && (
        <ul className="border mt-1 bg-white">
          {results.map((item, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {

                const selectedData ={
                    address: item.properties.name || "",
                    city: item.properties.city || "",
                    country: item.properties.country || "",
                    lat: item.geometry.coordinates[1],
                    lng: item.geometry.coordinates[0],
                }

                if (onSelectAddress) {
                  onSelectAddress(selectedData);
                }
                // 👉 FULL DATA
                console.log("FULL OBJECT:", item);

                // 👉 SET INPUT VALUE
                setQuery(
                  `${item.properties.name || ""}, ${item.properties.city || ""}`
                );

                setResults([]);
              }}
            >
              {item.properties.name}, {item.properties.city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
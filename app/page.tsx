import Image from "next/image";
import ListingMapView from "./_component/ListingMapView";

export default function Home() {
  return (
    <div className="px-10 p-10">
      <ListingMapView  type="Sell"/>
      
    </div>
  );
}

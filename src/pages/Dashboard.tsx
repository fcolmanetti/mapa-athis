
import Header from "@/components/Header";
import MapComponent from "@/components/MapComponent";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="h-[calc(100vh-4rem)]">
        <MapComponent />
      </main>
    </div>
  );
};

export default Dashboard;

import HeroSection from "../components/HeroSection";
import { Link } from "react-router-dom";

export default function SelectRole() {
  return (
    <HeroSection>

      <div className="flex flex-col items-center justify-center h-full text-white">

        <h1 className="text-4xl font-bold mb-10">
          Choose Account Type
        </h1>

        <div className="grid md:grid-cols-2 gap-10">

          <Link
            to="/register-owner"
            className="p-10 border border-yellow-400 rounded-xl"
          >
            Vehicle Owner
          </Link>

          <Link
            to="/register-service"
            className="p-10 border border-yellow-400 rounded-xl"
          >
            Service Provider
          </Link>

        </div>

      </div>

    </HeroSection>
  );
}
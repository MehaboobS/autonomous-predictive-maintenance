import HeroSection from "../components/HeroSection";
import OwnerRegistrationForm from "../components/OwnerRegistrationForm";


const RegisterOwner = () => {

  return (

    <HeroSection>

      <div className="p-10 text-white max-w-4xl mx-auto">

        <h1 className="text-3xl mb-8 text-center">
          Vehicle Owner Registration
        </h1>

        <OwnerRegistrationForm />

      </div>

    </HeroSection>

  );
};

export default RegisterOwner;
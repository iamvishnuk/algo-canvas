import Footer from '@/components/core/Footer';
import Header from '@/components/core/Header';
import Challenges from '@/components/landing-page/Challenges';
import Hero from '@/components/landing-page/Hero';
import Pricing from '@/components/landing-page/Pricing';
import WhyAlgoCanvas from '@/components/landing-page/WhyAlgoCanvas';

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Challenges />
      <WhyAlgoCanvas />
      <Pricing />
      <Footer />
    </div>
  );
};

export default page;

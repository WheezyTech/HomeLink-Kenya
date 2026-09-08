import Hero from "../../components/home/Hero";
import SearchSection from "../../components/home/SearchSection";
import Categories from "../../components/home/Categories";
import FeaturedProperties from "../../components/home/FeaturedProperties";
import Statistics from "../../components/home/Statistics";
import WhyChooseUs from "../../components/home/WhyChooseUs";

function Home(){

    return(
        <>
            <Hero />

            <SearchSection />

            <Categories />

            <FeaturedProperties />

            <Statistics />

            <WhyChooseUs />

        </>
    );

}

export default Home;
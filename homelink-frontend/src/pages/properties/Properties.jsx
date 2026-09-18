import {
    useEffect,
    useState
} from "react";


import propertyService from "../../services/propertyService";

import PropertyCard from "../../components/properties/PropertyCard";
import PropertyFilters from "../../components/properties/PropertyFilters";
import SaveSearchButton from "../../components/properties/SaveSearchButton";
import "../../styles/property.css";

function Properties(){


    const [properties,setProperties] = useState([]);

    const [loading,setLoading] = useState(true);

    const handleSearch = async (filters) => {

        try {

            const data = await propertyService.searchProperties(filters);

            setProperties(data.results || data);

        } catch (error) {

            console.log(error);

        }

    };

    const handleFilter = async (filters) => {

        try {

            const data = await propertyService.getFilteredProperties(filters);

            setProperties(data.results || data);

        } catch (error) {

            console.error(error);

        }

    };


    useEffect(()=>{


        const fetchProperties = async()=>{

            try{

                const data =
                await propertyService.getProperties();


                setProperties(data);


            }catch(error){

                console.log(error);

            }
            finally{

                setLoading(false);

            }

        };


        fetchProperties();


    },[]);



    if(loading){

        return (
            <main className="properties-page">
                <div className="container properties-loading">
                    <span className="properties-loading-spinner" aria-hidden="true"></span>
                    <h2>Loading properties...</h2>
                </div>
            </main>
        );

    }



    return (

        <main className="properties-page">
            <div className="container properties-content">
                <header className="properties-header">
                    <div>
                        <p className="properties-eyebrow">HomeLink Kenya</p>
                        <h1>Available Properties</h1>
                        <p>Find a place that fits your life, location, and budget.</p>
                    </div>
                    <span className="properties-count">
                        {properties.length} {properties.length === 1 ? "listing" : "listings"}
                    </span>
                </header>

                <div className="properties-toolbar">
                <PropertyFilters onFilter={handleFilter} />
                <SaveSearchButton filters={{}} />
                </div>

                {properties.length > 0 ? (
                    <div className="properties-grid">
                        {properties.map(
                            property => (

                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />

                            )
                        )}
                    </div>
                ) : (
                    <section className="properties-empty" aria-live="polite">
                        <h2>No properties found</h2>
                        <p>Try widening your search or clearing one of the filters.</p>
                    </section>
                )}

            </div>
        </main>

    );


}


export default Properties;
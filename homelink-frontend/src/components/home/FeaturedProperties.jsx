import { useEffect, useState } from "react";
import propertyService from "../../services/propertyService";
import PropertyCard from "../properties/PropertyCard";

function FeaturedProperties() {

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        loadFeatured();
    }, []);

    const loadFeatured = async () => {

        const data = await propertyService.getProperties();

        setProperties(data.results || data);

    };

    return (

        <div className="container py-5">

            <h2 className="fw-bold mb-4">
                Featured Properties
            </h2>

            <div className="row g-4">

                {properties.slice(0, 6).map((property) => (

                    <div
                        className="col-md-4"
                        key={property.id}
                    >

                        <PropertyCard property={property} />

                    </div>

                ))}

            </div>

        </div>

    );

}

export default FeaturedProperties;
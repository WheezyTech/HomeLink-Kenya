import { useEffect, useState } from "react";

import propertyService from "../../services/propertyService";
import PropertyCard from "../../components/properties/PropertyCard";
import PropertyFilters from "../../components/properties/PropertyFilters";
import PropertySkeleton from "../../components/common/PropertySkeleton";

function Buy() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                const data = await propertyService.getBuyProperties(filters);
                setProperties(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, [filters]);

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">Properties for Sale</h2>

            <PropertyFilters filters={filters} setFilters={setFilters} />

            <div className="row mt-4">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={index}>
                            <PropertySkeleton />
                        </div>
                    ))
                ) : properties.length === 0 ? (
                    <div className="text-center py-5">
                        <h3>No properties for sale found.</h3>
                    </div>
                ) : (
                    properties.map((property) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={property.id}>
                            <PropertyCard property={property} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Buy;

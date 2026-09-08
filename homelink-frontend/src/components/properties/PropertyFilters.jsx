import { useState } from "react";

function PropertyFilters({ onFilter }) {

    const [filters, setFilters] = useState({
        county: "",
        property_type: "",
        bedrooms: "",
        price__gte: "",
        price__lte: "",
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">

                <h5 className="mb-4">
                    Search Properties
                </h5>

                <form onSubmit={handleSubmit}>

                    <div className="row g-3">

                        <div className="col-md-3">
                            <input
                                type="text"
                                name="county"
                                className="form-control"
                                placeholder="County"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                name="property_type"
                                className="form-select"
                                onChange={handleChange}
                            >

                                <option value="">
                                    Property Type
                                </option>

                                <option value="APARTMENT">
                                    Apartment
                                </option>

                                <option value="BEDSITTER">
                                    Bedsitter
                                </option>

                                <option value="ONE_BEDROOM">
                                    One Bedroom
                                </option>

                                <option value="TWO_BEDROOM">
                                    Two Bedroom
                                </option>

                                <option value="THREE_BEDROOM">
                                    Three Bedroom
                                </option>

                                <option value="SHOP">
                                    Shop
                                </option>

                                <option value="OFFICE">
                                    Office
                                </option>

                                <option value="WAREHOUSE">
                                    Godown / Warehouse
                                </option>

                                <option value="LAND">
                                    Land
                                </option>

                            </select>
                        </div>

                        <div className="col-md-2">
                            <input
                                type="number"
                                name="bedrooms"
                                className="form-control"
                                placeholder="Bedrooms"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-2">
                            <input
                                type="number"
                                name="price__gte"
                                className="form-control"
                                placeholder="Min Price"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-2">
                            <input
                                type="number"
                                name="price__lte"
                                className="form-control"
                                placeholder="Max Price"
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button
                        className="btn btn-primary mt-4"
                        type="submit"
                    >
                        Search
                    </button>

                </form>

            </div>
        </div>
    );
}

export default PropertyFilters;
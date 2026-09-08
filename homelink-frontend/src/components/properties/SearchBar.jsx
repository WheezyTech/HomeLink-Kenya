import { useState } from "react";

function SearchBar({ onSearch }) {

    const [filters, setFilters] = useState({
        county: "",
        estate: "",
        property_type: "",
        bedrooms: "",
        min_price: "",
        max_price: "",
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="card shadow-sm p-4 mb-4">

            <div className="row g-3">

                <div className="col-md-3">
                    <input
                        className="form-control"
                        name="county"
                        placeholder="County"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-3">
                    <input
                        className="form-control"
                        name="estate"
                        placeholder="Estate"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-3">
                    <select
                        className="form-select"
                        name="property_type"
                        onChange={handleChange}
                    >
                        <option value="">Property Type</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="BEDSITTER">Bedsitter</option>
                        <option value="ONE_BEDROOM">One Bedroom</option>
                        <option value="TWO_BEDROOM">Two Bedroom</option>
                        <option value="THREE_BEDROOM">Three Bedroom</option>
                        <option value="SHOP">Shop</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <button
                        className="btn btn-primary w-100"
                    >
                        Search
                    </button>
                </div>

            </div>

        </form>
    );
}

export default SearchBar;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchSection() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const searchProperty = () => {

        navigate(`/properties?search=${search}`);

    };

    return (

        <section className="container my-5">

            <div className="card p-4 shadow">

                <h3 className="mb-4">

                    Find Your Next Home

                </h3>

                <div className="row g-3">

                    <div className="col-md-8">

                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Search by title, county or estate..."
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                        />

                    </div>

                    <div className="col-md-4">

                        <button
                            className="btn btn-primary btn-lg w-100"
                            onClick={searchProperty}
                        >
                            🔍 Search
                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default SearchSection;
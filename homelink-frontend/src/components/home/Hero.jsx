import { Link } from "react-router-dom";
import "../../styles/home.css";

function Hero() {

    return (

        <section className="hero">

            <div className="container">

                <div className="hero-content">

                    <h1>
                        Find Your Dream Home in Kenya
                    </h1>

                    <p>
                        Search thousands of verified apartments,
                        houses, offices and commercial properties.
                    </p>

                    <div className="search-box">

                        <div className="row">

                            <div className="col-md-4">
                                <input
                                    className="form-control"
                                    placeholder="County"
                                />
                            </div>

                            <div className="col-md-4">
                                <select className="form-select">
                                    <option>Property Type</option>
                                    <option>Apartment</option>
                                    <option>House</option>
                                    <option>Office</option>
                                </select>
                            </div>

                            <div className="col-md-4">

                                <Link
                                    to="/properties"
                                    className="btn btn-primary w-100"
                                >
                                    Search Properties
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Hero;
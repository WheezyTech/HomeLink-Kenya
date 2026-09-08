import { Link } from "react-router-dom";

function Banner(){

    return(

        <section className="container py-5">

            <div className="banner">

                <div className="row align-items-center">

                    <div className="col-lg-8">

                        <h2>

                            Looking to Rent or Sell Your Property?

                        </h2>

                        <p>

                            Join thousands of landlords already using HomeLink Kenya.

                        </p>

                    </div>

                    <div className="col-lg-4 text-lg-end">

                        <Link
                            to="/dashboard/add-property"
                            className="btn btn-light btn-lg"
                        >
                            Post Property
                        </Link>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Banner;
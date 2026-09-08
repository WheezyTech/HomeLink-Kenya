import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import favouriteService from "../../services/favouriteService";
import PropertyCard from "../../components/properties/PropertyCard";

function Favourites() {

    const [favourites, setFavourites] =
        useState([]);

    useEffect(() => {

        loadFavourites();

    }, []);

    const loadFavourites = async () => {

        try {

            const response =
                await favouriteService.getFavourites();

            setFavourites(response);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <DashboardLayout>

            <div className="container">

                <h2 className="mb-4">

                    ❤️ My Favourite Properties

                </h2>

                <div className="row">

                    {favourites.map((fav) => (

                        <div
                            className="col-lg-4 mb-4"
                            key={fav.id}
                        >

                            <PropertyCard
                                property={fav.property}
                            />

                        </div>

                    ))}

                </div>

            </div>

        </DashboardLayout>

    );

}

export default Favourites;
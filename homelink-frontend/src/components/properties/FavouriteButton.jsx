import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

import favouriteService from "../../services/favouriteService";

function FavouriteButton({

    propertyId,

    initialFavourite = false,

}) {

    const [isFavourite, setIsFavourite] =
        useState(initialFavourite);

    const handleToggle = async () => {

        try {

            const response =
                await favouriteService.toggleFavourite(
                    propertyId
                );

            if (response.action === "added") {

                setIsFavourite(true);

                toast.success(
                    "Added to favourites"
                );

            } else {

                setIsFavourite(false);

                toast.success(
                    "Removed from favourites"
                );

            }

        } catch {

            toast.error(
                "Something went wrong"
            );

        }

    };

    return (

        <button
            className="btn btn-light"
            onClick={handleToggle}
        >

            {isFavourite ? (

                <FaHeart color="red" />

            ) : (

                <FaRegHeart />

            )}

        </button>

    );

}

export default FavouriteButton;
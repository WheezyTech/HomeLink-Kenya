import {
    useEffect,
    useState
} from "react";


import propertyService from "../../services/propertyService";

import PropertyCard from "../../components/properties/PropertyCard";
import PropertyFilters from "../../components/properties/PropertyFilters";
import SaveSearchButton from "../../components/properties/SaveSearchButton";

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

        return <h2>Loading properties...</h2>;

    }



    return (

        <div>


            <h1>
                Available Properties
            </h1>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <PropertyFilters onFilter={handleFilter} />
                <SaveSearchButton filters={{}} />
            </div>

            {
                properties.map(
                    property => (

                        <PropertyCard
                            key={property.id}
                            property={property}
                        />

                    )
                )
            }


        </div>

    );


}


export default Properties;
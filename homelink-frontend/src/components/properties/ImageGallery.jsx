import { useEffect, useState } from "react";

function ImageGallery({ images = [] }) {

    const defaultImage =
        "https://picsum.photos/900/600";

    const gallery =
        images.length > 0
            ? images.map((image) => {
                if (typeof image === "string") {
                    return image;
                }

                return image?.image || defaultImage;
            })
            : [defaultImage];

    const [selectedImage, setSelectedImage] = useState(gallery[0]);

    useEffect(() => {
        setSelectedImage(gallery[0]);
    }, [images]);

    return (

        <>

            <img
                src={selectedImage}
                className="img-fluid rounded shadow"
                style={{
                    width:"100%",
                    height:"500px",
                    objectFit:"cover"
                }}
                alt="Property gallery"
            />

            <div className="row mt-3">

                {gallery.map((image, index) => (

                    <div
                        className="col-3"
                        key={index}
                    >

                        <img
                            src={image}
                            className="img-fluid rounded"
                            style={{
                                cursor:"pointer",
                                height:"90px",
                                objectFit:"cover"
                            }}
                            onClick={() =>
                                setSelectedImage(image)
                            }
                            alt={`Gallery item ${index + 1}`}
                        />

                    </div>

                ))}

            </div>

        </>

    );

}

export default ImageGallery;
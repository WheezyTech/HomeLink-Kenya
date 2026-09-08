import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function ImageUploader({ onFilesSelected }) {

    const onDrop = useCallback((acceptedFiles) => {

        onFilesSelected(acceptedFiles);

    }, [onFilesSelected]);

    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({

        accept: {
            "image/*": []
        },

        multiple: true,

        maxFiles: 20,

    });

    return (

        <div
            {...getRootProps()}
            className={`border rounded p-5 text-center ${
                isDragActive
                    ? "border-primary"
                    : "border-secondary"
            }`}
        >

            <input {...getInputProps()} />

            <h5>

                {isDragActive
                    ? "Drop images here..."
                    : "Drag & Drop Property Images"}

            </h5>

            <p>

                or click to browse

            </p>

        </div>

    );

}

export default ImageUploader;
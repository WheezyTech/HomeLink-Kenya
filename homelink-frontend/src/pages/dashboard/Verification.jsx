import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import verificationService from "../../services/verificationService";
import { useAuth } from "../../context/AuthContext";

function Verification() {

    const { user } = useAuth();
    const [verification,setVerification]=useState(null);

    const [formData,setFormData]=useState({
        id_front:null,
        id_back:null,
        selfie:null,
        kra_pin:null,
        business_certificate:null,
    });

    useEffect(()=>{

        loadVerification();

    },[]);

    const loadVerification=async()=>{

        try{

            const res=await verificationService.getVerification();

            setVerification(res.data.data);

        }catch(error){

            console.log(error);

        }

    };

    const handleChange=(e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.files[0],

        });

    };

    const handleSubmit=async(e)=>{

        e.preventDefault();

        const data=new FormData();

        Object.keys(formData).forEach(key=>{

            if(formData[key]){

                data.append(key,formData[key]);

            }

        });

        try{

            await verificationService.uploadVerification(data);

            toast.success("Documents uploaded successfully");

            loadVerification();

        }catch{

            toast.error("Upload failed");

        }

    };

    return(

<div className="container py-4">

<h2 className="mb-4">

Account Verification

</h2>

<div className="card shadow">

<div className="card-body">

<h5>

Status:

<span className="badge bg-warning ms-2">

{verification?.status || "PENDING"}

</span>

</h5>

<form onSubmit={handleSubmit} className="mt-4">

<div className="mb-3">

<label>ID Front</label>

<input
type="file"
className="form-control"
name="id_front"
onChange={handleChange}
/>

</div>

<div className="mb-3">

<label>ID Back</label>

<input
type="file"
className="form-control"
name="id_back"
onChange={handleChange}
/>

</div>

<div className="mb-3">

<label>Selfie</label>

<input
type="file"
className="form-control"
name="selfie"
onChange={handleChange}
/>

</div>

<div className="mb-3">

<label>KRA PIN {user?.role === "AGENT" || user?.role === "LANDLORD" ? "(Required)" : "(Required)"}</label>

<input
type="file"
className="form-control"
name="kra_pin"
onChange={handleChange}
/>

</div>

{user?.role === "AGENT" && (
    <div className="mb-3">

        <label>Business Certificate (Required for agents)</label>

        <input
            type="file"
            className="form-control"
            name="business_certificate"
            onChange={handleChange}
        />

    </div>
)}

<button
className="btn btn-primary"
>

Submit Verification

</button>

</form>

</div>

</div>

</div>

    );

}

export default Verification;
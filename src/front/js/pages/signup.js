import React,{useState,useContext} from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Signup=()=>{
    const{actions}=useContext(Context);
    const navigate=useNavigate
    
    const[formData,setFormData]=useState({
        full_name:"",email:"",password:""
        

    });
    const[error,setError]=useState(null);
    const handleChange=e=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    const handleSubmit=async e=>{
        e.preventDefault();
        const{full_name,email,password}=formData;
        const response=await actions.registerUser(full_name,email,password);
        if (response.success){
            navigate("/users");
        }else{
            setError(response.message);
        }
    };

    return(
        <div className="container mt-5">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label className="form-label">Nombre Completo</label>
                    <input type="text" name="full_name" className="form-control" onChange={handleChange} value={formData.full_name} required/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Correo electronico</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} value={formData.email}required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} value={formData.password}required/>
                </div>
                
                <button type="submit" className="btn btn-primary">Registrarse</button>
            
            </form>
        </div>
    );
};

export default Signup

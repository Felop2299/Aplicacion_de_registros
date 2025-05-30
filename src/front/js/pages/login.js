import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Login = ()=>{
    const {actions}=useContext(Context);
    const navigate=useNavigate();

    const[formData,setFormData]=useState({
            full_name:"",email:"",password:""
            
    
    });
    const[error,setError]=useState(null);
    const handleChange =e=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    const handleSubmit =async e=>{
        e.preventDefault();
        const response= await actions.loginUser(formData.email,formData.password);
        if (response.success){
            navigate("/users");
        }else{
            setError(response.message);
        }
    };
    return(
        <div className="container mt-5">
            <h2>Iniciar Sesion</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                    <label className="form-label">Correo electronico</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} value={formData.email} required />

                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} value={formData.password} required />

                </div>
                <button type="submit" className="btn btn-success">Ingresar</button>
            </form>
        </div>
    );

};

export default Login;
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

const EditProfile = () => {
    const { store, actions } = useContext(Context);
    const [formData, setFormData] = useState({
        full_name: store.user?.full_name || "",
        current_password: "",
        new_password: ""
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await actions.editProfile(formData);
        if (response.success) {
            setMessage("Perfil actualizado correctamente.");
            setError(null);
        } else {
            setMessage(null);
            setError(response.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña actual</label>
                    <input
                        type="password"
                        name="current_password"
                        className="form-control"
                        value={formData.current_password}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nueva contraseña</label>
                    <input
                        type="password"
                        name="new_password"
                        className="form-control"
                        value={formData.new_password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditProfile;

import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

const UsersList = () => {
    const { store,actions} = useContext(Context);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data= await actions.fetchUsers();
                setUsers(data);
                    
               
            } catch (err) {
                setError(err.message);
            }
        };
        loadUsers();
    }, [store.token,actions]);

    return (
        <div className="container mt-5">
            <h2>Lista de Usuarios</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {users.map((user, index) => (
                    <li key={index} className="list-group-item">
                        <strong>{user.full_name}</strong> - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersList;

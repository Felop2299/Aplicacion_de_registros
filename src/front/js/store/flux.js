const getState = ({ getStore, getActions, setStore }) => {
	const API_URL = process.env.REACT_APP_BACKEND_URL || "https://fantastic-spoon-4jwjxp7x4j7wcj4xj-3001.app.github.dev";
	
	return {
		store: {
			user: null,
			usersList:[],
			token:sessionStorage.getItem("token") || null,
			
		},
		actions: {

			registerUser:async(full_name,email,password)=>{
				try{
					const resp = await fetch(`${API_URL}/api/register`,{
						method:"POST",
						headers:{"Content-type":"application/json"},
						body: JSON.stringify({full_name,email,password})
					});

					const data=await resp.json();
					if(!resp.ok) throw new Error(data.error || data.msg);

					getActions().setToken(data.token);
					getActions().setUser(data.user);

					return true;
				}catch(error){
					console.error("Error en la solicitud:",error.message);
					return false;
				}
			},
			
			loginUser:async(email,password)=>{
				try{
					const resp= await fetch(`${API_URL}/api/login`,{
						method:"POST",
						headers:{"Content-type":"application/json"},
						body:JSON.stringify({email,password}),
					}); 
					const data=await resp.json();
					if(!resp.ok)throw new Error(data.error || "Credenciales invalidas");

					getActions().setToken(data.token);
					getActions().setUser(data.user);

					return true;
				}catch(error){
					console.error("Login error",error.message);
					return false;
				}
			},


			editProfile:async(full_name,current_password,new_password)=>{
				try{
					const resp=await fetch(`${API_URL}/api/profile`,{
						method:"PUT",
						headers:{
							"Content-type":"application/json",
							"Authorization":`Bearer ${getStore().token}`,
						},
						body:JSON.stringify({full_name,current_password,new_password}),
					});
					const data= await resp.json();
					if(!resp.ok) throw new Error(data.error || "Error al editar perfil");
					getActions().setUser(data.user);
					return true;
				}catch(error){
					console.error("Error no se pudo editar el perfil:",error.message);
					return false;
				}
			},
			deleteAccount:async(password,confirm_delete)=>{
				if (!confirm_delete){
					return{succes:false,message:"Requerimos de confirmacion para eliminar la cuenta"};
				}
				try{
					const resp=await fetch(`${API_URL}/api/delete_account`,{
						method:"DELETE",
						headers:{
							"Content-Type":"application/json",
							"Authorization":`Bearer ${getStore().token}`,
						},
						body:JSON.stringify({password,confirm_delete}),
					});
					const data=await resp.json();
					if(!resp.ok)throw new Error(data.error || "Error al eliminar la cuenta");
					getActions().logout();
					return true;
				}catch(error){
					console.error("Error al eliminar la cuenta:",error.message);
					return false;
				}
			},
			fetchUsers:async()=>{
				try{
					const resp=await fetch(`${API_URL}/api/users`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${getStore().token}` },
                    });
					const data=await resp.json();
					if (!resp.ok) throw new Error("Error al obtener los usuarios");
					setStore({usersList:data});
				}catch(error){
					console.error("Fetch error:",error.message);
				}
			},

			setUser:(user)=>{
				setStore({user});
			},
			setToken:(token)=>{
				sessionStorage.setItem("token",token);
				setStore({token});
			},
			syncTokenFromSession:()=>{
				const token=sessionStorage.getItem("token");
				if (token){
					setStore({token});
				}
			},
			logout:()=>{
				sessionStorage.removeItem("token");
				setStore({token:null,user:null});
			}
		}
	};
};

export default getState;
